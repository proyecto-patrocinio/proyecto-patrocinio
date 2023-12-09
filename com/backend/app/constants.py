import os

ATTACHMENT_FILES_DIRECTORY = os.environ.get('ATTACHMENT_BASE_DIRECTORY'+"files/", '/opt/patrocinio/files/')
ATTACHMENT_LOGS_DIRECTORY = os.environ.get('ATTACHMENT_BASE_DIRECTORY'+"logs/", '/opt/patrocinio/logs/')
CONSULTANCY_BOARD_NAME = os.environ.get('CONSULTANCY_BOARD_NAME', 'Consultancy')
LOG_ROTATE_DAYS = int(os.environ.get('LOG_ROTATE_DAYS', 10))
