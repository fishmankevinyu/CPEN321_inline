const config = require("../src/config.json");
const mongoose = require("mongoose");
const userService = require("../src/users/users.controller");
const mock = require("../__mocks__/mock_api_request");
const User = require("../src/users/user.model");
const {MongoClient} = require('mongodb');
const helper = require("../src/users/user.service");

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
                   
        });

         afterAll(async () => {
           await connection.close();
           await connection_.close();
           await db.close();
         });
         
    test("getAllUsers", async ()=>{
         
         
        const req = mockRequest({ });
        var res = mockResponse();
        const next = jest.fn();

         const allUser = {
            async getAll(){
                return await User.find().select("-hash");
            },

            async test(req, res, next){
                await userService.getAll(req, res, next);
            }
         };

        const spy = jest.spyOn(allUser, 'getAll');
        const spyTest = jest.spyOn(allUser, 'test');

        const users = await allUser.getAll();
        await allUser.test(req, res, next);

         await expect(spy).toHaveBeenCalledWith();
         await expect(spyTest).toHaveBeenCalledWith(req, res, next);

        await expect(res.json).toHaveBeenCalledWith(users);
    });
    
        test("registerUser", async ()=>{

             const req = mockRequest({body: {
                                     firstname: "lalala",
                                     lastname: "hahaha",
                                     isTeacher: true,
                                     username: "dadada",
                                     password: "dididi"
                                     }
              });
              var res = mockResponse();
              const next = jest.fn();

             const regis = {
                async test(req, res, next){
                    await userService.register(req, res, next);
                }

             };
             const spy = jest.spyOn(regis, 'test');
             await regis.test(req, res, next);

             const spy1 = jest.spyOn(helper, 'create');
             //spy.mockReturnValue();

             await expect(spy).toHaveBeenCalledWith(req, res, next);
             await expect(spy1).toHaveBeenCalledWith(req.body);
             await expect(res.json).toHaveBeenCalledTimes(1);
              await expect(res.json).toHaveBeenCalledWith({
                "confirmation":req.body.username + " created successful"
              });

        });
         
});

