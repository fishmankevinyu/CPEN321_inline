
const express = require("express");
const router = express.Router();
const db = require("../_helpers/db");
const User = db.user;
const Course = db.course;
const queues = require("../queue/queue.service");
const mongoose = require("mongoose");
const topic = require("../fcm/send2");
const regToken = require("../fcm/regToken");
const times = require("./time.service"); 
const schedule = require("../schedule/scheduling.service"); 

/*function that should be only use inside addCourse, do not use it outside*/
async function addUser(req, res, next, userParam, courseParam){
    courseParam.updateOne({$addToSet: {"students": userParam.username}})
    .then(res.json({"username": userParam.username,
                   "coursename":courseParam.coursename}))
    .catch((err) => next(err));
}


/*
addCourse adds a student into the course document as well as add the course into
the student document.
url requirement /courses/add/:userid&:courseid
where :userid, :courseid are the ids for the user doucment and coursename
*/
async function addCourse(req, res, next){
  var user = await User.findById(mongoose.Types.ObjectId(req.params.userid));
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.courseid));

    //console.log("found");

    if(!user){
        res.status(404).json({message:"no user found"});
    }
    else if(!course){
        res.status(404).json({message:"no course found"});
    }
    else{
        //console.log(user.username);
        //console.log(course.coursename);
        //console.log("enter else"); 
        var token = await regToken.getToken(user.username);
        //console.log("mock get token"); 
        //console.log(token);
        user.updateOne({$addToSet: {"courses": course.coursename}})
          .then(addUser(req, res, next, user, course))
          .then(await topic.subscribe(token, course.coursename))
          .catch((err) => next(err));

        await user.save();
        await course.save();
    }
}


/*
post request, /courses/new
function that creates a new courss, http post json template{"coursename":"","teachers":["",""],"AA":""}
AA are the avaiable agents that is needed when starts a new line up
*/
async function newCourse(req, res ,next){

  if(await Course.findOne({coursename: req.body.coursename})){
    res.status(400).json({message:"course " + req.body.coursename + " exists"});
  }
  else{
    //console.log("before call queue"); 
    var queue = await queues.newQueue(req.body.coursename,req.body.AA);
    //console.log("after calling queue"); 
    var course = new Course(req.body);
    res.status(200).json(course);
    await course.save();
    //console.log(course.coursename);
  }
}

/*
get request, need courseid in url
courses/:id
get one course
*/
async function getCourseById(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id));
  if(course)
  {res.json(course);}

  else
  {res.status(404).json({message:"no course found"});}

}

/*
get request, need courseid in url
/courses/stduents/:id
get all students usernames in a specific course
*/
async function getStudents(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id));
  if(course){
    res.json(course.students);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}

/*
url: /courses/
get all students courses
*/
async function getAll(req,res,next){
    await Course.find().select("-hash")
    .then((courses) => res.json(courses))
    .catch((err) => next(err));
}

/*
put request, need courseid in url
/courses/:id
update a specific course
*/
async function updateCourse(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id));
  if(course){
    Object.assign(course, req.body);
      await course.save();
      res.json(course);
  }
  else{
    res.status(404).json({message:"no course found"});
  }
}

async function deleteHelper(course){
  var studentArray = course.students; 

  var i; 
  console.log(course.students + " in " + course.coursename); 
  console.log(course.students[0]); 
  for(i = 0; course.students[i] != null; i++){
    user = await User.findOne({username: course.students[i]}); 
    //console.log(user.username); 
    var token = await regToken.getToken(user.username);
    console.log("before update one"); 
    user.updateOne({$pull: {"courses": course.coursename}})
    .then(await topic.unsubscribe(token, course.coursename))
    .catch((err) => next(err));
    //console.log("updated"); 
    await user.save(); 

  }

  console.log("delete the course in user database"); 

  var timeArray = await times.getTimeService(course.coursename); 

  console.log(timeArray); 
  if(timeArray[0]!=null){
    //console.log("time found"); 
    await schedule.deleteSchedule(timeArray[0], course.coursename); 
  }
  //console.log(course.coursename); 
  await Course.findByIdAndDelete(mongoose.Types.ObjectId(course._id)); 

}

/*
delete request, need courseid in url
/courses/:id
delete a specific course
*/
async function deleteCourse(req,res,next){
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.id)); 
  await deleteHelper(course)
  .then(() => {res.json({message:"deleted"}); })
  .catch((err) => next(err));
}

/*
post request, /courses/name
get one course by name
json: {"coursename": ""}
*/
async function getByName(req, res, next){
    var course = await Course.findOne({coursename: req.body.coursename});
    if(course){
        res.json(course);
    }else{
        res.status(404).json({message:"no course found"});
    }

}

async function dropUser(req, res, next, userParam, courseParam){
  courseParam.updateOne({$pull: {"students": userParam.username}})
  .then(res.json({message: "dropped",
                 "username": userParam.username,
                 "coursename":courseParam.coursename}))
  .catch((err) => next(err));
}

async function dropCourse(req, res, next){
  var user = await User.findById(mongoose.Types.ObjectId(req.params.userid));
  var course = await Course.findById(mongoose.Types.ObjectId(req.params.courseid));

  if(!user){
    res.status(404).json({message:"no user found"});
}
else if(!course){
    res.status(404).json({message:"no course found"});
}
else{
  console.log("found"); 
  console.log("user.username"); 
  console.log("course.coursename"); 
  var token = await regToken.getToken(user.username);
  console.log(token); 
  user.updateOne({$pull: {"courses": course.coursename}})
  .then(dropUser(req, res, next, user, course))
  .then(await topic.unsubscribe(token, course.coursename))
  .catch((err) => next(err));

  await user.save(); 
  await course.save(); }
  
}

// routes
router.post("/new", newCourse);
router.post("/add/:userid&:courseid", addCourse);
router.get("/:id", getCourseById);
router.get("/", getAll);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/students/:id", getStudents);
router.post("/name", getByName);
router.delete("/drop/:userid&:courseid", dropCourse); 

module.exports = {router,
                newCourse,
                deleteCourse,
                updateCourse,
                getByName,
                getAll,
                addCourse, 
                dropCourse, 
                dropUser, 
                addUser, 
                getCourseById, 
                getStudents, 
                deleteHelper
};
