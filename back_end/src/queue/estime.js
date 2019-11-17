const express = require("express");
const Queue = require("./queue.service");
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");
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
    AHT: 0,
    count: 0,
    AA: aa
  }).then((x) => x).catch((err) => console.log(err));
  console.log(aa);
}

function updateAHT(coursename,aht){
  var oldAht;
  var count;

    var est = ests.findOne({coursename});

  oldAht = est.AHT;
  count = est.count;
  console.log(typeof oldAht);
  console.log(typeof count);
  var newAht;

  if(oldAht == null){
    newAht = aht;
    count = aht - aht;
  }
  else{
    newAht = (oldAht + aht*count)/(count+1);
    console.log(count);

  }
  ests.findOneAndUpdate({coursename},{$set: {AHT:newAht}, $inc: {count: 1}},function(err, est){

    if(err) {throw err;}
  });
}

async function calEST(coursename,username){
  var count = await Queue.checkIndex(coursename,username)
  .then(function(newcount){
    return newcount;
  });
  var piQ = parseInt(count,10);
  var est = await ests.findOne({coursename})

  .then(function(newest){
    return newest;
  },function(err){console.log("err: " + err); });
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
