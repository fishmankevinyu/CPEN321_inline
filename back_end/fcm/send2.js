const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require('./privatekey.json') //put the generated private key path here

function sendNotification(topic){
//    admin.initializeApp({
//          credential: admin.credential.cert(serviceAccount),
//          databaseURL: "https://inline-f628d.firebaseio.com"
//        });

//    var token = "dsB4G4H5a4w:APA91bGNQLVKoHtxPxrIfrELqUm4yIOv9VFsNkfGPYqq8z3Gb6dOhEFhAy3F_aHmIchgtDr6A98YRbX29cy2djjOWpE3gegOzq7GpomjessWrkiPWAmcG9Cye6cc1MEEqnBE7CtbYw_B";


    var message = {
          notification: {
            title: 'topic test',
            body: 'hahahahahaha'
          },
      topic: topic
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

function subscribe(token, topic){
    admin.messaging().subscribeToTopic(token, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
    });
}

function unsubscribe(token, topic){
    admin.messaging().unsubscribeFromTopic(token, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully unsubscribed from topic:', response);
    })
    .catch(function(error) {
      console.log('Error unsubscribing from topic:', error);
    });
}

module.exports = {
    sendNotification,
    subscribe,
    unsubscribe
};
