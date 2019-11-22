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
  var minute = newTime.minute;
  var hour = newTime.hour;
  var dayOfMon = newTime.dayOfMon;
  var month = newTime.month;
  var dayOfWeek = newTime.dayOfWeek;

  if(newTime == null){console.log("newTime null"); return 1;}
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
  var task = cron.schedule(minute + " " + hour + " " + dayOfMon + " " + month + " " + dayOfWeek, () => {
    console.log("time to send notification!");
    //User.find()
    send.sendNotification(coursename);

    
  }); 
  var key = coursename + minute + hour + dayOfMon + month + dayOfWeek; 
  console.log("add schedule: key is " + key); 

  if(map.has(key)){
    throw "time already exists"; 
  }
  else{
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
  
 var minute = time.minute;
 var hour = time.hour;
 var dayOfMon = time.dayOfMon;
 var month = time.month;
 var dayOfWeek = time.dayOfWeek;
   console.log("want to delete schedule ");

 if(time == null){console.log("time null"); return 1;}
 if(time.minute == null){
     minute = '*'
 }
 if(time.hour == null){
   hour = '*'
 }
 if(time.dayOfMon == null){
   dayOfMon = '*'
 }
 if(time.month == null){
   month = '*'
 }
 if(time.dayOfWeek == null){
   dayOfWeek = '*'
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