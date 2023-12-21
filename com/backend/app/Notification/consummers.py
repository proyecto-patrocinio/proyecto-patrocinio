import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


CONSULTANCY_GROUP_NAME = "group_consultancy"
BOARD_BASE_GROUP_NAME = "group_board_"


logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    """Websocket consumer for handling notifications."""

    async def connect(self) -> None:
        """Connects to the websocket and adds the consumer to the specified group."""
        try:
            self.room_group_name = self.scope['url_route']['kwargs']['room_name']
            logger.info(f"Connecting to websocket {self.room_group_name}.")
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
            logger.info("Successfully connected to websocket.")
        except Exception as e:
            logger.error(f"Failed to conect with socket: {str(e)}")

    async def disconnect(self, close_code) -> None:
        """Disconnects the consumer from the group when the connection is closed.

        Args:
            close_code: Close code for the disconnection.
        """
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            logger.error(f"Failed to disconnect from websocket with close code: {close_code}.")

    async def receive(self, text_data=None, bytes_data=None) -> None:
        """Receives data from the WebSocket and broadcasts it to the group.

        Args:
            text_data (str|None): Text data received from the WebSocket.
            bytes_data (any): data bytes received from the WebSocket.
        """
        user = self.scope["user"]
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            logger.info(f"Receiving message...")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'notification.group.message',
                    'message':message,
                }
            )
            logger.info(f"Successfully sent message from '{user}' to '{self.room_group_name}' group.")
        except Exception as e:
            logger.error(f"Error in receive notification message from {user}: " + str(e))

    async def notification_group_message(self, event: any) -> None:
        """Sends a message to the consumer. (Then, it executes 'receive notification' fuction.)

        Args:
            event (dict): Event data received from the group.
        """
        try:
            message = event['message']
            await self.send(text_data=json.dumps({
                'message':message,
            }))
        except Exception as e:
            logger.error("Error in send notification message: "+str(e))


def send_sync_group_message(group_name: str, message: str) -> None:
    """Sends a synchronous group message.

    Args:
        group_name (str): Name of the group to send the message to.
        message (str): Message to be sent.
    """
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(group_name, {"type": "notification.group.message", "message":message})
    except Exception as e:
        logger.error(f"Error trying to send sync group message for group '{group_name}': {str(e)}")
