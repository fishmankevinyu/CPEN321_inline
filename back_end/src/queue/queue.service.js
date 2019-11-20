const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const Est = require("./estime");
const mongoosedb = require("../_helpers/db");
const mongoose = require("mongoose");
const User = mongoosedb.user;
const Course = mongoosedb.course;


var db;
var client;

MongoClient.connect("mongodb://localhost:27017/queue",function(err,_db){
    if(err) {throw err;}
    db = _db.db("queue");
    client = _db;
});

/*private */
async function enqueCheck(username,coursename){
  var user = await User.findOne({username, courses: coursename});
  var course = await Course.findOne({coursename, students: username});
  if(user == null || course == null){
    return false;
  }
  return true;
}

/*
 get request
 get the position of a student in queue
 url: /queue/index
 need json ({"coursename":"","username":""})
 */

/*
post request
put a student in a queue
url: /queue/enque
need json ({"coursename":"","username":""})
*/
async function enque(req,res,next){
  var user = await db.collection(req.body.coursename).findOne({
    username:req.body.username
  }).then((x) => x);
  if(user == null && await enqueCheck(req.body.username,req.body.coursename).then((x) => x)){
    await db.collection(req.body.coursename).insertOne({
      username:req.body.username,
      entime: Date.now(),
      start: true,
      estime: 0})
    .then( function(queue){return queue;});

    var ESTime = await Est.calEST(req.body.coursename, req.body.username).then(function(ESTime){return ESTime; });

    console.log("enque/ESTime: " + ESTime);

    var user2 = await db.collection(req.body.coursename).findOneAndUpdate({username: req.body.username},{$set: {estime: ESTime}})
    .then(function(newUser){
      console.log("been in 3rd fulfilled");
      res.status(200).json({success:"you are in queue", EST: ESTime});
      return newUser;
    }, () => res.status(400).json({messge:"not successful"}));
  }
  else{
  res.status(400).json({failure:"you are in queue already/you are not a student of this course"});
  }
}
/*look at the next one that is about to be dequed*/
async function top(req,res,next){
    var queue = await db.collection(req.body.coursename).findOneAndUpdate({start:true},
    {$set:{start : true}},
    {sort:{entime: 1}});
    res.json(queue);

}

/*
put request
deque a user in the queue by FIFO
url: /queue/deque
need json {"coursename":""}
*/
async function deque(req,res,next){
  await db.collection(req.body.coursename).findOne({start:true},{sort:{entime:1}},function(err, user){
    if (err) {throw err;}
    Est.updateAHT(req.body.coursename, Date.now() - user.entime);
  });
  await db.collection(req.body.coursename).findOneAndDelete(
    {start:true},
    {sort:{entime: 1}})
    .then( (queue) => queue ? res.status(200).json({messge:"dequed"}):res.status(400));
}

/*
put request
deque a user in the queue by FIFO
url: /queue/selfdeque
need json {"coursename":"", "username":""}
*/

async function selfDeque(req,res,next){
  await db.collection(req.body.coursename).findOneAndDelete(
    {username:req.body.username},
    {sort:{entime: 1}})
    .then( (queue) => queue ? res.status(200).json({messge:"dequed"}):res.status(400));
}

async function updateEST(req, res, next){
  var ESTime = await Est.calEST(req.body.coursename, req.body.username).then(function(ESTime){
    res.status(200).json({Estime: ESTime}); 
  }).catch((err)=>{
    res.status(400).json({failure: "Did you send the correct course name?"});
  });

}

/*private for backend*/
async function newQueue(coursename,aa){
  console.log(coursename);
  var queue = await db.collection(coursename);
  var estime = await Est.newCourseTime(coursename,aa);
  if(queue && estime ){
    return queue;
  }
  else{
    return 0;
  }
}

/*private*/
async function _delete(coursename){
  await db.collection(coursename).drop();
}

/*
delete request
delete a course queue
url /queue/delete
json({"coursename":""})
this could be merge into course.service deleted, but not yet
*/
function queueDelete(req,res,next){
  _delete(req.body.coursename);
}

/*
post request
create a queue of a courses
url /queue/newe
json({"coursename":"","AA":""})
already merge into course service, but still can use sepearately
*/

async function newQueue2(req,res,next){
  await newQueue(req.body.coursename,req.body.AA)
  .then((queue) => (queue) ? res.json({"message":"success"}) : res.sendStatus(400)).catch((err) => next(err));
}



/*private*/
function checkIndex(coursename,username){
  var count = db.collection(coursename).findOne({username})
  .then(function(user){
    var count = db.collection(coursename).countDocuments({entime: {$lte : user.entime}}).then((newCount) => newCount);
    return count;
  });

  return count;
}


router.post("/enque",enque);
router.put("/deque",deque);
router.put("/selfdeque", selfDeque);
router.get("/top", top);
router.get("/estime", updateEST);
router.post("/new", newQueue2);
router.delete("/", queueDelete);

module.exports = 
{ 
  router,
  newQueue,
  delete: _delete,
  enque,
  deque,
  newQueue2,
  queueDelete,
  db,
  client
};
exports.checkIndex = checkIndex;
