const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

var db;
var db2;
var tokens;

module.exports = {
  addToken,
  deleteToken
}

MongoClient.connect('mongodb://localhost:27017/Token',function(err,_db){
    if(err) throw err;
    db = _db.db("RegTokens");
    tokens = db.collection("regTokens");
    db2 = _db;
});

async function addToken(username,token){
  var regToken =  await tokens.findOneAndUpdate({username:username}, {$set:{token:token}})
    .then(()={console.log("success")}, await tokens.insertOne({username: username, token: token}));
  console.log(regToken)
}

function deleteToken(username,token){
tokens.findOneAndDelete({username: username});
}
