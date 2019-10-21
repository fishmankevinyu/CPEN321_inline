const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require('./privatekey.json') //put the generated private key path here

function sendNotification(){
//    admin.initializeApp({
//          credential: admin.credential.cert(serviceAccount),
//          databaseURL: "https://inline-f628d.firebaseio.com"
//        });

    var token = "dsB4G4H5a4w:APA91bGNQLVKoHtxPxrIfrELqUm4yIOv9VFsNkfGPYqq8z3Gb6dOhEFhAy3F_aHmIchgtDr6A98YRbX29cy2djjOWpE3gegOzq7GpomjessWrkiPWAmcG9Cye6cc1MEEqnBE7CtbYw_B";


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
}

module.exports = {
    sendNotification
};


