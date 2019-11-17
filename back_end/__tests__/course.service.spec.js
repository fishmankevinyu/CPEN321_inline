const config = require("../src/config.json");
const mongoose = require("mongoose");
const courseService = require("../src/course/course.service");
//const mock = require("../__mocks__/mock_api_request");
const Course = require("../src/course/course.model");
const User = require("../src/users/user.model");

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
         
         
    test("newCourse", async ()=>{
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

        const spyTest = jest.spyOn(newCourse, 'test');

        await newCourse.test(req, res, next);
         await newCourse.test(req, res, next);
         const spy = jest.spyOn(newCourse, 'find');
         const course = await newCourse.find(req);
         
         await expect(spyTest).toHaveBeenCalledWith(req, res, next);
         await expect(res.json).toHaveBeenCalledTimes(2);
         await expect(course).toBeDefined();
         await expect(res.json).toHaveBeenCalledWith({message:"course " + req.body.coursename + " exists"});
    });
         
         test("updateCourse - found", async ()=>{
              
              var course = await Course.findOne({coursename: "lalala"});
                            
              const req = mockRequest({params: {id: course.id}, body: {
                                      coursename: "lalala",
                                      teachers: "4321"
                                      }});
              var res = mockResponse();
              const next = jest.fn();

              const updateCourse = {
              
                 async test(req, res, next){
                     await courseService.updateCourse(req, res, next);
                 },
              
              async find(req){
                 return await Course.findOne({coursename: "lalala"});
              }
              };

             const spyTest = jest.spyOn(updateCourse, 'test');

             await updateCourse.test(req, res, next);
              const spy = jest.spyOn(updateCourse, 'find');
              const updated = await updateCourse.find(req);
                        
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
              await expect(res.json).toHaveBeenCalledTimes(1);
              //await expect(after).toBe(null);
              await expect(updated.teachers[0]).toBe("4321");
         });
         
         
         test("updateCourse - not found", async ()=>{

              const req = mockRequest({params: {id: 1234}});
              var res = mockResponse();
              const next = jest.fn();

              const updateCourse = {
              
                 async test(req, res, next){
                     await courseService.updateCourse(req, res, next);
                 }
              };

             const spyTest = jest.spyOn(updateCourse, 'test');

             await updateCourse.test(req, res, next);
                        
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
              await expect(res.json).toHaveBeenCalledTimes(1);
              //await expect(after).toBe(null);
              await expect(res.status).toHaveBeenCalledWith(404);
              await expect(res.json).toHaveBeenCalledWith({message:"no course found"});
         });
         
//         test("add course", async ()=>{
//
//              var course = await Course.findOne({coursename: "lalala"});
//              var user = await User.findOne({username: "lalala"});
//
//              const req = mockRequest({params: {courseid: course.id, userid: user.id}});
//              var res = mockResponse();
//              const next = jest.fn();
//
//              const addCourse = {
//
//                 async test(req, res, next){
//                     await courseService.addCourse(req, res, next);
//                 }
//              };
//
//             const spyTest = jest.spyOn(addCourse, 'test');
//
//             await addCourse.test(req, res, next);
//
//              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
//              await expect(res.json).toHaveBeenCalledTimes(1);
//              //await expect(after).toBe(null);
//              //await expect(res.status).toHaveBeenCalledWith(404);
//              //await expect(res.json).toHaveBeenCalledWith({message:"no course found"});
//         });
         
         
         test("get id by name - found ", async ()=>{
              
              var course = await Course.findOne({coursename: "lalala"});

              const req = mockRequest({body: {coursename: "lalala"}});
              var res = mockResponse();
              const next = jest.fn();

              const getCourseID = {
              
                 async test(req, res, next){
                     await courseService.getByName(req, res, next);
                 }
              };

             const spyTest = jest.spyOn(getCourseID, 'test');

             await getCourseID.test(req, res, next);
                        
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
              await expect(res.json).toHaveBeenCalledTimes(1);
              await expect(res.json).toHaveBeenCalledWith(course);
         });
         
         test("get id by name - not found", async ()=>{

               const req = mockRequest({body: {coursename: "dadada"}});
               var res = mockResponse();
               const next = jest.fn();

               const getCourseID = {
               
                  async test(req, res, next){
                      await courseService.getByName(req, res, next);
                  }
               };

              const spyTest = jest.spyOn(getCourseID, 'test');

              await getCourseID.test(req, res, next);
                        
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
              await expect(res.json).toHaveBeenCalledTimes(1);
              await expect(res.status).toHaveBeenCalledWith(404);
              await expect(res.json).toHaveBeenCalledWith({message:"no course found"});
         });
         
         test("deleteCourse", async ()=>{
              
              var course = await Course.findOne({coursename: "lalala"});
              
              console.log(course);
              
              const req = mockRequest({params: {id: course.id}});
              var res = mockResponse();
              const next = jest.fn();

              const deleteCourse = {
              
                 async test(req, res, next){
                     await courseService.deleteCourse(req, res, next);
                 },
              
              async find(req){
                 return await Course.findOne({coursename: "lalala"});
              }
              };

             const spyTest = jest.spyOn(deleteCourse, 'test');

             await deleteCourse.test(req, res, next);
              const spy = jest.spyOn(deleteCourse, 'find');
              const after = await deleteCourse.find(req);
              
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);
              await expect(res.json).toHaveBeenCalledTimes(1);
              await expect(after).toBe(null);
              await expect(res.json).toHaveBeenCalledWith({message:"deleted"});
         });
         
         test("getAllCourses", async ()=>{
              
              
             const req = mockRequest({ });
             var res = mockResponse();
             const next = jest.fn();

              const allCourse = {
                 async getAll(){
                     return await Course.find().select("-hash");
                 },

                 async test(req, res, next){
                     await courseService.getAll(req, res, next);
                 }
              };

             const spy = jest.spyOn(allCourse, 'getAll');
             const spyTest = jest.spyOn(allCourse, 'test');

             const courses = await allCourse.getAll();
             await allCourse.test(req, res, next);

              await expect(spy).toHaveBeenCalledWith();
              await expect(spyTest).toHaveBeenCalledWith(req, res, next);

             await expect(res.json).toHaveBeenCalledWith(courses);
         });
         
         
         
         
         
         
});
