from flask import Flask, request
from models import db, connect_db, City, Hotel, Image, User, Booking, UserHotel
import requests
import random
import os
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///hotel_db'
connect_db(app)
CORS(app)
BASE_URL = 'http://c62a282c6b4c.ngrok.io'
#Twilio credentials
account_sid = 'REPLACE ME'
auth_token = 'REPLACE ME'
from_number = 'REPLACE ME'

# API credentials
api_password = "REPLACE ME",
api_username = "REPLACE ME"
client = Client(account_sid, auth_token)

@app.route("/api/hotel/<id>",methods=["GET"])
def getRoom(id):
    # Will return {name,images,description,price,size, capacity, pets, breakfast,location}
    hotel = Hotel.query.get(id)
    if hotel is None:
        return {}
    city = City.query.filter_by(id=hotel.city_id).all()[0]
    images = [{"src":image.src,"alt":image.alt} for image in Image.query.filter_by(hotel_id=hotel.id).all()]
    return {
        'name':hotel.name,
        'description':hotel.description,
        'size':hotel.size,
        'capacity':hotel.capacity,
        'pets':hotel.pets,
        'breakfast':hotel.breakfast,
        'address':hotel.address,
        'location': city.name,
        'images': images
    }

# routes for initially seeding database

@app.route("/api/city",methods=['POST'])
def addCity():
    # request format should be { "cities": [cityName1,cityName2,...]}
    cities = request.json['cities']
    cityArr = [city.name for city in City.query.all()]
    
    # Check if city is not already in database
    def checkIfExists(city):
        if city not in cityArr:
            return city

    # # Filter out cities already in database
    cities = list(filter(checkIfExists,cities))
    returnVal = []
    # # makes an API call an grabs id for the city
    def getCityId(city):
        url = "https://hotels4.p.rapidapi.com/locations/search"
        querystring = {"query":city,"locale":"en_US"}
        headers = {
        'x-rapidapi-key': api_password,
        'x-rapidapi-host': api_username
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        
        id = response.json()["suggestions"][0]["entities"][0]["destinationId"]
        returnVal.append({"name":city.lower(),"id":id})
        return City(id=id,name=city.lower())

    cities = list(map(getCityId,cities))
    db.session.add_all(cities)
    db.session.commit()

    return {"cities added":returnVal}

@app.route("/api/city/<cityId>/hotels",methods=['POST'])
def addHotel(cityId):
    # Currently, not allowing hotels to be entered for cities that already have hotels
    if len(Hotel.query.filter_by(city_id = cityId).all()) != 0:
        return {"response": 'City already exists'}
    
    # Get hotels located in city
    def getHotels(cityId):
        url = "https://hotels4.p.rapidapi.com/properties/list"
        querystring = {"destinationId": cityId,"pageNumber": '1',
        "checkIn": '2021-05-30',"checkOut": '2021-06-02',
        "pageSize": '25',"adults1": '1'
        }
        headers = {
        'x-rapidapi-key': api_password,
        'x-rapidapi-host': api_username
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        response = response.json()["data"]["body"]["searchResults"]["results"]
        # Currently getting first 5 hotels as to overuse API
        return response[:5]
        # return City(id=id,name=city)
    
    # Returns Array of new Hotel models
    def createHotels(hotelData):
        allowPets = (random.randint(1,2) == 2)
        numBeds = random.randint(1,3)
        hasBreakfast = (random.randint(0,1) == 1)

        url = "https://hotels4.p.rapidapi.com/properties/get-details"
        querystring = {"id":hotelData["id"]}
        headers = {
        'x-rapidapi-key': api_password,
        'x-rapidapi-host': api_username
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        description = response.json()["data"]["body"]["propertyDescription"]["tagline"][0]
        
        address = f"{hotelData['address']['streetAddress']},{hotelData['address']['locality']},{hotelData['address']['region']}, {hotelData['address']['postalCode']}"
        return Hotel(address= address,
            name=hotelData["name"],
            id=hotelData["id"],
            city_id=cityId,
            capacity=numBeds * 2,
            pets= allowPets,
            size=numBeds,
            breakfast=hasBreakfast,
            description=description
        )

    # Gets images for hotel
    def getImages(hotelData):
        # get hotel images
        url = "https://hotels4.p.rapidapi.com/properties/get-hotel-photos"
        querystring = {"id":hotelData["id"]}
        headers = {
        'x-rapidapi-key': api_password,
        'x-rapidapi-host': api_username
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        
        # loop over first 5 images and grabs base url
        images = [image["baseUrl"] for image in response.json()["hotelImages"][:5]]
        
        # images provide base url as string with {size} and sizes attributes. Going to just insert z and adjust with CSS
        size = 'z.jpg'
        images = [image[:len(image)-10]+size for image in images]
        return {"id":hotelData["id"],"images":images}
    
    # returns Array of new Image Models
    def createImages(imageData):
        id = imageData["id"]
        imageArr = []

        for image in imageData["images"]:
            imageArr.append(Image(hotel_id=id,src=image))

        db.session.add_all(imageArr)
        db.session.commit()
        return "finished"

    # get 5 hotels for city
    hotels = getHotels(cityId)

    # format Hotel data to be added to database
    createdHotels = list(map(createHotels,hotels))

    # Adding hotel and image data to database separate to avoid any missing hotel_id issues on images table
    db.session.add_all(createdHotels)
    db.session.commit()

    # loop of each hotel and get images. Images => {id: hotel id, images: [formatted image links]}
    hotelImages = list(map(getImages,hotels))

    images = list(map(createImages,hotelImages))

    return {"results":"Database Updated"}

@app.route("/api/city",methods=["GET"])
def getCity():
    city = request.json["city"].lower()
    city_id = City.query.filter_by(name=city).all()[0].id
    hotels = Hotel.query.filter_by(city_id=city_id).all()

    def getHotelData(hotel):
        return {
            "id": hotel.id,
            "name": hotel.name,
            "size": hotel.size,
            "capacity": hotel.capacity,
            "pets": hotel.pets,
            "breakfast": hotel.breakfast,
            "description": hotel.description,
            "address": hotel.address
        }
    
    hotels = list(map(getHotelData,hotels))

    return {"hotels": hotels}

@app.route("/sms",methods=["POST"])
def sms():
    number = request.form['From']
    message_body = str(request.form['Body']).lower()

    # loop over hotels to create UserHotel data
    def createUserHotels(hotel):
        curr_userhotels = [hotel.hotel_id for hotel in UserHotel.query.filter_by(user_id=user.id,hotel_id = hotel.id).all()]
        if hotel.id not in curr_userhotels:
            return True
        else:
            return False
        
    
    user = User.query.filter_by(phone=number).first()
    # if there's no user, creates user
    if user == None:
        new_user = User(phone=request.form['From'],message=message_body)
        db.session.add(new_user)
        db.session.commit()
        message = client.messages \
                .create(
                    body = 'Welcome to Booking Site! What is your name? Please respond with only: FirstName LastName' \
                        .format(),
                     from_=from_number,
                     to=number
                 )
        
        return {"endpoint":"new user recognized"}

    # user = user[0]
    # splits msg into an array. Ex: 'Get me a 2 bd' => ['get','me,'a','2','bd']
    message_body = message_body.lower().split(' ')

    if user.name == None:
        user.name = " ".join(message_body)
        user.step = 'fully registered'
        db.session.commit()
        message_body = user.message.split(' ')
        respond_message = ' '.join(message_body[3:])
        message = client.messages \
                .create(
                    body = 'Nice to meet you {}. Let me get you that {} one moment' \
                        .format(user.name,respond_message),
                     from_=from_number,
                     to=number
                 )




    if user.step == 'hotel receipt':
        hotel = UserHotel.query.filter_by(user_id = user.id,city_id = user.search_city).first()
        if message_body[0] == 'no':
            if hotel == None:
                user.step = 'fully registered'
                db.session.commit()
                message = client.messages \
                .create(
                    body = 'Sorry {}, no more hotels available in {}' \
                        .format(user.name,user.search_city),
                     from_=from_number,
                     to=number
                )
                return {"endpoint":"No hotels left to send"}
            user.step = 'hotel rejected'
            db.session.delete(hotel)
            db.session.commit()
            message = client.messages \
                .create(
                    body = 'Would you like to see the next hotel?' \
                        .format(),
                    from_='+14159037060',
                    to=number
                )
            return {"endpoint":"Hotel Rejected"}

        elif message_body[0] == 'yes':
            new_booking = Booking(user_id=user.id,hotel_id=hotel.hotel_id,name=user.name)
            db.session.add(new_booking)
            user.step = 'fully registered'
            db.session.commit()
            message = client.messages \
                .create(
                    body = 'Congratulations {}! Your stay has been booked. Confirmation #{}' \
                        .format(user.name,new_booking.id),
                     from_=from_number,
                     to=number
                )
            return {"endpoint":"Hotel Booked"}

    if user.step == 'hotel rejected':
        if message_body[0] == 'no':
            user.step = 'fully registered'
            db.session.commit()
            message = client.messages \
                .create(
                    body = 'Ok. We look forward to hearing from you again soon' \
                        .format(),
                     from_=from_number,
                     to=number
                )
            return {"endpoint":"No more hotels requested"}

        elif message_body[0] == 'yes':
            userhotel = UserHotel.query.filter_by(user_id = user.id,city_id = user.search_city).first()
            if userhotel == None:
                user.step = 'fully registered'
                db.session.commit()
                message = client.messages \
                .create(
                    body = 'Sorry {}, no more hotels available in {}' \
                        .format(user.name,user.search_city),
                     from_=from_number,
                     to=number
                )
                return {"endpoint":"No hotels left to send"}
            else:
                user.step == 'hotel receipt'
                hotel = Hotel.query.get(userhotel.hotel_id)
                response = 'Here is your next hotel'
        
        else:
            message = client.messages \
                .create(
                    body = 'Sorry unable to process that response. Please say either yes or no.' \
                        .format(),
                     from_=from_number,
                     to=number
                )
            return {"endpoint":"Invalid response"}



    if message_body[0] == 'get':
        # get city name from message and query database
        city = " ".join(message_body[6:])
        city = City.query.filter_by(name = city).all()
        
        # if city is found
        if city:
            hotels = Hotel.query.filter_by(city_id=city[0].id).all()
            print(hotels)
            # if no hotels for city
            if len(hotels) == 0:
                message = client.messages \
                .create(
                    body = 'No hotels yet available in {}' \
                        .format(' '.join(message_body[3:])),
                     from_=from_number,
                     to=number
                 )
                
                return {"endpoint": "Message processed, but no hotels in the city"}

        else:
            message = client.messages \
                .create(
                    body = '{} is not yet available' \
                        .format(' '.join(message_body[3:])),
                     from_='+14159037060',
                     to=number
                 )
            
            return {"endpoint": "Message processed, but city not in database"}

        hotel = hotels[0]
        hotels = list(filter(createUserHotels,hotels))
        
        if hotels != None:
            for x in hotels:
                db.session.add(x.id)
            db.session.commit()
        response = f"We have your {' '.join(message_body[3:])}"
    
    hotel_url = f"{BASE_URL}/hotel/{hotel.id}"
    user.search_city = hotel.city_id
    user.step = 'hotel receipt'
    db.session.commit()
    
    message = client.messages \
        .create(
        body = '{}. Click the following link >> {}' \
            .format(response,hotel_url),
        from_=from_number,
        to=number
        )


    message = client.messages \
        .create(
        body = 'Would you like to book this hotel?' \
            .format(user.name),
        from_=from_number,
        to=number
        )            
    return {"endpoint": "Message processed, hotel sent"}