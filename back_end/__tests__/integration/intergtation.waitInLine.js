const queue_service = require("../../src/queue/queue.service");
const estime = require("../../src/queue/estime");
const mock = require("../../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../../src/config.json");
const Db = require("../../src/_helpers/db");

describe("enque then deque", ()=>{

    var connection;
    beforeAll(async ()=>{
        
        await MongoClient.connect("mongodb://localhost:27017/Est",function(err,_db){
            if(err) {throw err;}
            estime.db = _db.db("ESTs");
            estime.client = _db;
            estime.ests = estime.db.collection("ests");
        });

        await MongoClient.connect("mongodb://localhost:27017/queue",function(err,_db){
            if(err) {throw err;}
            queue_service.db = _db.db("queue");
            queue_service.client = _db;
        });
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
        Mongoose.Promise = global.Promise;
    });

    afterAll(async () =>{
        connection.close();
        queue_service.db.close();
        queue_service.client.close();
        estime.db.close();
        estime.client.close();
    });

    test("enque then deque",async ()=>{

        const req = mock.mockRequest({
            username: "kevin",
            coursename: "CPEN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await expect(queue_service.db).toBeInstanceOf(Mongodb);

        await queue_service.enque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(200);

            return queue_service.deque(req, res, next);
        }).then((result)=>{
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });


});
