const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
var admin = require("firebase-admin");
var serviceAccount = require('./privatekey.json') //put the generated private key path here


    admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://inline-f628d.firebaseio.com"
        });

    var token = "cVKSvNvX3TA:APA91bFa6da5VefoA5ees5UDf5XD6s27kvmy7jUlCjADMSAe1fGookUkaEkw6nYCKyphFcH5wGTrevmsDa8Kni34MoQMMJaY8SMo4Pu74worLkJQDTUWyPr9ee40FeoQmfwqenc66E2Y";


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


//module.exports = {
//    sendNotification
//};
//
//
