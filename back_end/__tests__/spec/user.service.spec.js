const config = require("../../src/config.json");
const mongoose = require("mongoose");
const userService = require("../../src/users/user.service");
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

         const allUser = {
            async getAll(){
                return await User.find().select("-hash");
            },
         };

        const spy = jest.spyOn(allUser, 'getAll');

        const users = await allUser.getAll();

        var userTest = await userService.getAll(); 

        await expect(userTest).toEqual(users); 

    });


    test("create", async ()=>{

        const userParam = ({
                                     firstName: "lalala",
                                     lastName: "hahaha",
                                     isTeacher: true,
                                     username: "1234321",
                                     password: "dididi"
                                     
              });

       await userService.create(userParam);

       var errMng; 
       try{
           await userService.create(userParam); 
       }
       catch(e){
           errMng = e; 
       }
       await expect(errMng).toBe("Username " + userParam.username + " is already taken"); 

   });

   test("authenticate", async ()=>{

    const userParam = ({
                                 username: "1234321",
                                 password: "dididi"
                                 
          });

   var returnMsg = await userService.authenticate(userParam);
   console.log(returnMsg); 

});

test("authenticate - user not found", async ()=>{

    const userParam = ({
                                 username: "12321",
                                 password: "dididi"
                                 
          });

    await userService.authenticate(userParam);

});


   test("getByID", async ()=>{

    var user = await User.findOne({username: "1234321"}).select("-hash");

    
   var test = await userService.getById(user.id);
   await expect(test).toEqual(user); 

});

   test("delete", async ()=>{

    var user = await User.findOne({username: "1234321"}); 

    
   await userService.delete(user.id);

});
    
        // test("registerUser", async ()=>{

        //      const req = mockRequest({body: {
        //                              firstname: "lalala",
        //                              lastname: "hahaha",
        //                              isTeacher: true,
        //                              username: "dadada",
        //                              password: "dididi"
        //                              }
        //       });
        //       var res = mockResponse();
        //       const next = jest.fn();

        //      const regis = {
        //         async test(req, res, next){
        //             await userService.register(req, res, next);
        //         }

        //      };
        //      const spy = jest.spyOn(regis, 'test');
        //      await regis.test(req, res, next);

        //      const spy1 = jest.spyOn(helper, 'create');
        //      //spy.mockReturnValue();

        //      await expect(spy).toHaveBeenCalledWith(req, res, next);
        //      await expect(spy1).toHaveBeenCalledWith(req.body);
        //      await expect(res.json).toHaveBeenCalledTimes(1);
        //       await expect(res.json).toHaveBeenCalledWith({
        //         "confirmation":req.body.username + " created successful"
        //       });

        // });
         
});

