jest.useFakeTimers();
jest.mock("node-cron");
const send2 = require("../../src/fcm/send2");
const schedule = require("../../src/schedule/scheduling.service");
const cron = require("node-cron");
var admin = require("firebase-admin");
var serviceAccount = require("../../src/fcm/privatekey.json");  //put the generated private key path here

cron.schedule = jest
    .fn()
    .mockImplementationOnce((time,callback)=>{
        callback();
        return 0;
    })
    .mockImplementationOnce((time,callback)=>{
        callback();
        return 0;
    })
    .mockImplementationOnce((time,callback)=>{
        callback();
        return {
            start: jest.fn(),
            stop: jest.fn()
        };
    });

    console.log = jest.fn(); 

describe("notification testing", ()=>{

    beforeAll(async () => {
        //admin.initializeApp = jest.fn(); 
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://inline-f628d.firebaseio.com"
      });
      }); 

    test("add a schedule - send notification - delete a schedule",async ()=>{

        var newTime1 = {
                        minute: null,
                        hour: null,
                        dayOfMon: null,
                        month: null,
                        dayOfWeek: null
                    };

        schedule.addSchedule(newTime1,"XXX");

        expect(()=>{schedule.addSchedule(newTime1,"XXX");}).toThrowError("time already exists");

    var newTime = {
        minute: 2,
        hour: null,
        dayOfMon: null,
        month: null,
        dayOfWeek: null
    };

    schedule.addSchedule(newTime,"XXX");
    expect(schedule.map.has("XXX2****")).toBe(true);

    const topicTemp = "XXX";

    const tokenTemp = "1234";

   await send2.subscribe(tokenTemp,topicTemp); 
   expect(console.log).toHaveBeenCalled();

   await send2.sendNotification(topicTemp); 
   expect(console.log).toHaveBeenCalled();

   await send2.unsubscribe(tokenTemp,topicTemp); 
   expect(console.log).toHaveBeenCalled();

    schedule.deleteSchedule(newTime,"XXX");

    expect(schedule.map.has("XXX2****")).toBe(false);



    });
});