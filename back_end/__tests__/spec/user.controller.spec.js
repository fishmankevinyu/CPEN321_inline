jest.mock("../../src/users/user.service"); 
jest.mock("../../src/fcm/regToken"); 
const regToken = require("../../src/fcm/regToken"); 
const userService = require("../../src/users/user.service"); 
const config = require("../../src/config.json");
const mongoose = require("mongoose");
const userController = require("../../src/users/users.controller");
const mock = require("../../__mocks__/mock_api_request");
const User = require("../../src/users/user.model");
const {MongoClient} = require('mongodb');
const helper = require("../../src/users/user.service");

const mockRequest = (data) =>{
    return data;
};


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}


describe("user", () =>{
         
         
         let connection;
         let connection_;
         let db;

         beforeAll(async () => {
         
        connection_ = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
         //db = await connection.db(global.__MONGO_DB_NAME__);
         mongoose.Promise = global.Promise;
                   
        });

         
    test("getAllUsers", async ()=>{


         userService.getAll = jest.fn(()=>{return new Promise((resolve,reject)=>{
            resolve(0);
        });
    });
         
        const req = mockRequest();
        var res = mockResponse();
        const next = jest.fn();

        await userController.getAll(req, res, next).then(()=>{
            expect(userService.getAll).toHaveBeenCalledTimes(1); 
            expect(res.json).toHaveBeenCalledTimes(1); 
        }); 

    });

    test("getAllUsers - err ", async ()=>{


        userService.getAll = jest.fn(()=>{return new Promise((resolve,reject)=>{
           reject(0);
       });
   });
        
       const req = mockRequest();
       var res = mockResponse();
       const next = jest.fn();

       await userController.getAll(req, res, next).then(()=>{
           expect(userService.getAll).toHaveBeenCalledTimes(1); 
           expect(next).toHaveBeenCalledTimes(1); 
       }); 

   });

   test("getCurrent", async ()=>{


    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({user: {sub: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getCurrent(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 



});

test("getCurrent - err", async ()=>{


    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({user: {sub: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getCurrent(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 

});

test("getByID", async ()=>{
    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getById(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 

});

test("getByID - err", async ()=>{


    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getById(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 

});

test("update", async ()=>{
    userService.update = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.update(req, res, next); 
   expect(userService.update).toHaveBeenCalledTimes(1); 
   //expect(next).toHaveBeenCalledTimes(1); 
});

test("update - err ", async ()=>{
    userService.update = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.update(req, res, next); 
   expect(userService.update).toHaveBeenCalledTimes(1); 
});

test("register", async ()=>{
    userService.create = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.register(req, res, next); 
   expect(userService.create).toHaveBeenCalledTimes(1); 
   expect(res.json).toHaveBeenCalledTimes(1); 
});

test("register - err", async ()=>{
    userService.create = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.register(req, res, next); 
   expect(userService.create).toHaveBeenCalledTimes(1); 
   expect(next).toHaveBeenCalledTimes(1); 
});

test("authenticate", async ()=>{
    userService.authenticate = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});

regToken.addToken = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc", password: "123"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.authenticate(req, res, next); 
   expect(userService.authenticate).toHaveBeenCalledTimes(1); 
   expect(res.json).toHaveBeenCalledTimes(1); 
});

test("authenticate - err ", async ()=>{
    userService.authenticate = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});

regToken.addToken = jest.fn(()=>{return new Promise((resolve,reject)=>{
    resolve(0);
});
});
    
   const req = mockRequest({params: {id: "1234"}, body: {username: "abc", password: "123"}});
   var res = mockResponse();
   const next = jest.fn();

   await userController.authenticate(req, res, next); 
   expect(userService.authenticate).toHaveBeenCalledTimes(1); 
   //expect(next).toHaveBeenCalledTimes(1); 
});

test("get course", async ()=>{
    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getCourses(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 
   //expect(res.json).toHaveBeenCalledTimes(1); 

});

test("get course - err", async ()=>{


    userService.getById = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.getCourses(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 
   //expect(next).toHaveBeenCalledTimes(1); 

});


test("delete", async ()=>{
    userService.delete = jest.fn(()=>{return new Promise((resolve,reject)=>{
       resolve(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.delete(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 
   //expect(res.json).toHaveBeenCalledTimes(1); 

});

test("delete - err", async ()=>{
    userService.delete = jest.fn(()=>{return new Promise((resolve,reject)=>{
       reject(0);
   });
});
    
   const req = mockRequest({params: {id: "1234"}});
   var res = mockResponse();
   const next = jest.fn();

   userController.delete(req, res, next); 
   expect(userService.getById).toHaveBeenCalledTimes(1); 
   //expect(next).toHaveBeenCalledTimes(1); 

});

});

