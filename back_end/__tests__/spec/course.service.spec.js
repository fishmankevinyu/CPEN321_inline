jest.mock("../../src/queue/queue.service"); 
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

describe("course service testing", () =>{
         
         beforeAll(async () => {
           connection = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
           //db = await connection.db(global.__MONGO_DB_NAME__);
           mongoose.Promise = global.Promise;
         });
         
         
    test("newCourse", async ()=>{
         Queue.newQueue = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });
        const req = mockRequest({body: {
                                coursename: "123",
                                teachers: "123"
                                }
         });
         var res = mockResponse();
         const next = jest.fn();

         const newCourse = {

         async find(req){
            return await Course.findOne({coursename: req.body.coursename});
         }
         };
         jest.spyOn(newCourse, 'find');
         const course = await newCourse.find(req);

        await courseService.newCourse(req, res, next).then(()=>{
            expect(res.json).toHaveBeenCalledTimes(1); 
            expect(Queue.newQueue).toHaveBeenCalledTimes(1); 
            expect(course).toBeDefined(); 
        }); 

        await courseService.newCourse(req, res, next).then(()=>{
            expect(res.json).toHaveBeenCalledTimes(2); 
            expect(Queue.newQueue).toHaveBeenCalledTimes(1); 
            expect(res.json).toHaveBeenCalledWith({message:"course " + req.body.coursename + " exists"});
        })

        // var deleted = await Course.findOneAndDelete({coursename: req.body.coursename}); 
        // await expect(deleted).toBeDefined(); 

    });
         
         test("updateCourse - found", async ()=>{
              
              var course = await Course.findOne({coursename: "123"});
                            
              const req = mockRequest({params: {id: course.id}, body: {
                                      coursename: "123",
                                      teachers: "4321"
                                      }});
              var res = mockResponse();
              const next = jest.fn();

              const updateCourse = {
              
                 async test(req, res, next){
                     await courseService.updateCourse(req, res, next);
                 },
              
              async find(req){
                 return await Course.findOne({coursename: "123"});
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

              const req = mockRequest({params: {id: 123}});
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
                  
         
         test("get id by name - found ", async ()=>{
              
              var course = await Course.findOne({coursename: "123"});

              const req = mockRequest({body: {coursename: "123"}});
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

         test("addUser", async ()=>{
              
              
            const req = mockRequest({ });
            var res = mockResponse();
            const next = jest.fn();
            const userParam = {username: "abc"}; 
            const courseParam = {coursename: "123"}; 

            courseParam.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
                resolve(0);
            });
        });

        await courseService.addUser(req, res, next, userParam, courseParam).then((x)=>{
            expect(courseParam.updateOne).toHaveBeenCalledTimes(1); 
            expect(res.json).toHaveBeenCalledTimes(1); 
            //expect(estime.updateAHT).toHaveBeenCalled();
        });
        });

        test("addCourse - valid", async ()=>{
              
            var courseTemp = await Course.findOne({coursename: "123"}); 
            const req = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: courseTemp.id}});
            var res = mockResponse();
            const next = jest.fn();

            User.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
                resolve(0);
            });
        });

        var userParam = User.findById(mongoose.Types.ObjectId(req.params.userid)); 

        Course.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });

    userParam.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

    courseService.addUser = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

    topic.subscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

        await courseService.addCourse(req, res, next).then((x)=>{
            expect(topic.subscribe).toHaveBeenCalledTimes(1); 
        });
        });


        test("addCourse - user invalid", async ()=>{
              
            const req = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: "5dd73060cbca511a742b65ba"}});
            var res = mockResponse();
            const next = jest.fn();

        await courseService.addCourse(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message:"no course found"});  
        });
        });

        test("addCourse - course invalid", async ()=>{
              
            const req = mockRequest({params: {userid: "5dd73008cbca511a742b65b7", courseid: "5dd73008cbca511a742b65b7"}});
            var res = mockResponse();
            const next = jest.fn();

        await courseService.addCourse(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message:"no user found"});  
        });
        });

        test("get course by id - found ", async ()=>{
              
            var course = await Course.findOne({coursename: "123"});
            console.log("id is " + course.id); 

            const req = mockRequest({params: {id: course.id}, body: {
                coursename: "123"
                }});
            //console.log("id is " + req.params.id); 

            var res = mockResponse();
            const next = jest.fn();

            const getCourseByID = {
            
               async test(req, res, next){
                   await courseService.getCourseById(req, res, next);
               }
            };

           const spyTest = jest.spyOn(getCourseByID, 'test');

           await getCourseByID.test(req, res, next);
                      
            await expect(spyTest).toHaveBeenCalledWith(req, res, next);
            await expect(res.json).toHaveBeenCalledTimes(1);
            await expect(res.json).toHaveBeenCalledWith(course);
       });


       test("dropUser", async ()=>{
              
              
        const req = mockRequest({ });
        var res = mockResponse();
        const next = jest.fn();
        const userParam = {username: "abc"}; 
        const courseParam = {coursename: "123"}; 

        courseParam.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });

    await courseService.dropUser(req, res, next, userParam, courseParam).then((x)=>{
        expect(courseParam.updateOne).toHaveBeenCalledTimes(1); 
        expect(res.json).toHaveBeenCalledTimes(1); 
        //expect(estime.updateAHT).toHaveBeenCalled();
    });
    });

    test("dropCourse - valid", async ()=>{
          
        var courseTemp = await Course.findOne({coursename: "123"}); 
        const req = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: courseTemp.id}});
        var res = mockResponse();
        const next = jest.fn();

        User.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });

    var userParam = User.findById(mongoose.Types.ObjectId(req.params.userid)); 

    Course.findByID = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

