const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("./privatekey.json"); //put the generated private key path here

function sendNotification(topic){

    var message = {
          notification: {
            title: "topic test",
            body: "hahahahahaha"
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
      console.log("Successfully subscribed to topic:", response);
          console.log("topic name: ", topic);
          console.log("token: ", token);
    })
    .catch(function(error) {
      console.log("Error subscribing to topic:", error);
    });
}

function unsubscribe(token, topic){
    admin.messaging().unsubscribeFromTopic(token, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log("Successfully unsubscribed from topic:", response);
      console.log("topic name: ", topic);
      console.log("token: ", token);
    })
    .catch(function(error) {
      console.log("Error unsubscribing from topic:", error);
    });
}

module.exports = {
    sendNotification,
    subscribe,
    unsubscribe
};
