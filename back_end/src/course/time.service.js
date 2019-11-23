const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const mongoosedb = require("../_helpers/db");
const Course = mongoosedb.course;
const schedule = require("../schedule/scheduling.service");



var times;
var db;
var client;
var lwtime = null;

MongoClient.connect("mongodb://localhost:27017/time",function(err,_db){
    if(err)  {
        throw err;
    }
    db = _db.db("time");
    times = db.collection("times");
    client = _db; 
});


async function addTimeService(time, coursename){
    if(await times.insertOne(time)){
        var task = await schedule.addSchedule(time, coursename);
        await schedule.startSchedule(task);

        //await send.sendNotification(coursename);
    }
    else
        throw "added failure";
    
}

async function addTime(req, res, next){
    
    if(await Course.findOne({coursename: req.body.coursename})){
        var timeVar = req.body; 
        if(timeVar.duration == null){
            timeVar.duration = 60; 
        }
        await addTimeService(req.body, req.body.coursename)
        .then(() => res.json({message: "successully added"}))
        .catch((err) => next(err));
    }
    else{
        res.status(400).json({message: "course not found"});
    }
    
}

// async function getTimeService(coursename){
//     var timeArray = await times.find({coursename}).toArray();
//     return timeArray;
// }

async function getTimeService(coursename){
    var time = await times.findOne({coursename});
    if(time) {
        return time; }
    else return 0; 
}

async function getTime(req, res, next){
    var time = await getTimeService(req.body.coursename);
    if(time != 0){
        //console.log(time); 
        res.status(200).json(time);
    }
    else{
        res.status(400).json({message: "cannot get time"});
    }
}

async function deleteTimeService(time){

    var temp = await times.findOne({coursename: time.coursename}); 
    console.log(temp); 
    
    if(temp){
        await times.findOneAndDelete({coursename: time.coursename})
        await schedule.deleteSchedule(time, time.coursename);
    }
    else{
        console.log("err"); 
        throw "cannot find the time in database";
    }
    
    
}

async function deleteTime(req, res, next){
    await deleteTimeService(req.body)
   .then(() => {res.json({message:"deleted"});})
    .catch((err) => next(err));
}




// routes
router.post("/add", addTime);
router.post("/get", getTime);
router.delete("/", deleteTime);

module.exports = {router,
                addTime,
                addTimeService,
                db, 
                client, 
                getTimeService, 
                deleteTime, 
                deleteTimeService, 
                getTime
};
