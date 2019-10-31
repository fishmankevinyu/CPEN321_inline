const express = require("express");
const Queue = require("./queue.service");
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");
var db;
var db2;
var ests;
/*
this is a private interface, no front end request here
*/

MongoClient.connect("mongodb://localhost:27017/EST",function(err,_db){
    if(err) throw err;
    db = _db.db("ESTs");
    ests = db.collection("ests");
    db2 = _db;
});

async function new_course_time(coursename,aa){
  await ests.insertOne({
    coursename: coursename,
    AHT: 0,
    count: 0,
    AA: aa
  }).then((x)=>x).catch(err=>console.log(err));
  console.log(aa);
}

function updateAHT(coursename,aht){
  var old_aht;
  var count;
  var est = ests.findOne({coursename:coursename});
  old_aht = est.AHT;
  count = est.count;
  console.log(typeof old_aht);
  console.log(typeof count);
  var new_aht;

  if(old_aht == null){
    new_aht = aht;
    count = aht - aht;
  }
  else{
    new_aht = (old_aht + aht*count)/(count+1);
    console.log(count);

  }
  ests.findOneAndUpdate({coursename:coursename},{$set: {AHT:new_aht}, $inc: {count: 1}},function(err, est){
    if(err) throw err;
  });
}

async function calEST(coursename,username){
  var count = await Queue.checkIndex(coursename,username)
  .then(function(newcount){
    console.log("newcount: " + newcount)
    return newcount
  });
  console.log("count3: " + count);
  var piQ = parseInt(count,10);
  var est = await ests.findOne({coursename:coursename})
  .then(function(newest){
    console.log(newest.AHT);
    console.log(newest.AA);
    return newest
  },function(err){console.log("err: " + err)});
  console.log("est:" +est);
  var ESTime = piQ*est.AHT/est.AA;
  console.log(ESTime + " " + piQ + " " + est.AHT + " " + est.AA);
  return ESTime;
}

module.exports = {
  new_course_time,
  updateAHT,
  calEST
};
