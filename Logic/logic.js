var consts = require('../Consts/mongo');
var groupBy = require('group-by');
var mongoose = require('mongoose');
var landlocked = require('../Models/landlock');
var modelClass = require('../Models/resultModel');
var recordSchema = require('../Models/record');
var latlonSchema = require('../Models/latlon');

class Record {
    constructor() {
        //connect to mlab
        mongoose.connect(consts.MLAB_KEY).then(() => {
            console.log("Connect to AlarMe DB");
        }).catch(err => {
            console.log(`connection AlarMe DB error: ${err}`);
        });
    }


    /* GET*/
    GetBubbleArray() {
        return new Promise((res, rej) => {

            var countryArray;
            var countryKeys;
            var contryDisipline;
            var latlonarray = [];
            var returnedArray = [];

            //First, just add the lat and lon to each model from the 'latlon' collection
            latlonSchema.find(function (err, doc) {
                if (err) {
                    console.log("an error ocurred on reading the latlon collection" + err);
                };
                if (doc) {
                    latlonarray = doc;
                }
            });

            recordSchema.find(function (err, doc) {
                if (err) {
                    console.log(err);
                };
                if (doc) {
                    //Step 1: group all the records by country
                    countryArray = groupBy(doc, 'Country');
                    //console.log(Object.keys(countryArray));
                    countryKeys = Object.keys(countryArray);
                    //console.log("testttt "  + countryArray[countryKeys[0]])
                    for (var i = 0; i < (countryKeys.length - 1); i++) {
                        //Step 2: group all the countries by Discipline
                        contryDisipline = groupBy(countryArray[countryKeys[i]], 'Discipline');
                        //console.log(contryDisipline);
                        var mod = new modelClass();
                        var temp = Object.keys(contryDisipline);

                        //Step 3: Filing the Models
                        for (var j = 0; j < temp.length; j++) {
                            //Set name of the country
                            mod.country = contryDisipline[temp[j]][0].Country;
                            mod.name = mod.country;

                            //Set how much medals the country got in each discipline
                            switch (temp[j]) {
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
                        if (mod.medals < 300)
                            mod.fillKey = "BAD";
                        else if (mod.medals > 300 && mod.medals < 1000)
                            mod.fillKey = "MEDIUM";
                        else
                            mod.fillKey = "GOOD";

                        //Set the radius of the bubble depens on total medal
                        mod.radius = Math.ceil(((mod.medals * 100) / 1679) + 5);

                        console.log("TESTT" + mod.country)
                        //Associate to each country its lat and lon values
                        var t = latlonarray.find(a => a.name == mod.country);
                        if (t !== undefined && t !== null) {
                            console.log(t.latitude);
                            mod.latitude = t.latitude;
                            mod.longitude = t.longitude;
                        }
                        returnedArray.push(mod);
                    }
                    res(returnedArray);

                } else {
                    console.log("Sorry, we don't recognize that url");
                }
            });
        });
    }


    /*GET*/
    GetLandlockedCountriesList() {
        return new Promise((res, rej) => {

            var landlockArray = [];
            var resultLandLock = [];
            landlocked.find(function (err, doc) {
                if (err) {
                    console.log("an error ocurred on reading the latlon collection" + err);
                };
                if (doc) {
                    landlockArray = doc;
                    landlockArray.forEach(elem => {
                        if (elem !== null){
                            resultLandLock.push(elem.symbol );
                        }
                    })
                    //res(resultLandLock);
                }
            });

            var response = {
                'AFG': { fillKey: 'SEASHORE' },
                'AND': { fillKey: 'SEASHORE' },
                'ARM': { fillKey: 'SEASHORE' },
                'AUT': { fillKey: 'SEASHORE' },
                'AFG': { fillKey: 'SEASHORE' },
                'AZE': { fillKey: 'SEASHORE' },
                'BLR': { fillKey: 'SEASHORE' },
                'BTN': { fillKey: 'SEASHORE' },
                'BOL': { fillKey: 'SEASHORE' },
                'BOT': { fillKey: 'SEASHORE' },
                'CAF': { fillKey: 'SEASHORE' },
                'CZE': { fillKey: 'SEASHORE' },
                'ETH': { fillKey: 'SEASHORE' },
                'HNG': { fillKey: 'SEASHORE' },
                'KAZ': { fillKey: 'SEASHORE' },
                'KGZ': { fillKey: 'SEASHORE' },
                'LAO': { fillKey: 'SEASHORE' },
                'LSO': { fillKey: 'SEASHORE' },
                'LIE': { fillKey: 'SEASHORE' },
                'LUX': { fillKey: 'SEASHORE' },
                'MKD': { fillKey: 'SEASHORE' },
                'MWI': { fillKey: 'SEASHORE' },
                'MLI': { fillKey: 'SEASHORE' },
                'MDA': { fillKey: 'SEASHORE' },
                'MNG': { fillKey: 'SEASHORE' },
                'NPL': { fillKey: 'SEASHORE' },
                'NGR': { fillKey: 'SEASHORE' },
                'PRG': { fillKey: 'SEASHORE' },
                'RRW': { fillKey: 'SEASHORE' },
                'SMR': { fillKey: 'SEASHORE' },
                'SRB': { fillKey: 'SEASHORE' },
                'SVK': { fillKey: 'SEASHORE' },
                'SSD': { fillKey: 'SEASHORE' },
                'SUI': { fillKey: 'SEASHORE' },
                'TJK': { fillKey: 'SEASHORE' },
                'TCD': { fillKey: 'SEASHORE' },
                'TKM': { fillKey: 'SEASHORE' },
                'UGA': { fillKey: 'SEASHORE' },
                'UZB': { fillKey: 'SEASHORE' },
                'ZMB': { fillKey: 'SEASHORE' },
                'ZWE': { fillKey: 'SEASHORE' },
                'XWB': { fillKey: 'SEASHORE' },
                'PRY': { fillKey: 'SEASHORE' }
            };
            res(response);
        }
        )
    };


    /*GET*/
    GetLandlockedCountriesListOnlyNames() {
        return new Promise((res, rej) => {

            var landlockArray = [];
            var resultLandLock = [];
            landlocked.find(function (err, doc) {
                if (err) {
                    console.log("an error ocurred on reading the latlon collection" + err);
                };
                if (doc) {
                    landlockArray = doc;
                    landlockArray.forEach(elem => {
                        if (elem !== null){
                            resultLandLock.push(elem);
                        }
                    })
                    res(resultLandLock);
                }
            });
        }
        )
    };
}

module.exports = () => {
    var record = new Record();
    return record;
}