const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = db.User;
const userService = require('./user.service');
const regToken = require('../fcm/regToken')

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/courses/:id', get_courses);

module.exports = router;

function authenticate(req, res, next) {
    console.log(req.body.registrationToken)
    var user = User.findOne({userame: req.body.username})
    user.registrationToken = req.body.registrationToken;
    user.save()
    if(user.registrationToken == null){
      console.log(reg.body.registrationToken)
    }

    await user.save()
    await userService.authenticate({username: req.body.username , password: req.body.password})
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));

}

function get_courses(req, res, next){

    userService.getById(req.params.id)
        .then(user => user ? res.json(user.courses) : res.sendStatus(404))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({
          'confirmation':req.body.username + ' created successful'
        }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({"update":"sent"}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
