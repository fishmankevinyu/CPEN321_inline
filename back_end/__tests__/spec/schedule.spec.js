jest.mock("../../src/fcm/send2");
jest.useFakeTimers();
jest.mock("node-cron");
const send2 = require("../../src/fcm/send2");
const schedule = require("../../src/schedule/scheduling.service");
const cron = require("node-cron");

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

describe("addschedule", ()=>{

    test("schedule a new",()=>{

        send2.sendNotification = jest.fn();
        var newTime = {
                        minute: null,
                        hour: null,
                        dayOfMon: null,
                        month: null,
                        dayOfWeek: null
                    };

        var task = schedule.addSchedule(newTime,"XXX");

        expect(send2.sendNotification).toHaveBeenCalledTimes(1);
        expect(task).toBe(0);        
    });
    test("schedule a existed",()=>{

        send2.sendNotification = jest.fn();
        var newTime = {
                        minute: "*",
                        hour: "*",
                        dayOfMon: "*",
                        month: "*",
                        dayOfWeek: "*"
                    };

        //schedule.addSchedule(newTime,"XXX");
                    
        expect(()=>{schedule.addSchedule(newTime,"XXX");}).toThrowError("time already exists");
    });

    test("null time  for addschedule", ()=>{

        send2.sendNotification = jest.fn();
        //schedule.addSchedule(newTime,"XXX");
                    
        expect(()=>{schedule.addSchedule(null,"XXX");}).toThrowError("newTime is null");
    });

});

describe("deleteschedule", () =>{

    test("delete one schedule",() =>{

        var newTime = {
            minute: 2,
            hour: null,
            dayOfMon: null,
            month: null,
            dayOfWeek: null
        };

        schedule.addSchedule(newTime,"XXX");

        schedule.deleteSchedule(newTime,"XXX");

        expect(schedule.map.has("XXX2****")).toBe(false);
    });

    test("delete null time",() =>{
        expect(()=>{schedule.deleteSchedule(null,"XXX");}).toThrowError("time is null");
    });

    test("deleted non-existed schedule", ()=>{
        var newTime = {
            minute: 2,
            hour: null,
            dayOfMon: null,
            month: null,
            dayOfWeek: null
        };

        expect(()=>{schedule.deleteSchedule(newTime,"XXX");}).toThrowError("time does not exist");

        
    });

    test("start", ()=>{
        var task = {start: jest.fn()};
        schedule.startSchedule(task);
        expect(task.start).toHaveBeenCalled();
    });

});