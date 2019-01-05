
var mongoose = require('mongoose');
// Define schema
var Schema = mongoose.Schema;


var landloc = new Schema({
    country: String,
    landlocked: Boolean,
    symbol: String

},{collection : 'country'});

// Compile model from schema
var landlock = mongoose.model('landlock', landloc );
module.exports =  landlock;