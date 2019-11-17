const queue_service = require("../src/queue/queue.service");
const mock = require("../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../src/config.json");
const Db = require("../src/_helpers/db");
const estime = require("../src/queue/estime");

jest.mock("../src/queue/estime");
describe("queue service testing", () =>{
    var connection;
    beforeAll(async ()=>{
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
    });

    test("create db instance", ()=>{
        expect(queue_service.db).toBeInstanceOf(Mongodb);
    });

    test("enque not a user", async () =>{
        const req = mock.mockRequest({
            username: "xxx",
            coursename: "xxx"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await expect(queue_service.db).toBeInstanceOf(Mongodb);

        await queue_service.enque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(400);
        });

    });

    test("enque kevin", async() =>{
        const req = mock.mockRequest({
            username: "kevin",
            coursename: "CEPN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.enque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(200);
            expect(estime.calEST).toHaveBeenCalled();
        });
    });

    test("deque a user", async () =>{
        const req = mock.mockRequest({
            coursename: "CEPN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.deque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(200);
            expect(estime.updateAHT).toHaveBeenCalled();
        });
    });

    test("create a new queue", async () =>{
        const req = mock.mockRequest({
            coursename: "CEPN433",
            AA: "1"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.newQueue2(req,res,next)
        .then((x)=>{
            expect(res.json).toHaveBeenCalledWith({"message":"success"});
        });
    });

    test("delete a queue", async()=>{
        const req = mock.mockRequest({
            coursename: "ABC000"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.queueDelete(req,res,next).then((x)=>{
            expect(queue_service.db.collection("ABC000")).toBeUndefined();
        });
    });


});