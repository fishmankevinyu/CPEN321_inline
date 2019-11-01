const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//var admin = require("firebase-admin");
var serviceAccount = require('./privatekey.json');  //put the generated private key path here


    admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://inline-f628d.firebaseio.com"
        });

    var token = "dVY5qzPD38I:APA91bF7pkWUwBDD8QuERR8At0ceCJ7u9FOswl1NF9Zac5kWnnwVN8FeKmUhbPFZLOuZqA7yRcDj4sTKD6QcyaExAQnneti9Pif6upJwvJaaWuZqVLPGrwTMa4kKUIYMfc0qC7iAUDjy";


    var message = {
          notification: {
            title: 'hello',
            body: 'hahahahahaha'
          },
      token: token
    };


    admin.messaging().send(message)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
              //console.log(response.results[0].error);
        })
        .catch(function(error){
               console.log("Something has gone wrong: ", error);
               });

