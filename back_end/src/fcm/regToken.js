const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");

var db;
var client;
var tokens;



MongoClient.connect("mongodb://localhost:27017/Token",{useUnifiedTopology:true},function(err,_db){
   if(err) {
       throw err;
    }
    client = _db;
    db = _db.db("RegTokens");
    tokens = db.collection("regTokens");
});

async function addToken(username,token){
    await tokens.findOneAndUpdate({username: username}, {$set:{token: token}},{upsert: true})
    .then(function(regToken){
      console.log("success");
    }).catch(function(err){
      throw "addToken error";
    });
}

async function deleteToken(username,token){
  await tokens.findOneAndDelete({username});
}

async function getToken(username){
  var regToken = await tokens.findOne({username: username}).then((result)=>{
    console.log(result);
    return result;
  });
  return regToken.token; 
}

module.exports = {
  addToken,
  deleteToken,
  getToken,
  db,
  client,
  tokens
};
