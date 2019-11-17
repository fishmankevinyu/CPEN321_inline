const config = require("../../src/config.json");
const mongoose = require("mongoose");
const userService = require("../../src/users/users.controller");
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


describe("login usecase", () =>{
         
         
         let connection;
         let connection_;
         let db;
         var user;

         beforeAll(async () => {
//           await MongoClient.connect("mongodb://localhost:27017",function(err,_db){
//               if(err) {throw err;}
//           });
                   
        connection = await MongoClient.connect("mongodb://localhost:27017/users", {
          useNewUrlParser: true,
        });
        db = await connection.db(global.MongoClient);
        MongoClient.Promise = global.Promise;
         
        connection_ = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
         //db = await connection.db(global.__MONGO_DB_NAME__);
         mongoose.Promise = global.Promise;
                   
        user = await User.findOne({username: "lalala"});
                   
        });

         afterAll(async () => {
           await connection.close();
           await connection_.close();
           await db.close();
         });
                  
    
        test("login", ()=>{

             const req = mockRequest({body: {
                                     username: "lalala",
                                     password: "lalala"
                                     }
              });
              var res = mockResponse();
              const next = jest.fn();

             const auth = {
                test(req, res, next){
                    userService.authenticate(req, res, next);
                }

             };
             const spy = jest.spyOn(auth, 'test');
             auth.test(req, res, next);

             //const spy1 = jest.spyOn(helper, 'create');
             //spy.mockReturnValue();

             expect(spy).toHaveBeenCalledWith(req, res, next);
             //await expect(spy1).toHaveBeenCalledWith(req.body);
             expect(res.json).toHaveBeenCalledTimes(1);
             expect(res.json).toHaveBeenCalledWith(user);

        });
         
});
