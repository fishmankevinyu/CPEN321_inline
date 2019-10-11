const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const User = db.User;
const Course = db.Course;
const mongoose = require("mongoose");
// routes
router.post('/new', new_course);
router.post('/add/:id', add_course);
router.get('/:id', get_course);
router.put('/:id', update_course)
router.delete('/:id', delete_course);
var acourse = {course: "CPEN291"};
module.exports = router;

async function add_course(req, res, next){
  var user = await User.findById(mongoose.Types.ObjectId(req.params.id))
  user.updateOne({$push: {"courses": {course:req.body.course}}})
  .then(res.json({"username":user.username}))
  .catch(err =>{
    console.log(err);
  });
  console.log(user.username);

}

async function new_course(req, res ,next){

  if(await Course.findOne({coursename: req.body.coursename})){
    res.status(400).json({message:"course exists"});
  }
  else{
    var course = new Course(req.body);
    res.json(course);
    await course.save();
    console.log(course.coursename)
  }
}

async function get_course(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id))
  if(course){
    res.json(course);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}
async function update_course(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id))
  if(course){
    course.updateOne({$set: req.body});
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}
async function delete_course(req,res,next){
  var course = await Course.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
  .then(()=>{res.json({message:"deleted"})}).catch(err=>next(err));
}
