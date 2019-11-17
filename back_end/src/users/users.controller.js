const express = require("express");
const router = express.Router();
const db = require("../_helpers/db");
const User = db.User;
const userService = require("./user.service");
const regToken = require("../fcm/regToken");

function authenticate(req, res, next) {
    console.log(req.body.registrationToken);
    userService.authenticate({username: req.body.username , password: req.body.password})
        .then((user) => user ? res.json(user) : res.status(400).json({ message: "Username or password is incorrect" }))
        .catch((err) => next(err));
    regToken.addToken(req.body.username,req.body.registrationToken);

}

function getCourses(req, res, next){

    userService.getById(req.params.id)
        .then((user) => user ? res.json(user.courses) : res.sendStatus(404))
        .catch((err) => next(err));
}

async function register(req, res, next) {
    console.log(req.body);

    await userService.create(req.body)
    .then(() => {console.log("success"); res.json({
          "confirmation":req.body.username + " created successful"
        });
          
          })
        .catch((err) => next(err));
}

async function getAll(req, res, next) {
    console.log("get called!");
    await userService.getAll()
    .then((users) => res.json(users))
        .catch((err) => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then((user) => user ? res.json(user) : res.sendStatus(404))
        .catch((err) => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then((user) => user ? res.json(user) : res.sendStatus(404))
        .catch((err) => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({"update":"sent"}))
        .catch((err) => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);
router.get("/courses/:id", getCourses);


module.exports = { router,
  getAll,
  register

};
//module.exports = router;
