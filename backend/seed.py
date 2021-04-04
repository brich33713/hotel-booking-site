from app import app
from models import db, Hotel, City, Image, Booking, User, UserHotel

db.drop_all()
db.create_all()

