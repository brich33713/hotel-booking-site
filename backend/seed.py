from app import app
from models import db, City, Hotel, Image, Booking

db.drop_all()
db.create_all()

