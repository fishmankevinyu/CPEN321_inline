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

var db;
var db2;

MongoClient.connect('mongodb://localhost:27017/queue',function(err,_db){
    if(err) throw err;
    db = _db.db("queue");
    db2 = _db;
});

async function enque(req,res,next){
  var queue = await db.collection(req.body.coursename.toString()).insertOne({username:req.body.username, entime:Date.now, start: true});
  if(queue) {
    res.status(200).json({messge:"you are in queue"});
  }
  else{
    res.status(400).json({messge:"not successful"})
  }
}

async function top(req,res,next){
    var user = await db.collection(req.body.coursename).findAndModify({query: {start:true}, sort:{enTime: 1}, update: {$set:{start : true}}});
    res.json(user);

}

async function deque(req,res,next){
var queue = await db.collection(req.body.coursename).findAndModify({query: {start:true}, sort:{enTime: 1}, remove: 1});
  res.status(200).json({messge:"dequed"});
}

async function newQueue(coursename){
  var queue = await db.collection(coursename);

  if(queue){
    return queue;
  }
  else{
    return -1;
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
