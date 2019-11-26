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
        Queue.newQueue = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });
        const req_ = mockRequest({body: {
                                coursename: "abcde",
                                teachers: "12321"
                                }
         });
         var res_ = mockResponse();
         const next_ = jest.fn();
    
    
         await courseService.newCourse(req_, res_, next_); 
        var course = await Course.findOne({coursename: "abcde"});
        // await course.updateOne({$push: {"students": "hahaha"}}); 
        // //console.log(course.students); 
        // await course.save(); 
    
        regToken.getToken = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });
    
    time.getTimeService = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
    });
    
    topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
    });



        var courseTemp = await Course.findOne({coursename: "123"}); 
        const req_add = mockRequest({params: {userid: "5ddb1a23c3da4a78055fe30b", courseid: courseTemp.id}});
        var res_add = mockResponse();
        const next_add = jest.fn();

    var userParam = User.findById(mongoose.Types.ObjectId(req_add.params.userid)); 

topic.subscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

    await courseService.addCourse(req_add, res_add, next_add).then((x)=>{
        expect(topic.subscribe).toHaveBeenCalledTimes(1); 
    });





    const req_drop = mockRequest({params: {userid: "5ddb1a23c3da4a78055fe30b", courseid: courseTemp.id}});
    var res_drop = mockResponse();
    const next_drop = jest.fn();



topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
  });
  });

    await courseService.dropCourse(req_drop, res_drop, next_drop).then((x)=>{
        expect(topic.unsubscribe).toHaveBeenCalledTimes(1); 
    });








const req = mockRequest({params: {id: course.id}}); 
console.log(req.params.id); 
const res = mockResponse(); 
const next = jest.fn(); 

    const helper = {
    
       async test(req, res, next){
           await courseService.deleteCourse(req, res, next);
       },
    
    async find(course){
       return await Course.findOne({coursename: course.coursename});
    }
    };

   const spyTest = jest.spyOn(helper, 'test');

   //await helper.test(req, res, next);
   await helper.test(req, res, next); 
    const spy = jest.spyOn(helper, 'find');
    const after = await helper.find(course);
    
    await expect(spyTest).toHaveBeenCalledWith(req, res,next);
    await expect(after).toBe(null);
 });  
 








    
 });    



        

