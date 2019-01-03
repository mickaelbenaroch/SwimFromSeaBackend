//Import the mongoose module
var mongoose = require('mongoose');
const express = require('express');
// initialize our express app
const app = express();

let port = 3000;


// Define schema
var Schema = mongoose.Schema;

var Record = new Schema({
  Year: Number,
  City: String,
  Sport: String,
  Discipline: String,
  Athlete: String,
  Country: String,
  Gender: String,
  Event: String,
  Medal: String,

},{ collection : 'olympic_collection' });



// Compile model from schema
var SomeModel = mongoose.model('SomeModel', Record );



app.listen(port, () => {
    
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
    SomeModel.find( function (err, doc) {
        if(err){
          console.log(err);
        };
        if(doc){
            countryArray = doc.sort(a => a.Country);
            console.log(countryArray)
        } else {
          console.log("Sorry, we don't recognize that url");
        }
       }); 
      
       SomeModel.count({}, function( err, count){
        console.log( "Number of users:", count );
    })
    console.log('Server is up and running on port numner ' + port);
});
