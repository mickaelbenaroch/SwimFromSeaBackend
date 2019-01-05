//Import the mongoose module
var mongoose = require('mongoose');
const express = require('express');
var router = express.Router();
var groupBy = require('group-by');
var modelClass = require('./Models/resultModel');
var recordSchema = require('./Models/record');
var latlonSchema = require('./Models/latlon');
var landlocked = require('./Models/landlock')
var cors = require('cors')

// initialize our express app
const app = express();
app.use(allowCrossDomain);
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

 let port = process.env.PORT || 8082


app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

app.get('/', function (req, res) {
      //Set up default mongoose connection
      var mongoDB = 'mongodb://usr1_name:usr1_pass@ds119988.mlab.com:19988/swim_from_sea';
      mongoose.connect(mongoDB);
      // Get Mongoose to use the global promise library
      mongoose.Promise = global.Promise;
      //Get the default connection
      var db = mongoose.connection;
      //Bind connection to error event (to get notification of connection errors)
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  
  
      var countryArray;
      var countryKeys;
      var contryDisipline;
      var latlonarray = [];
      var returnedArray = [];
  
      //Finally, just add the lat and lon to each model from the 'latlon' collection
      latlonSchema.find(function (err, doc) {
          if(err){
          console.log("an error ocurred on reading the latlon collection"  + err);
          };
          if(doc){
              latlonarray = doc;
          }
      });
  
      recordSchema.find( function (err, doc) {
          if(err){
            console.log(err);
          };
          if(doc){
              //Step 1: group all the records by country
              countryArray = groupBy(doc, 'Country');
              //console.log(Object.keys(countryArray));
              countryKeys = Object.keys(countryArray);
              //console.log("testttt "  + countryArray[countryKeys[0]])
              for(var i=0; i<(countryKeys.length -1); i++)
              {
                  //Step 2: group all the countries by Discipline
                  contryDisipline = groupBy(countryArray[countryKeys[i]],'Discipline');
                  //console.log(contryDisipline);
                  var mod = new modelClass();
                  var temp = Object.keys(contryDisipline);
  
                  //Step 3: Filing the Models
                  for(var j=0; j<temp.length; j++)
                  {
                      //Set name of the country
                      mod.country = contryDisipline[temp[j]][0].Country;
                      mod.name = mod.country;
  
                      //Set how much medals the country got in each discipline
                      switch(temp[j]){
                        case "Swimming": case "Synchronized Swimming":
                        mod.swimming = contryDisipline[temp[j]].length;
                        break;
                        case "Sailing":
                        mod.sailing = contryDisipline[temp[j]].length;
                        break;
                        case "Diving":
                        mod.diving = contryDisipline[temp[j]].length;
                        break;
                        case "Rowing":
                        mod.rowing = contryDisipline[temp[j]].length;
                        break;
                        case "Rowing":
                        mod.rowing = contryDisipline[temp[j]].length;
                        break;
                        case "Beach volley.": case "Beach volley": case "Beach Volleyball":
                        mod.beachVolleyball = contryDisipline[temp[j]].length;
                        break;
                        case "Canoe Slalom": case "Canoe Sprint": case "Marathon swimming": case "Trampoline": case "Water Motorspor":
                        mod.other += contryDisipline[temp[j]].length;
                        break;
                        case "Water Polo": case "Water polo":
                        mod.waterPolo = contryDisipline[temp[j]].length;
                      }
                     
                  }
  
                  //Set the medal total of the country
                  mod.medals = mod.beachVolleyball + mod.diving + mod.other + mod.rowing + mod.sailing + mod.swimming + mod.waterPolo;
                  
                  //Set the bad,medium, good property depends on the total of medal
                  if(mod.medals < 300)
                      mod.fillKey = "BAD";
                  else if(mod.medals > 300 && mod.medals < 1000)
                      mod.fillKey = "MEDIUM";
                  else
                      mod.fillKey = "GOOD";    
                  
                  //Set the radius of the bubble depens on total medal
                  mod.radius = Math.ceil(((mod.medals*100)/1679) + 5);    
  
                  console.log("TESTT" + mod.country) 
                  //Associate to each country its lat and lon values
                  var t = latlonarray.find(a=>a.name == mod.country);
                  if(t !== undefined && t !== null){
                      console.log(t.latitude);
                      mod.latitude = t.latitude;
                      mod.longitude = t.longitude;
                  }
                  if(mod.country == "Germany"){console.log(mod)}
  
                  //console.log(mod);
                  returnedArray.push(mod);
                }
                
                res.status(200).send(returnedArray);  
                res.end();
           console.log("resultArray" + JSON.stringify(returnedArray[0]));       
          } else {
            console.log("Sorry, we don't recognize that url");
          }
         }); 
         latlonSchema.count({}, function( err, count){
          console.log( "Number of lockland countries:", count );
      })
         recordSchema.count({}, function( err, count){
          console.log( "Number of users:", count );
      })
    
  });

  app.get('/landlock', function (req, res) {

    //Set up default mongoose connection
    var mongoDB = 'mongodb://usr1_name:usr1_pass@ds119988.mlab.com:19988/swim_from_sea';
    mongoose.connect(mongoDB);
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    //Get the default connection
    var db = mongoose.connection;
    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

      var landlockArray = [];
      var resultLandLock = [];
    landlocked.find(function (err, doc) {
        if(err){
        console.log("an error ocurred on reading the latlon collection"  + err);
        };
        if(doc){
            landlockArray = doc;
           landlockArray.forEach(elem => {
                if(elem !== null)
                    resultLandLock.push(elem.symbol);
            });
           
        }});

       var response = {
        'AFG': {fillKey: 'SEASHORE'},
        'AND': {fillKey: 'SEASHORE'},
        'ARM': {fillKey: 'SEASHORE'},
        'AUT': {fillKey: 'SEASHORE'},
        'AFG': {fillKey: 'SEASHORE'},
        'AZE': {fillKey: 'SEASHORE'},
        'BLR': {fillKey: 'SEASHORE'},
        'BTN': {fillKey: 'SEASHORE'},
        'BOL': {fillKey: 'SEASHORE'},
        'BOT': {fillKey: 'SEASHORE'},
        'CAF': {fillKey: 'SEASHORE'},
        'CZE': {fillKey: 'SEASHORE'},
        'ETH': {fillKey: 'SEASHORE'},
        'HNG': {fillKey: 'SEASHORE'},
        'KAZ': {fillKey: 'SEASHORE'},
        'KGZ': {fillKey: 'SEASHORE'},
        'LAO': {fillKey: 'SEASHORE'},
        'LSO': {fillKey: 'SEASHORE'},
        'LIE': {fillKey: 'SEASHORE'},
        'LUX': {fillKey: 'SEASHORE'},
        'MKD': {fillKey: 'SEASHORE'},
        'MWI': {fillKey: 'SEASHORE'},
        'MLI': {fillKey: 'SEASHORE'},
        'MDA': {fillKey: 'SEASHORE'},
        'MNG': {fillKey: 'SEASHORE'},
        'NPL': {fillKey: 'SEASHORE'},
        'NGR': {fillKey: 'SEASHORE'},
        'PRG': {fillKey: 'SEASHORE'},
        'RRW': {fillKey: 'SEASHORE'},
        'SMR': {fillKey: 'SEASHORE'},
        'SRB': {fillKey: 'SEASHORE'},
        'SVK': {fillKey: 'SEASHORE'},
        'SSD': {fillKey: 'SEASHORE'},
        'SUI': {fillKey: 'SEASHORE'},
        'TJK': {fillKey: 'SEASHORE'},
        'TCD': {fillKey: 'SEASHORE'},
        'TKM': {fillKey: 'SEASHORE'},
        'UGA': {fillKey: 'SEASHORE'},
        'UZB': {fillKey: 'SEASHORE'},
        'ZMB': {fillKey: 'SEASHORE'},
        'ZWE': {fillKey: 'SEASHORE'},
        'XWB': {fillKey: 'SEASHORE'},
        'PRY': {fillKey: 'SEASHORE'}
    }
       res.status(200).send(response);
       res.end();

    });



