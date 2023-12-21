/********************************************************
 * Web Socket Publisher / Subscription for Notification *
 ********************************************************/
import { useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import AlertSnackbar from "../components/AlertSnackbar"


// Name of channels to connect (See in backend)
export const CONSULTANCY_GROUP_NAME = "group_consultancy";
export const BOARD_BASE_GROUP_NAME = "group_board_";


/**
 * Notification component that connects to a WebSocket server and displays notifications.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.channelName - Name of the channel the component subscribes to.
 * @param {Function} [props.onReceiveMessage=() => {}] - Function executed upon receiving a new message.
 * @returns {JSX.Element} - Notification element.
 */
export const Notification = ({channelName, onReceiveMessage = () => {}}) => {
    const [alertMessage, setAlertMessage] = useState("");
    const WS_URL = process.env.REACT_APP_WS_NOTIFICATION_PATH_PATROCINIO + channelName + "/";
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
        share: false,
        shouldReconnect: () => true,
        },
    );

    // Run when the connection state (readyState) changes
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
        sendJsonMessage({
            event: "subscribe",
            data: {
                channel: channelName,
            },
            message: null
        })
        }

    // eslint-disable-next-line
    }, [readyState, channelName])

    // Run when a new WebSocket message is received (lastJsonMessage)
    useEffect(() => {
        if (lastJsonMessage?.message) {
            console.info(`Got a new notification: ${lastJsonMessage?.message}`)
            setAlertMessage(lastJsonMessage?.message);
            onReceiveMessage();
        }
    // eslint-disable-next-line
    }, [lastJsonMessage])


    return <AlertSnackbar key={"notification-alert"} onClose={() => setAlertMessage("")} message={alertMessage} severity={'info'}/>

}
