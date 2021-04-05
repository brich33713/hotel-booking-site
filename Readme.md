**To Start Application you will need 2 terminals, HOTEL API credentials, database (Postgres), twilio account, and public address (ngrok)**

Replace Twilio credentials on lines 16,17, and 18 of app.py
Replace API credentials on line 21 and 22 of app.py


cd ../hotel

1. npm start
2. npm start-backend
3. Use ngrok or public address to forward to

Seed database:

1. post request to /api/city

{city: [cityName, cityName2, ...]}

returns city ids

2. post request to /api/city/<city-id>/hotels


**User flow**

1. Users text 'Get me a (#) bd in (City Name)
2. If user doesn't exist, app will get name from user and load in database
3. App sends link to hotel
4. App queries if user likes hotel or not
5. If user responds yes, app sends confirmation email, else app checks whether or not to send next hotel

**Features**

Dynamic link building
User database that tracks user progress
Dynamic page building
Messaging response logic


**Tools used**

1. Ngrok
2. Twilio
3. Hotel API by apidojo
4. Python
5. React
6. Postgres



