const express = require('express');
const router = express.Router();
const Db = require('Mongodb').Db;
const Server = require('Mongodb').Server
const MongoClient = require('Mongodb').MongoClient;
const Est = require("./estime");
router.post('/enque',enque);
router.put('/deque',deque);
router.get('/top', top);
router.post('/new', new_queue);
router.delete('/', queue_delete);

module.exports = router;
exports.newQueue = newQueue;
exports.delete = _delete;
exports.check_index = check_index;

var db;
var db2;

MongoClient.connect('mongodb://localhost:27017/queue',function(err,_db){
    if(err) throw err;
    db = _db.db("queue");
    db2 = _db;
});


async function enque(req,res,next){
  await db.collection(req.body.coursename).insertOne({
    username:req.body.username,
    entime: Date.now(),
    start: true,
    estime: 0})
    .then( queue => queue ? res.status(200).json({messge:"you are in queue"}):res.status(400).json({messge:"not successful"}))
    .catch(err => next(err))

  await db.collection(req.body.coursename).findOneAndUpdate({username: req.body.username},
    {$set: {estime: await Est.calEST(req.body.coursename, req.body.username)}})
}

async function top(req,res,next){
    var queue = await db.collection(req.body.coursename).findOneAndUpdate({start:true},
      {$set:{start : true}},
      {sort:{entime: 1}});
    res.json(queue);

}

async function deque(req,res,next){
  await db.collection(req.body.coursename).findOne({start:true},{sort:{entime:1}},function(err, user){
    if (err) throw err;
    Est.updateAHT(req.body.coursename, Date.now() - user.entime)
  });
  await db.collection(req.body.coursename).findOneAndDelete(
    {start:true},
    {sort:{entime: 1}})
    .then( queue => queue ? res.status(200).json({messge:"dequed"}):res.status(400));
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

async function new_queue(req,res,next){
  await newQueue(req.body.coursename)
  .then(queue => queue ? res.json({"message":"success"}) : res.sendStatus(400)).catch(err => next(err));
  Est.new_course_time(req.body.coursename,req.body.AA);
}

async function _delete(coursename){
  await db.collection(coursename).drop();
}

async function check_index(coursename,username){
  var user = await db.collection(coursename).findOne({username:username});
  console.log(user.entime)
  var count = await db.collection(coursename).countDocuments({entime: {$gte : user.entime}});
  console.log('count: '+ count);
  return count
}
