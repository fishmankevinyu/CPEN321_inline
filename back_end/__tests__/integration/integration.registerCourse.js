jest.mock("../../src/fcm/send2"); 
jest.mock("../../src/fcm/regToken"); 
jest.mock("../../src/course/time.service"); 
jest.mock("../../src/schedule/scheduling.service"); 
const config = require("../../src/config.json");
const mongoose = require("mongoose");
const courseService = require("../../src/course/course.service");
const Course = require("../../src/course/course.model");
const User = require("../../src/users/user.model");
const Queue = require("../../src/queue/queue.service");
const topic = require("../../src/fcm/send2"); 
const regToken = require("../../src/fcm/regToken"); 
const time = require("../../src/course/time.service"); 
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

describe("course integration testing", () =>{
         
         beforeAll(async () => {
           connection = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
           //db = await connection.db(global.__MONGO_DB_NAME__);
           mongoose.Promise = global.Promise;
         });
         
         
    test("new - register - drop - delete", async ()=>{

        const req_new = mockRequest({body: {
                                coursename: "123",
                                teachers: "123"
                                }
         });
         var res_new = mockResponse();
         const next_new = jest.fn();

         const newCourse = {

         async find(req){
            return await Course.findOne({coursename: req.body.coursename});
         }
         };
         jest.spyOn(newCourse, 'find');
         const course = await newCourse.find(req_new);

        await courseService.newCourse(req_new, res_new, next_new).then(()=>{
            expect(res_new.json).toHaveBeenCalledTimes(1); 
            expect(course).toBeDefined(); 
        }); 

        await courseService.newCourse(req_new, res_new, next_new).then(()=>{
            expect(res_new.json).toHaveBeenCalledTimes(2); 
            expect(res_new.json).toHaveBeenCalledWith({message:"course " + req_new.body.coursename + " exists"});
        })

        // var deleted = await Course.findOneAndDelete({coursename: req.body.coursename}); 
        // await expect(deleted).toBeDefined(); 
        const req_add = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: "5dd73008cbca511a742b65b7"}});
        var res_add = mockResponse();
        const next_add = jest.fn();

        User.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });

    var userParam = User.findById(mongoose.Types.ObjectId(req_add.params.userid)); 

    Course.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
        });
    });

    userParam.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
    });


    topic.subscribe = jest.fn(); 

    await courseService.addCourse(req_add, res_add, next_add).then((x)=>{
        expect(topic.subscribe).toHaveBeenCalledTimes(1); 
    });

    const req_drop = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: "5dd73008cbca511a742b65b7"}});
    var res_drop = mockResponse();
    const next_drop = jest.fn();

    topic.unsubscribe = jest.fn(); 

    await courseService.dropCourse(req_drop, res_drop, next_drop).then((x)=>{
        expect(topic.unsubscribe).toHaveBeenCalledTimes(1); 
    });

    const req_delete = mockRequest({params: {id: course.id}});
    var res_delete = mockResponse();
    const next_delete = jest.fn();


    User.findOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

    var i = 0; 
    User.findOne({username: course.students[i]}).updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

    regToken.getToken = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

time.getTimeService = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});
schedule.deleteSchedule = jest.fn();

await courseService.deleteCourse(req_delete, res_delete, next_delete).then((x)=>{
    
    expect(res_delete.json).toHaveBeenCalledTimes(1);
    expect(res_delete.json).toHaveBeenCalledWith({message:"deleted"}); 
});
 });    

    });

        

