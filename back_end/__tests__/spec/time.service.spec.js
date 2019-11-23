jest.mock("../../src/schedule/scheduling.service"); 
const config = require("../../src/config.json");
const Mongoose = require("mongoose");
const Course = require("../../src/course/course.model");
const timeService = require("../../src/course/time.service"); 
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const schedule = require("../../src/schedule/scheduling.service"); 

const mockRequest = (data) =>{
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("time service testing", () =>{


         
    var connection;
    beforeAll( async ()=>{
        timeService.client = await MongoClient.connect("mongodb://localhost:27017/time",{useUnifiedTopology:true});
        timeService.db = await timeService.client.db("time");
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
        Mongoose.Promise = global.Promise;
    });

    

    test("create db instance", ()=>{
        
        expect(timeService.db).toBeInstanceOf(Mongodb);
        expect(connection).toBeDefined();
    });

    test("add Time service", async ()=>{
        schedule.addSchedule = jest.fn(()=>{return 0; }); 
        schedule.startSchedule = jest.fn(()=>{return 0; });

        var time = {coursename: "lala"}; 

        const test = {

        async find(){
           return await timeService.db.collection("times").findOne({coursename: "lala"});
        }
        };
        jest.spyOn(test, 'find');
        const result = await test.find();

       await timeService.addTimeService(time, "lala").then(()=>{
           expect(schedule.addSchedule).toHaveBeenCalledTimes(1); 
           expect(schedule.startSchedule).toHaveBeenCalledTimes(1); 
           expect(result).toBeDefined(); 
       }); 


   });     

   test("add Time - course found", async ()=>{

    const req = mockRequest({body: {
        coursename: "lala"
        }
});
    var res = mockResponse();
    const next = jest.fn();

    schedule.addSchedule = jest.fn(()=>{return 0; }); 
    schedule.startSchedule = jest.fn(()=>{return 0; });

    await timeService.addTime(req, res, next).then(()=>{
        expect(res.json).toHaveBeenCalledTimes(1); 
        expect(res.json).toHaveBeenCalledWith({message: "successully added"}); 
    }); 

}); 

    test("add Time - course not found", async ()=>{

        const req = mockRequest({body: {
            coursename: "nana"
            }
    });
        var res = mockResponse();
        const next = jest.fn();
    
        schedule.addSchedule = jest.fn(()=>{return 0; }); 
        schedule.startSchedule = jest.fn(()=>{return 0; });
    
        await timeService.addTime(req, res, next).then(()=>{
            expect(res.json).toHaveBeenCalledTimes(1); 
            expect(res.json).toHaveBeenCalledWith({message: "course not found"});
            expect(res.status).toHaveBeenCalledWith(400);  
        }); 

}); 

test("get Time service", async ()=>{
    var coursename = "lala"; 

   var time = await timeService.getTimeService(coursename); 

   await expect(time).toBeDefined(); 

});  

test("get Time - course found", async ()=>{

    const req = mockRequest({body: {
        coursename: "lala"
        }
});
    var res = mockResponse();
    const next = jest.fn();
    timeService.getTimeService = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});
    //var result = await timeService.db.collection("times").findOne({coursename: "lala"}); 

    await timeService.getTime(req, res, next).then(()=>{
        expect(res.json).toHaveBeenCalledTimes(1); 
        expect(res.status).toHaveBeenCalledWith(200); 
        //expect(timeService.getTimeService).toHaveBeenCalledTimes(1);  
    }); 

}); 

test("get Time - course not found", async ()=>{

    const req = mockRequest({body: {
        coursename: "aaaannn"
        }
});
    var res = mockResponse();
    const next = jest.fn();
    timeService.getTimeService = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});
    //var result = await timeService.db.collection("times").findOne({coursename: "lala"}); 

    await timeService.getTime(req, res, next).then(()=>{
        expect(res.json).toHaveBeenCalledTimes(1); 
        expect(res.status).toHaveBeenCalledWith(400); 
    }); 

}); 

test("delete Time service - found", async ()=>{
    var time = {coursename: "lala"}; 

    schedule.deleteSchedule = jest.fn(()=>{return 0; });

    await timeService.deleteTimeService(time).then(()=>{
        expect(schedule.deleteSchedule).toHaveBeenCalledTimes(1); 
    }); 
});  

test("delete Time service - not found", async ()=>{
    var time = {coursename: "dongdongdong"}; 

    var errMsg; 
    try{
        await timeService.deleteTimeService(time)
    }catch(e){
        errMsg = e; 
    }

    await expect(errMsg).toBe("cannot find the time in database"); 
    
});  

test("delete Time", async ()=>{

    time = {coursename: "lalala"}
    await timeService.addTimeService(time, "lalala"); 
    const req = mockRequest({body: {
        coursename: "lalala"
        }
});
    var res = mockResponse();
    const next = jest.fn();
    schedule.deleteSchedule = jest.fn(()=>{return 0; });

    await timeService.deleteTime(req, res, next).then(()=>{
        expect(res.json).toHaveBeenCalledTimes(1); 
        expect(res.json).toHaveBeenCalledWith({message:"deleted"}); 
        //expect(timeService.getTimeService).toHaveBeenCalledTimes(1);  
    }); 

}); 






});
