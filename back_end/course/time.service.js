const express = require('express');
const router = express.Router();

const schedule = require("../schedule/schedule.service");

// routes
router.post('/add', add_time);
router.post('/get', get_time);
router.delete('/', delete_time);

module.exports = router;

var time;
var db;
var lwtime = null;

MongoClient.connect('mongodb://localhost:27017/time',function(err,_db){
    if(err) throw err;
    db = _db.db("time");
});

time = db.collection("times");

async function add_time(time){
    if(await time.insertOne(time)){
        res.status(200).json({message: "added successfully"});
    };
    else{
        res.status(400).json({message: "add failure"});
    }
}

async function get_time(coursename){
    var timeArray = time.find({coursename: coursename}).toArray();
    
    var i;
    for(i=0; i < timeArray.length; i++){
        schedule.addSchedule(timeArray[i], timeArray[i].coursename);
    }
}

async function delete_time(time){
    if(await time.findOndAndDelete({time})){
        res.status(200).json({message: "added successfully"});
    };
    else{
        res.status(400).json({message: "add failure"});
    }
}
