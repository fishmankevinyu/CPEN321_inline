jest.mock("../../src/schedule/scheduling.service"); 
const config = require("../../src/config.json");
const Mongoose = require("mongoose");
const Course = require("../../src/course/course.model");
const timeService = require("../../src/course/time.service"); 
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const schedule = require("../../src/schedule/scheduling.service"); 
const courseService = require("../../src/course/course.service"); 

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

    


   test("new course - add time - delete time", async ()=>{

    const req_ = mockRequest({body: {
        coursename: "testTimeService",
        teachers: "123"
        }
    });
    var res_ = mockResponse();
    const next_ = jest.fn();

    

    await courseService.newCourse(req_, res_, next_)

    
      
      var course = await Course.findOne({coursename: "testTimeService"});
      
      console.log(course);

    const req_add = mockRequest({body: {
        coursename: "testTimeService"
        }
});
    var res_add = mockResponse();
    const next_add = jest.fn();

    schedule.addSchedule = jest.fn(()=>{return 0; }); 
    schedule.startSchedule = jest.fn(()=>{return 0; });

    await timeService.addTime(req_add, res_add, next_add).then(()=>{
        expect(res_add.json).toHaveBeenCalledTimes(1); 
        expect(res_add.json).toHaveBeenCalledWith({message: "successully added"}); 
    }); 

    const req_delete = mockRequest({body: {
        coursename: "testTimeService"
        }
});
    var res_delete = mockResponse();
    const next_delete = jest.fn();
    schedule.deleteSchedule = jest.fn(()=>{return 0; });

    await timeService.deleteTime(req_delete, res_delete, next_delete).then(()=>{
        expect(res_delete.json).toHaveBeenCalledTimes(1); 
        expect(res_delete.json).toHaveBeenCalledWith({message:"deleted"}); 
        //expect(timeService.getTimeService).toHaveBeenCalledTimes(1);  
    }); 

        var deleted = await Course.findOneAndDelete({coursename: "testTimeService"}); 
        await expect(deleted).toBeDefined(); 

}); 






});
