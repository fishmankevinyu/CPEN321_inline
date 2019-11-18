const queue_service = require("../../src/queue/queue.service");
const mock = require("../../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../../src/config.json");
const Db = require("../../src/_helpers/db");
const time_service = require("../../src/course/time.service");

const mockRequest = (data) =>{
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("set time", () =>{
    var connection;
    beforeAll(async ()=>{
        await MongoClient.connect("mongodb://localhost:27017/time",function(err,_db){
            if(err) {throw err;}
            time_service.db = _db.db("time");
            time_service.client = _db;
        });
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true })
        Mongoose.Promise = global.Promise;
    });

    afterAll(async () =>{
        connection.close();
        time_service.db.close();
        time_service.client.close();
    });

    test("set time integration",async ()=>{
        expect(time_service.db).toBeInstanceOf(Mongodb);
         
         const req = mockRequest({body: {
                                 coursename: "lalala",
                                 dayOfWeek: "1",
                                 hour: "15",
                                 minute: "30"
                                 }
          });
          var res = mockResponse();
          const next = jest.fn();
         

          const newTime = {
          
             async test(req, res, next){
                 await time_service.addTime(req, res, next);
             },
          
          async find(req){
             return await time_service.db.findOne({coursename: req.body.coursename});
          }
          };

         const spyTest = jest.spyOn(newTime, 'test');

         await newTime.test(req, res, next);

         const spy = jest.spyOn(newTime, 'find');
          const time = await newTime.find(req);
          
          await expect(spyTest).toHaveBeenCalledWith(req, res, next);
//         await expect(res.status).toHaveBeenCalledWit(400);
          await expect(res.json).toHaveBeenCalledTimes(1);
          await expect(res.json).toHaveBeenCalledWith({message: "successully added"});
          
    });

});