userParam.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

courseService.dropUser = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

    await courseService.dropCourse(req, res, next).then((x)=>{
        expect(topic.unsubscribe).toHaveBeenCalledTimes(1); 
    });
    });


    test("dropCourse - user invalid", async ()=>{
          
        const req = mockRequest({params: {userid: "5dd73060cbca511a742b65ba", courseid: "5dd73060cbca511a742b65ba"}});
        var res = mockResponse();
        const next = jest.fn();

    await courseService.dropCourse(req, res, next).then((x)=>{
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"no course found"});  
    });
    });

    test("dropCourse - course invalid", async ()=>{
          
        const req = mockRequest({params: {userid: "5dd73008cbca511a742b65b7", courseid: "5dd73008cbca511a742b65b7"}});
        var res = mockResponse();
        const next = jest.fn();

    await courseService.dropCourse(req, res, next).then((x)=>{
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"no user found"});  
    });
    });

    test("get course by id - found ", async ()=>{
          
        var course = await Course.findOne({coursename: "123"});
        console.log("id is " + course.id); 

        const req = mockRequest({params: {id: course.id}, body: {
            coursename: "123"
            }});
        //console.log("id is " + req.params.id); 

        var res = mockResponse();
        const next = jest.fn();

        const getCourseByID = {
        
           async test(req, res, next){
               await courseService.getCourseById(req, res, next);
           }
        };

       const spyTest = jest.spyOn(getCourseByID, 'test');

       await getCourseByID.test(req, res, next);
                  
        await expect(spyTest).toHaveBeenCalledWith(req, res, next);
        await expect(res.json).toHaveBeenCalledTimes(1);
        await expect(res.json).toHaveBeenCalledWith(course);
   });



       test("get course by id - not found ", async ()=>{

        const req = mockRequest({params: {id: "5dd73060cbca511a742b65ba"}, body: {
            coursename: "123"
            }});
        //console.log("id is " + req.params.id); 

        var res = mockResponse();
        const next = jest.fn();

        const getCourseByID = {
        
           async test(req, res, next){
               await courseService.getCourseById(req, res, next);
           }
        };

       const spyTest = jest.spyOn(getCourseByID, 'test');

       await getCourseByID.test(req, res, next);
                  
        await expect(spyTest).toHaveBeenCalledWith(req, res, next);
        await expect(res.status).toHaveBeenCalledWith(404); 
        await expect(res.json).toHaveBeenCalledTimes(1);
        await expect(res.json).toHaveBeenCalledWith({message:"no course found"});
   });
        
   test("get students - found ", async ()=>{
              
    var course = await Course.findOne({coursename: "123"});

    const req = mockRequest({params: {id: course.id}, body: {
        coursename: "123"
        }});

    var res = mockResponse();
    const next = jest.fn();

    const getStudentsTest = {
    
       async test(req, res, next){
           await courseService.getStudents(req, res, next);
       }
    };

   const spyTest = jest.spyOn(getStudentsTest, 'test');

   await getStudentsTest.test(req, res, next);
              
    await expect(spyTest).toHaveBeenCalledWith(req, res, next);
    await expect(res.json).toHaveBeenCalledTimes(1);
    await expect(res.json).toHaveBeenCalledWith(course.students);
});

