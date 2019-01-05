var mongoose = require('mongoose');
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
var record = mongoose.model('record', Record );
module.exports =  record;