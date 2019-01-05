var mongoose = require('mongoose');
// Define schema
var Schema = mongoose.Schema;


var latlon = new Schema({
    name: String,
    latitude: Number,
    longitude: Number

},{collection : 'latlon'});

// Compile model from schema
var latlonModel = mongoose.model('latlon', latlon );
module.exports =  latlonModel;