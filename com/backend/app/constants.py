import os

ATTACHMENT_FILES_DIRECTORY = os.environ.get('ATTACHMENT_BASE_DIRECTORY', '/opt/patrocinio/') + "files/"
ATTACHMENT_LOGS_DIRECTORY = os.environ.get('ATTACHMENT_BASE_DIRECTORY', '/opt/patrocinio/') + "logs/"
CONSULTANCY_BOARD_NAME = os.environ.get('CONSULTANCY_BOARD_NAME', 'Consultancy')
LOG_ROTATE_DAYS = int(os.environ.get('LOG_ROTATE_DAYS', 10))
