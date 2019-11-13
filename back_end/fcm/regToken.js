const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");

var db;
var db2;
var tokens;



MongoClient.connect("mongodb://localhost:27017/Token",function(err,_db){
   if(err) {
       throw err;
    }
    db = _db.db("RegTokens");
    tokens = db.collection("regTokens");
    db2 = _db;
});

async function addToken(username,token){
    await tokens.findOneAndUpdate({username}, {$set:{token}},{upsert: true})
    .then(function(regToken){
      console.log("success: ");
    }, function(err){
      console.log("failed: ");
    });
}

async function deleteToken(username,token){
  await tokens.findOneAndDelete({username});
}

async function getToken(username){
  var regToken = await tokens.findOne({username});
  return regToken.token; 
}

module.exports = {
  addToken,
  deleteToken,
  getToken
};
