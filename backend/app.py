from flask import Flask, request
from models import db, connect_db, City, Hotel, Image
import requests
import random
import os
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse


# Your Account Sid and Auth Token from twilio.com/console
# and set the environment variables. See http://twil.io/secure

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///hotel_db'
connect_db(app) 

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
        'x-rapidapi-key': "bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a",
        'x-rapidapi-host': "hotels4.p.rapidapi.com"
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        id = response.json()["suggestions"][0]["entities"][0]["destinationId"]
        returnVal.append({"name":city,"id":id})
        return City(id=id,name=city)

    cities = list(map(getCityId,cities))
    db.session.add_all(cities)
    db.session.commit()

    return {"cities added":returnVal}

@app.route("/api/hotel/<cityId>",methods=['POST'])
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
        'x-rapidapi-key': "bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a",
        'x-rapidapi-host': "hotels4.p.rapidapi.com"
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
        'x-rapidapi-key': "bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a",
        'x-rapidapi-host': "hotels4.p.rapidapi.com"
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
        'x-rapidapi-key': "bda788308fmsh78144b62705d0f9p18ffb6jsn34c349cac67a",
        'x-rapidapi-host': "hotels4.p.rapidapi.com"
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
    # hotels = [{"id":hotel.id}]


    account_sid = 'ACb57a1883291371431e1bf2a04b1ff5d1'
    auth_token = 'd31b59f0297bb8d130e8f7e50f5f8b1c'
    client = Client(account_sid, auth_token)

    # message = client.messages \
    #             .create(
    #                  body="Join Earth's mightiest heroes. Like Kevin Bacon.",
    #                  from_='+14159037060',
    #                  to='+16784623650'
    #              )

    # print(message.sid)
    return {"hotels": city_id}

@app.route("/sms",methods=["POST"])
def sms():
    #Twilio credentials
    account_sid = 'ACb57a1883291371431e1bf2a04b1ff5d1'
    auth_token = 'd31b59f0297bb8d130e8f7e50f5f8b1c'
    client = Client(account_sid, auth_token)


    # number = request.form['From']
    message_body = str(request.form['Body'])
    # splits msg into an array. Ex: 'Get me a 2 bd' => ['get','me,'a','2','bd']
    message_body = message_body.lower().split(' ')
    if message_body[0] == 'get':
        city = " ".join(message_body[6:])
        print(f"******************{city}")
        city = City.query.filter_by(name = city).all()[0]
        hotels = Hotel.query.filter_by(city_id=city.id).all()

    response = f"We have your {' '.join(message_body[3:])}"
    hotel = f"http://1d3172af3746.ngrok.io/room/{hotels[0].id}"
    print(city)
    message = client.messages \
                .create(
                    body = 'We have your {}. Click the following link >> {}' \
                        .format(response,hotel),
                     from_='+14159037060',
                     to='+16784623650'
                 )

    return {"number":"number"}