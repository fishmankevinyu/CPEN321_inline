/*
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * * command to execute
# * * * * * node ~/CPEN321_inline/back_end/fcm/send.js
*/

const cron = require("node-cron");
const send = require("../fcm/send2");
const db = require("../_helpers/db");
const User = db.User;

var map = new Map(); 

function addSchedule(newTime,coursename){
  
  if(newTime == null){console.log("newTime null"); throw "newTime is null";}

  var minute = newTime.minute;
  var hour = newTime.hour;
  var dayOfMon = newTime.dayOfMon;
  var month = newTime.month;
  var dayOfWeek = newTime.dayOfWeek;

  if(newTime.minute == null){
      minute = "*";
  }
  if(newTime.hour == null){
    hour = "*";
  }
  if(newTime.dayOfMon == null){
    dayOfMon = "*";
  }
  if(newTime.month == null){
    month = "*";
  }
  if(newTime.dayOfWeek == null){
    dayOfWeek = "*";
  }

  console.log("task is " + minute + " " + hour + " " + dayOfMon + " " + month + " " + dayOfWeek); 

  var task = cron.schedule(minute + " " + hour + " " + dayOfMon + " " + month + " " + dayOfWeek, () => {
    console.log("time to send notification!");
    //User.find()
    send.sendNotification(coursename);

    
  }, {
    timezone: "America/Los_Angeles"
  }); 
  var key = coursename + minute + hour + dayOfMon + month + dayOfWeek; 
  console.log("add schedule: key is " + key); 

  if(map.has(key)){
    throw "time already exists"; 
  }
  else{
    console.log("set map"); 
    map.set(key, task); 
    return task; 
  }
}

function startSchedule(task){
  task.start();
}

function stopSchedule(task){
  task.stop();
}



function deleteSchedule(time,coursename){
  
  if(time == null){console.log("time null"); throw "time is null";}
  var minute = time.minute;
  var hour = time.hour;
  var dayOfMon = time.dayOfMon;
  var month = time.month;
  var dayOfWeek = time.dayOfWeek;
  console.log("want to delete schedule ");

  if(time.minute == null){
    minute = '*';
  }
  if(time.hour == null){
    hour = '*';
  }
  if(time.dayOfMon == null){
    dayOfMon = '*';
  }
  if(time.month == null){
    month = '*';
  }
  if(time.dayOfWeek == null){
    dayOfWeek = '*';
  }

 var key = coursename + minute + hour + dayOfMon + month + dayOfWeek; 
 console.log("delete schedule: key is " + key); 
 if(map.has(key)){
   var task = map.get(key); 
   stopSchedule(task); 
   map.delete(key); 
   return 0; 
 }
 else{
   throw "time does not exist"; 
 }

}

exports.addSchedule = addSchedule;
exports.deleteSchedule = deleteSchedule;
exports.startSchedule = startSchedule;
exports.stopSchedule = stopSchedule;
exports.map = map;