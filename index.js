#!/usr/bin/env node
const express       = require('express');
const app           = express();
const PORT          = process.env.PORT;
var module          = require('./Logic/logic');
var mongoose        = require('mongoose');
var recordModule    = module();


//Cors usage
app.use(function(req, res, next) {
    var allowedOrigins = ['https://swimfromsea.herokuapp.com', 'http://localhost:8020', 'http://localhost:3000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

//Get bubble array route
app.get('/', function (req, res) {
    recordModule.GetBubbleArray().then((data)=>{
        res.status(200).send(data);
        res.end();       
    }).catch (err => {
        res.status(500).json({error: err});
    });  
});

//Get landlock list route
app.get('/landlock', function (req, res) {
    recordModule.GetLandlockedCountriesList().then((data)=>{
        res.status(200).send(data);
        res.end();       
    }).catch (err => {
        res.status(500).json({error: err});
    }); 
});

app.listen(PORT);

