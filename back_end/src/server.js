require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error-handler");
const queue = require("./queue/queue.service");
const user = require("./users/users.controller");
const course = require("./course/course.service");

var admin = require("firebase-admin");
var serviceAccount = require("./fcm/privatekey.json");  //put the generated private key path here

// start push
admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://inline-f628d.firebaseio.com"
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use("/users", user.router);
app.use("/courses", course.router);
app.use("/queue", queue.router);
app.use("/time", require("./course/time.service"));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === "production" ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log("Server listening on port " + port);
});
