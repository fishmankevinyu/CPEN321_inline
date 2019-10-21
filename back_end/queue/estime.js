const express = require('express');
const queue = require('./queue.service');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
var db;
var db2;
var ests;

module.exports = {
  new_course_time,
  updateAHT,
  calEST
}

MongoClient.connect('mongodb://localhost:27017/EST',function(err,_db){
    if(err) throw err;
    db = _db.db("ESTs");
    ests = db.collection("ests");
    db2 = _db;
});

async function new_course_time(coursename,aa){
  await ests.insertOne({
    coursename: coursename,
    AHT: null,
    count: 0,
    AA: aa
  },function(err,est){
    if(err) throw err;
    console.log("success");
  })
}

function updateAHT(coursename,aht){
  var old_aht
  var count
  ests.findOne({coursename:coursename},function(err, est){
    if(err) throw err
    old_aht = est.AHT
    count = est.count
    console.log(typeof old_aht)
    console.log(typeof count)
    console.log("success");
  });
  var new_aht

  if(old_aht == null){
    new_aht = aht;
    count = aht - aht;
    console.log("if");
  }
  else{
    new_aht = (old_aht + aht*count)/(count+1);
    console.log(count)
    console.log("else");

  }
  ests.findOneAndUpdate({coursename:coursename},{$set: {AHT:new_aht}, $inc: {count: 1}},function(err, est){
    if(err) throw err;
    console.log("success");
  });
}

async function calEST(coursename,username){
  var aht
  var aa
  var piQ = await queue.check_index(coursename,username);
  var est = await ests.findOne({coursename:coursename});
  aht = await parseInt(est.AHT,10)
  aa = await parseInt(est.AA,10)
  console.log('piq'+piQ);
  var est = await aht*piQ/aa;
  console.log(est);

  return est;

}
