const config = require("../../src/config.json");
const mongoose = require("mongoose");
const userService = require("../../src/users/user.service");
const User = require("../../src/users/user.model");
const userController = require("../../src/users/users.controller"); 

const mockRequest = (data) =>{
    return data;
};


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}


describe("login", () =>{
         
         
         let connection;
         let connection_;
         let db;

         beforeAll(async () => {
         
        connection_ = await mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
         //db = await connection.db(global.__MONGO_DB_NAME__);
         mongoose.Promise = global.Promise;
                   
        });

         
  
    test("create - authenticate - delete", async ()=>{
     

        const req_create = mockRequest({body: {
                                     firstName: "lalala",
                                     lastName: "hahaha",
                                     isTeacher: true,
                                     username: "test3",
                                     password: "dididi"
                                     
              }});
              var res_create = mockResponse();
              const next_create = jest.fn();
              

       await userController.register(req_create, res_create, next_create);


       const req_aut = mockRequest({body: {
        username: "test3",
        password: "dididi"
        
}});
    var res_aut = mockResponse();
    const next_aut = jest.fn();


       await userController.authenticate(req_aut, res_aut, next_aut);



        var userDel = await User.findOne({username: "test3"}); 
        await expect(userDel).toBeDefined(); 

       const req_del = mockRequest({params: {id: userDel.id}       
});
        var res_del = mockResponse();
        const next_del = jest.fn();
       await userController.delete(req_del, res_del, next_del); 

       await expect(res_create.json).toHaveBeenCalledTimes(1); 
       await expect(res_aut.json).toHaveBeenCalledTimes(1); 
       var userTest = await User.findOneAndDelete({username: "test3"}); 
       await expect(userTest).toBe(null); 
       //await expect(res_del.json).toHaveBeenCalledTimes(1); 

    //    var user = await User.findOne({username: "testtest"}); 

    //    await userService.delete(user.id); 



   });

         
});