test("get students - not found ", async ()=>{
    const req = mockRequest({params: {id: "5dd73060cbca511a742b65ba"}, body: {
        coursename: "123"
        }});

    var res = mockResponse();
    const next = jest.fn();

    const getStudentsTest = {
    
       async test(req, res, next){
           await courseService.getStudents(req, res, next);
       }
    };

   const spyTest = jest.spyOn(getStudentsTest, 'test');

   await getStudentsTest.test(req, res, next);
              
   await expect(spyTest).toHaveBeenCalledWith(req, res, next);
   await expect(res.status).toHaveBeenCalledWith(404); 
   await expect(res.json).toHaveBeenCalledTimes(1);
   await expect(res.json).toHaveBeenCalledWith({message:"no course found"});
});


test("deleteHelper", async ()=>{
              
    var course = await Course.findOne({coursename: "123"});
    await course.updateOne({$push: {"students": "hahaha"}}); 
    //console.log(course); 
    await course.save(); 
    
    //console.log(courseReal);
    //var course = {students: [{username: "hahaha"}], coursename: "123", _id: courseReal._id}; 

    User.findOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
        resolve(0);
    });
});

    var i = 0; 
    var user = User.findOne({username: course.students[i]}); 
    user.updateOne = jest.fn(()=>{return new Promise((resolve,reject)=>{
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

topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

    const helper = {
    
       async test(course){
           await courseService.deleteHelper(course);
       },
    
    async find(course){
       return await Course.findOne({coursename: course.coursename});
    }
    };

   const spyTest = jest.spyOn(helper, 'test');

   await helper.test(course);
    const spy = jest.spyOn(helper, 'find');
    const after = await helper.find(course);
    
    await expect(spyTest).toHaveBeenCalledWith(course);
    await expect(after).toBe(null);
});
         
test("deleteCourse - catch error ", async ()=>{

    const req_ = mockRequest({body: {
        coursename: "4321",
        teachers: "123", 
        students: "hahaha"
        }
    });
    var res_ = mockResponse();
    const next_ = jest.fn();

    

    await courseService.newCourse(req_, res_, next_)

    
      
      var course = await Course.findOne({coursename: "4321"});
      
      console.log(course);
      
      const req = mockRequest({params: {id: course.id}});
      var res = mockResponse();
      const next = jest.fn();

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

time.getTimeService = jest.fn(()=>{return [{coursename: "123"}]}
);

schedule.deleteSchedule = jest.fn(); 


topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

await courseService.deleteCourse(req, res, next).then((x)=>{
    
    expect(next).toHaveBeenCalledTimes(1); 
});
 });

 test("deleteCourse - normal response ", async ()=>{

    const req_ = mockRequest({body: {
        coursename: "abcde",
        teachers: "123"
        }
    });
    var res_ = mockResponse();
    const next_ = jest.fn();

    

    await courseService.newCourse(req_, res_, next_)

    
      
      var course = await Course.findOne({coursename: "abcde"});
      
      console.log(course);
      
      const req = mockRequest({params: {id: course.id}});
      var res = mockResponse();
      const next = jest.fn();

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


topic.unsubscribe = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});

await courseService.deleteCourse(req, res, next).then((x)=>{
    
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({message:"deleted"}); 
});
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
