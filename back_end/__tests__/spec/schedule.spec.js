jest.mock("../../src/fcm/send2");
jest.useFakeTimers();
var send2 = require("../../src/fcm/send2");
const schedule = require("../../src/schedule/scheduling.service");

describe("schedule", ()=>{

    test("schedule one minute",()=>{
        var newTime = {
                        minute: "*",
                        hour: "*",
                        dayOfMon: "*",
                        month: "*",
                        dayOfWeek: "*"
                    };

        schedule.addSchedule(newTime,null);

        jest.advanceTimersByTime(70000);

        expect(send2.sendNotification).toHaveBeenCalledTimes(1);   
            
    });
});
