const express = require('express');
const router = express.Router();
const Db = require('Mongodb').Db;
const Server = require('Mongodb').Server
const MongoClient = require('Mongodb').MongoClient;
router.post('/enque',enque);
router.put('/deque',deque);
router.get('/top', top);
router.post('/new', new_queue);
router.delete('/', queue_delete);

module.exports = router;
exports.newQueue = newQueue;
exports.delete = _delete;
exports.numOfElement = numOfElement;

var db;
var db2;
var lwtime = null;

MongoClient.connect('mongodb://localhost:27017/queue',function(err,_db){
    if(err) throw err;
    db = _db.db("queue");
    db2 = _db;
});

function numOfElement(coursename){
    db.collection(coursename).countDocuments({start:true},function(err, count){
      //count is the number, do what ever u want
    });
}


async function enque(req,res,next){
  var queue = await db.collection(req.body.coursename).insertOne({
    username:req.body.username,
    entime: Date.now(),
    start: true,
    estime: lwtime.getTime()});
  if(queue) {
    res.status(200).json({messge:"you are in queue"});
  }
  else{
    res.status(400).json({messge:"not successful"})
  }
}

async function top(req,res,next){
    var queue = await db.collection(req.body.coursename).findOneAndUpdate({start:true},
      {$set:{start : true}},
      {sort:{enTime: 1}});
    res.json(queue);

}

async function deque(req,res,next){
  await db.collection(req.body.coursename).findOne({start:true},{sort:{enTime:1}},function(err, user){
    if (err) throw err;
    if(lwtime == null) {
      lwtime = new Date(Date.now() - user.entime);
    }
    else{
      lwtime = lwtime.setTime((lwtime.getTime() +(Date.now() - user.entime))/2);
    }
  });
  await db.collection(req.body.coursename).findOneAndDelete(
    {start:true},
    {sort:{enTime: 1}})
    .then( queue => queue ? res.status(200).json({messge:"dequed"}):res.status(400));
}

async function newQueue(coursename){
  var queue = await db.collection(coursename);

  if(queue){
    return queue;
  }
  else{
    return 0;
  }
}

function queue_delete(req,res,next){
  _delete(req.body.coursename);
}

function new_queue(req,res,next){
  newQueue(req.body.coursename).then(queue => queue ? res.json({"message":"success"}) : res.sendStatus(400));
}

async function _delete(coursename){
  await db.collection(coursename).drop();
}
