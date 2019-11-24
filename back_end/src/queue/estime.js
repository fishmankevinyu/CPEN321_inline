const queue_service = require("./queue.service.js");
const MongoClient = require("mongodb").MongoClient;
var db;
var client;
var ests;
/*
this is a private interface, no front end request here
*/

MongoClient.connect("mongodb://localhost:27017/EST",function(err,_db){
    if(err) {throw err;}
    db = _db.db("ESTs");
    ests = db.collection("ests");
    client = _db;
});

async function newCourseTime(coursename,aa){
  await ests.insertOne({
    coursename,
    AHT: 300000,
    count: 0,
    AA: aa
  }).then((x) => x).catch((err) => console.log(err));
}

async function updateAHT(coursename,aht){
  var oldAht;
  var count;

  var est = await ests.findOne({coursename});

  oldAht = est.AHT;
  count = est.count;
  console.log(typeof oldAht);
  console.log(typeof count);
  var newAht;

  if(oldAht == 0){
    newAht = aht;
    count = 0;
  }
  else{
    newAht = (oldAht*count + aht)/(count+1);
    console.log(count);

  }
  await ests.findOneAndUpdate({coursename},{$set: {AHT:newAht}, $inc: {count: 1}}).then((result)=>{
    return result;
  }).catch((err)=>{
    throw err;
  });
}

async function calEST(coursename,username){
  var count = await queue_service.checkIndex(coursename,username)
  .then(function(newcount){
    return newcount;
  });
  var piQ = parseInt(count,10);
  var est = await ests.findOne({coursename})
  .then(function(newest){
    return newest;
  },function(err){console.log("err: " + err); });
  console.log(piQ);
  console.log(est.AHT);
  console.log(est.AA);
  var ESTime = piQ*est.AHT/est.AA;
  return ESTime;
}

module.exports = {
  newCourseTime,
  updateAHT,
  calEST,
  client,
  db,
  ests
};
