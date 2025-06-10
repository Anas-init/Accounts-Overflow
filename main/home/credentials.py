import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

API_KEY= os.environ["API_KEY"]
PASSWORD = os.environ["PASSWORD"]
HOST = os.environ["HOST"]
NAME = os.environ["NAME"]
USER = os.environ["USER"]
PORT = os.environ["PORT"]
