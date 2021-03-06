const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongoosedb = require("../_helpers/db");
const mongoose = require("mongoose");
const User = mongoosedb.user;
const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyAt1l6XIypmIj9ABKX5SI09x76Y9FCYU4k",
    Promise: Promise
});

var locations;
var client;

MongoClient.connect("mongodb://localhost:27017/locations",function(err,_db){
    if(err) {throw err;}
    const db = _db.db("Locations");
    locations = db.collection("locations");
    client = _db;
});

async function chooseLocation(req, res, next){

    await googleMapsClient.geocode({
        address: req.body.address
    }).asPromise()
    .then((response)=>{     
        res.status(200).json(response.json.results);
    })
    .catch((err)=>{
        res.status(400).json({failure: err});
    });

}

async function defaultNewLocation(req, res, next){
    if(req.body.coursename == null){
        res.status(400).json({failure: "course is null"});
        return 0;
    }
    await googleMapsClient.geocode({
        address: req.body.address
    }).asPromise()
    .then(async (response)=>{
        var lat = response.json.results[0].geometry.location.lat;
        var lng = response.json.results[0].geometry.location.lng;
        await locations.findOneAndUpdate({coursename:req.body.coursename},{ $set:{
            coursename: req.body.coursename,
            lat: lat,
            lng: lng
        }},{upsert:true}).then((result) =>{
            res.status(200).json({
                coursename: result.value.coursename,
                lat: result.value.lat,
                lng: result.value.lng
            });
        }).catch((err)=>{
            res.status(400).json({
                failure: err
            });
        });
    }).catch((err)=>{
        res.status(400).json({failure: err});
    });
    
}

async function getLocation(req, res, next){
    if(req.params.coursename == null){
        res.status(400).json({failure : "coursename is null"});
        return null;
    }
    await locations.findOne({coursename : req.params.coursename}).then((result)=>{
        res.status(200).json({lat: result.lat, lng: result.lng});
    }).catch((err)=>{res.status(400).json({failure : "not successful"});});
}

async function getAllLocation(req,res,next){
    if(req.params.username == null){
        res.status(400).json({failure: "username null"});
        return null;
    }

    await User.findOne({username: req.params.username}).then(async (user)=>{
        if(user == null){
            res.status(400).json({failure: "invalid username"});
            return null;
        }
        let i = 0;
        var pacakage = new Array();
        while(user.courses[i] != null){
            console.log(user.courses[i]);
            await locations.findOne({coursename:user.courses[i]}).then((points)=>{
                console.log(points);
                pacakage.push(points);
                console.log(pacakage);
            });
            i = i + 1;
        }

        if(pacakage == []){
            res.status(400).json({array: pacakage});
            return null;
        }
        res.status(200).json({array: pacakage});
    });
}

async function updateLocation(req, res, next){
    if(req.body.coursename == null){
        res.status(400).json({failure: "course is null"});
        return 0;
    }

    await googleMapsClient.geocode({
        address: req.body.address
    }).asPromise().then(async (response)=>{
        await locations.findOneAndUpdate({
            coursename: req.body.coursename
        },{
            $set: {lat: response.json.results[0].geometry.location.lat, lng: response.json.results[0].geometry.location.lng}
        }).then((result) =>{
            if(result.value != null){
                res.status(200).json({
                    coursename: result.value.coursename,
                    lat: result.value.lat,
                    lng: result.value.lng
                });
            }
            else{
                res.status(404).json({
                    failure: "course not found"
                })
            }
        }).catch((err)=>{
            res.status(400).json({
                failure: err
            });
        });
    }).catch((err)=>{
        res.status(400).json({failure: err});
    })
}

async function deleteLocation(req, res, next){
    if(req.body.coursename == null){
        res.status(400).json({failure: "coursename is null"});
    }
    await locations.findOneAndDelete({
        coursename: req.body.coursename
    }).then((result) =>{
        if(result.value != null){
            res.status(200).json({
                success: "deleted"
            });
        }
        else{
            res.status(404).json({
                failure: "course not found"
            })
        };
    }).catch((err)=>{
        res.status(400).json({
            failure: err
        });
    });
}

/*
getLocation: get the lat and lng of the course
req params - coursename
endpoint: /location/latlng/:coursename

chooseLocation: get all the similar results of the given address
get request: json parameters - address
endpoint: /location/

defaultNewLocation: create a document of coordinates with the most similar result of the given address
post request: json parameters - address, coursename
endpoint: /location/default

updateLocation: update the coordinates of the given coursename with the most similar result
put request: json parameters - address, coursename
endpoint: /location/

deleteLocation: delete the doucment
delete request: json parameters - coursename
endpoint: /location/
*/
router.get("/latlng/:coursename", getLocation);
router.get("/", chooseLocation);
router.post("/default", defaultNewLocation);
router.put("/", updateLocation);
router.delete("/", deleteLocation);
router.get("/all/:username", getAllLocation);
module.exports = {
    router,
    getLocation,
    chooseLocation,
    defaultNewLocation,
    //insertLocation,
    updateLocation,
    deleteLocation,
    getAllLocation,
    client,
    locations
};