const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = db.User
const Course = db.Course
const queue = require('../queue/queue.service')
const mongoose = require("mongoose");
const topic = require('../fcm/send2')
const regToken = require('../fcm/regToken')
// routes
router.post('/new', new_course);
router.post('/add/:userid&:courseid', add_course);
router.get('/:id', get_courseById);
router.get('/', get_all);
router.put('/:id', update_course)
router.delete('/:id', delete_course);
router.get('/students/:id', get_students);

//var acourse = {course: "CPEN291"};
module.exports = router;
//exports.getHours = getHourse;

//function getHours(coursename){
//  var course = await Course.findOne({coursename: coursename});
//  if(course == null){console.log( err: ' + course)};
//
//
//}

async function add_course(req, res, next){
  var user = await User.findById(mongoose.Types.ObjectId(req.params.userid));
    //var user = await User.findById(req.params.userid);
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.courseid));

  var queue = await queue.newQueue(req.body.couresname)

    console.log("found");

    if(!user){
        res.status(404).json({message:"no user found"});
    }
    else if(!course){
        res.status(404).json({message:"no course found"});
    }
    else{
        console.log(user.username);
        console.log(course.coursename);
        var token = regToken.getToken(user.username);
        user.updateOne({$addToSet: {"courses": course.coursename}})
          .then(add_user(req, res, next, user, course))
          .then(await topic.subscribe(token, course.coursename))
          .catch(err => next(err));

        await user.save();
        await course.save();
    }


}

async function add_user(req, res, next, userParam, courseParam){
    courseParam.updateOne({$addToSet: {"students": userParam.username}})
    .then(res.json({"username": userParam.username,
                   "coursename":courseParam.coursename}))
    .catch(err => next(err));
}

async function new_course(req, res ,next){

  if(await Course.findOne({coursename: req.body.coursename})){
    res.status(400).json({message:"course " + req.body.coursename + " exists"});
  }
  else{
    var queue = await queue.newQueue(req.body.coursename)
    var course = new Course(req.body);
    res.json(course);
    await course.save();
    console.log(course.coursename)
  }
}

async function get_courseById(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id))
  if(course){
    res.json(course);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}

async function get_students(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id))
  if(course){
    res.json(course.students);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}

async function get_all(req,res,next){
    await Course.find().select('-hash')
    .then(users => res.json(users))
    .catch(err => next(err));
}

async function update_course(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id))
  if(course){
    Object.assign(course, req.body);
      await course.save();
      res.json(course);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}


async function delete_course(req,res,next){
  var course = await Course.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
  .then(()=>{res.json({message:"deleted"})}).catch(err=>next(err));
}
