const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongoosedb = require("../_helpers/db");
const mongoose = require("mongoose");
const User = mongoosedb.user;
const Course = mongoosedb.course;
const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyAt1l6XIypmIj9ABKX5SI09x76Y9FCYU4k"
});

var locations;
var client;

MongoClient.connect("mongodb://localhost:27017/locations",function(err,_db){
    if(err) {throw err;}
    const db = _db.db("locations");
    locations = db.collection("locations");
    client = _db;
});

async function chooseLocation(req, res, next){

    await googleMapsClient.geocode({
        address: req.body.address
    }, function(err, response) {
        if (!err) {
            console.log(response.json.results);      
            res.status(200).json(response.json.results);
        }
        else{
            res.status(400).json({failure: err});
        }
    });

}

async function insertLocation(coursename, lat, lng){
    await locations.insertOne({
        coursename: coursename,
        lat: lat,
        lng: lng
    }).then((result) =>{
        res.status(200).json({
            coursename: result.coursename,
            lat: result.lat,
            lng: result.lng
        });
    }).catch((err)=>{
        res.status(400).json({
            failure: err
        });
    });
}

async function defaultNewLocation(req, res, next){
    await googleMapsClient.geocode({
        address: req.body.address
    }, function(err, response) {
        if (!err) {
            var lat = response.json.result[0].geometry.location.lat;
            var lng = response.json.result[0].geometry.location.lng;
            locations.insertOne({
                coursename: coursename,
                lat: lat,
                lng: lng
            }).then((result) =>{
                res.status(200).json({
                    coursename: result.coursename,
                    lat: result.lat,
                    lng: result.lng
                });
            }).catch((err)=>{
                res.status(400).json({
                    failure: err
                });
            });
        }
        else{
            res.status(400).json({failure: err});
        }
    });
    
}

async function getLocation(req, res, next){
    await locations.findOne({coursename : req.body.coursename}).then((result)=>{
        res.status(200).json({lat: result.lat, lng: result.lng});
    })
}

async function updateLocation(req, res, next){
    await locations.findOneAndUpdate({
        coursename: req.body.coursename
    },{
        $set: {lat: req.body.lat, lng: req.body.lng}
    }).then((result) =>{
        res.status(200).json({
            coursename: result.coursename,
            lat: result.lat,
            long: result.long
        });
    }).catch((err)=>{
        res.status(400).json({
            failure: err
        });
    });
}

async function deleteLocation(req, res, next){
    await locations.findOneAndDelete({
        coursename: req.body.coursename
    }).then((result) =>{
        res.status(200).json({
            success: "deleted"
        });
    }).catch((err)=>{
        res.status(400).json({
            failure: err
        });
    });
}

router.get("/latlng", getLocation);
router.get("/", chooseLocation);
router.post("/default", defaultNewLocation);
router.post("/", insertLocation);
router.put("/", updateLocation);
router.delete("/", deleteLocation);

module.exports = {router};