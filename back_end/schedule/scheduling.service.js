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

const cron = require('node-cron');
const send = require('../fcm/send2');
const db = require('../_helpers/db');
const User = db.User;

exports.addSchedule = addSchedule

function addSchedule(newTime,coursename){
  var minute = newTime.minute
  var hour = newTime.hour
  var dayOfMon = newTime.dayOfMon
  var month = newTime.month
  var dayOfWeek = newTime.dayOfWeek

  if(newTime == null){console.log("newTime null"); return 1;}
  if(newTime.minute == null){
      minute = '*'
  }
  if(newTime.hour == null){
    hour = '*'
  }
  if(newTime.dayOfMon == null){
    dayOfMon = '*'
  }
  if(newTime.month == null){
    month = '*'
  }
  if(newTime.dayOfWeek == null){
    dayOfWeek = '*'
  }
  cron.schedule(minute + ' ' + hour + ' ' + dayOfMon + ' ' + month + ' ' + dayOfWeek, ()=>{
    console.log("time to send notification!")
    User.find()
    send.sendNotification(coursename);
  })
  return 0
}
