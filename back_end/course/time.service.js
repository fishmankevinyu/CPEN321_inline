const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const schedule = require('../schedule/scheduling.service');

// routes
router.post('/add', add_time);
router.get('/get', get_time);
router.delete('/', delete_time);

module.exports = router;

var times;
var db;
var lwtime = null;

MongoClient.connect('mongodb://localhost:27017/time',function(err,_db){
    if(err) throw err;
    db = _db.db("time");
    times = db.collection("times");

});

async function add_time(req, res, next){
    await add_time_service(req.body)
    .then(()=>res.json({message: "successully added"}))
    .catch(err => next(err));
    
}

async function get_time(req, res, next){
    var timeArray = await get_time_service(req.body.coursename);
    if(timeArray){
        res.json(timeArray);
    }
    else{
        res.status(400).json({message: "cannot get time"});
    }
}

async function delete_time(req, res, next){
    await delete_time_service(req.body)
   .then(()=>{res.json({message:"deleted"})})
    .catch(err=>next(err));
}

async function add_time_service(time){
    if(await times.insertOne(time)){
        await schedule.addSchedule(time, time.coursename);
    }
    else{
        throw "added failure";
    }
}

async function get_time_service(coursename){
    var timeArray = await times.find({coursename: coursename}).toArray();
    return timeArray;
}

async function delete_time_service(time){
    await times.findOneAndDelete(time);
}
