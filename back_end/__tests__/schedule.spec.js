var send2 = require("../src/fcm/send2");
const schedule = require("../src/schedule/scheduling.service");

send2.sendNotification = jest.fn();
jest.useFakeTimers();

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