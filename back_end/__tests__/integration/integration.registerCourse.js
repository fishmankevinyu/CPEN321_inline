const config = require("../../src/config.json");
const mongoose = require("mongoose");
const courseService = require("../../src/course/course.service");
//const mock = require("../__mocks__/mock_api_request");
const Course = require("../../src/course/course.model");
const User = require("../../src/users/user.model");

const mockRequest = (data) =>{
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("course", () =>{
         
         beforeAll(async () => {
           connection = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
           //db = await connection.db(global.__MONGO_DB_NAME__);
           mongoose.Promise = global.Promise;
         });
         
         
    test("registerCourse", async ()=>{
        const req = mockRequest({body: {
                                coursename: "lalala",
                                teachers: "1234"
                                }
         });
         var res = mockResponse();
         const next = jest.fn();

         const newCourse = {
         
            async test(req, res, next){
                await courseService.newCourse(req, res, next);
            },
         
         async find(req){
            return await Course.findOne({coursename: req.body.coursename});
         }
         };

        const spyTest1 = jest.spyOn(newCourse, 'test');

        await newCourse.test(req, res, next);
         await newCourse.test(req, res, next);
         const spy = jest.spyOn(newCourse, 'find');
         const course = await newCourse.find(req);
         
         await expect(spyTest1).toHaveBeenCalledWith(req, res, next);
         await expect(res.json).toHaveBeenCalledTimes(2);
         await expect(course).toBeDefined();
         await expect(res.json).toHaveBeenCalledWith({message:"course " + req.body.coursename + " exists"});
         
          var user = await User.findOne({username: "lalala"});

          req = mockRequest({params: {courseid: course.id, userid: user.id}});
          res = mockResponse();
          next = jest.fn();

          const addCourse = {

             async test(req, res, next){
                 await courseService.addCourse(req, res, next);
             }
          };

         const spyTest2 = jest.spyOn(addCourse, 'test');

         await addCourse.test(req, res, next);

          await expect(spyTest2).toHaveBeenCalledWith(req, res, next);
          await expect(res.json).toHaveBeenCalledTimes(1);
    });

});
