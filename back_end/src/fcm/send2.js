const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("./privatekey.json"); //put the generated private key path here

async function sendNotification(topicTemp){

    var message = {
          notification: {
            title: "Office hour: " + topicTemp,
            body: "Time for lining up! "
          },
      topic: topicTemp
    };


    await admin.messaging().send(message)
        .then(async function(response){
            await console.log("Successfully sent with response: ", response);
              //console.log(response.results[0].error);
        })
        .catch(async function(error){
               await console.log("Something has gone wrong: ", error);
               });
}

async function subscribe(token, topic){
    await admin.messaging().subscribeToTopic(token, topic)
    .then(async function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      await console.log("Successfully subscribed to topic:", response);
          await console.log("topic name: ", topic);
          await console.log("token: ", token);
    })
    .catch(async function(error) {
      await console.log("Error subscribing to topic:", error);
    });
}

async function unsubscribe(token, topic){
    await admin.messaging().unsubscribeFromTopic(token, topic)
    .then(async function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      await console.log("Successfully unsubscribed from topic:", response);
      await console.log("topic name: ", topic);
      await console.log("token: ", token);
    })
    .catch(async function(error) {
      await console.log("Error unsubscribing from topic:", error);
    });
}

module.exports = {
    sendNotification,
    subscribe,
    unsubscribe
};



// const express = require("express");
// const router = express.Router();
// var admin = require("firebase-admin");
// var serviceAccount = require("./privatekey.json"); //put the generated private key path here

// function sendNotification(topicTemp){

//     var message = {
//           notification: {
//             title: "Office hour: " + topicTemp,
//             body: "Time for lining up! "
//           },
//       topic: topicTemp
//     };


//     admin.messaging().send(message)
//         .then(function(response){
//             console.log("Successfully sent with response: ", response);
//               //console.log(response.results[0].error);
//         })
//         .catch(function(error){
//                console.log("Something has gone wrong: ", error);
//                });
// }

// function subscribe(token, topic){
//     admin.messaging().subscribeToTopic(token, topic)
//     .then(function(response) {
//       // See the MessagingTopicManagementResponse reference documentation
//       // for the contents of response.
//       console.log("Successfully subscribed to topic:", response);
//       console.log("topic name: ", topic);
//       console.log("token: ", token);
//     })
//     .catch(function(error) {
//       console.log("Error subscribing to topic:", error);
//     });
// }

// function unsubscribe(token, topic){
//     admin.messaging().unsubscribeFromTopic(token, topic)
//     .then(function(response) {
//       // See the MessagingTopicManagementResponse reference documentation
//       // for the contents of response.
//       console.log("Successfully unsubscribed from topic:", response);
//       console.log("topic name: ", topic);
//       console.log("token: ", token);
//     })
//     .catch(async function(error) {
//       console.log("Error unsubscribing from topic:", error);
//     });
// }

// module.exports = {
//     sendNotification,
//     subscribe,
//     unsubscribe
// };
