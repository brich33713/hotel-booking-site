from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)


class City(db.Model):
    def __repr__(self):
        """Show city info"""

        p = self
        return f"<City id={p.id} name='{p.name}' state={p.state}>"

    __tablename__ = 'cities'
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    name = db.Column(db.Text, nullable=False)
    state = db.Column(db.Text)

class Hotel(db.Model):
    def __repr__(self):
        """Show hotel info"""

        p = self
        return f"<Hotel id={p.id} city_id={p.city_id} name='{p.name}' size={p.size} capacity={p.capacity}>"
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    city_id = db.Column(db.ForeignKey('cities.id'),nullable=False)
    name = db.Column(db.Text, nullable=False, unique=True)
    description = db.Column(db.Text)
    pets = db.Column(db.Boolean)
    capacity = db.Column(db.Integer,nullable=False)
    size = db.Column(db.Integer,nullable=False)
    address = db.Column(db.Text,nullable=False,unique=True)
    breakfast = db.Column(db.Boolean,nullable=False)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hotel_id = db.Column(db.ForeignKey('hotels.id'),nullable=False)
    src = db.Column(db.Text,nullable=False)
    alt = db.Column(db.Text)

class Booking(db.Model):
    def __repr__(self):
        """Show booking info"""
        p = self
        return f"<Booking id={p.id} hotel_id='{p.hotel_id}' name={p.name}>"
        
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hotel_id = db.Column(db.ForeignKey('hotels.id'),nullable=False)
    name = db.Column(db.Text,nullable=False)
