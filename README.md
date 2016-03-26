Hawkathon Project
===========
** There are 173278 recipes in the database (got it from https://github.com/fictivekin/openrecipes)**

<p align="center">
  <img src="https://raw.githubusercontent.com/Bunchhieng/Hawkathon/master/public/images/s1.png"/>
</p>

### Objective

How often do we find ourselves constantly checking the fridge to see whats inside? How often do we end up discarding forgotten food from our fridge or
finding out that we are out of eggs or milk? We decided to create a solution to this problem by implementing a Smart Refrigerator. Our solution keeps track of
the Refrigerator's inventory via QR code scanning of items placed in the fridge. In addition the application is able to recommend recipes based on the fridge's inventory using data mining. In addition we utilized the HAVENONDEMAND Machine Learning API to perform sentiment analysis on food recipe reviews.

We created a web application to display the contents of the fridge and the suggested recipes as well as adapted open source code for Qr scanning and sending JSON to our database.

### High level overview
- Generate QR code with JSON object that have property `name`, `added_date` and `expired_date`
- Mining data against 17328 recipes in the database and recommend the most highest score (createIndexes) based on name textScore
-  Each recipe come with url to the review and content website. We scrap all the content (except html tag) from the url and feed to the Havenondemand sentimental analysis API. This gives sentiment either `positive` or `negative` and the score is range from 0 to 1.

### Improvement in the future
- Twilio API to send text when foods is almost expired or amount less than x.

### Technology
- Node.js - Evented I/O for the backend
- Framework used to build the REST-based backend
- Havenondemand machine learning API - sentimental analysis
- Mongodb - database

### How to use
- download recipes database https://github.com/fictivekin/openrecipes
- load recipes to Mongodb: `mongoimport --db test --collection recipes --drop --file recipeitems-latest.json`
- load fridge data: `mongoimport --db test --collection fridge --drop --file fridge.json`
- `npm install`
- `npm run`
