import os
import logging
import datetime

from logging.handlers import RotatingFileHandler
from logging.handlers import TimedRotatingFileHandler
from constants import ATTACHMENT_LOGS_DIRECTORY, LOG_ROTATE_DAYS


##################################
#          Config Logger         #
##################################

# Get the logger object
logger = logging.getLogger(__name__)

# Create a handler for the console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

# Create a rotating handler for the file
if not os.path.exists(ATTACHMENT_LOGS_DIRECTORY):
    os.makedirs(ATTACHMENT_LOGS_DIRECTORY)

current_date = datetime.datetime.now().strftime("%Y-%m-%d")
file_handler = TimedRotatingFileHandler(
    f'{ATTACHMENT_LOGS_DIRECTORY}{current_date}_CMS.log',
    when='midnight',
    interval=LOG_ROTATE_DAYS,
    backupCount=3
)
file_handler.setLevel(logging.DEBUG)

file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

# Configure the logging with the specified settings
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[console_handler, file_handler]
)
