const queue_service = require("../../src/queue/queue.service");
const mock = require("../../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../../src/config.json");
const Db = require("../../src/_helpers/db");
const estime = require("../../src/queue/estime");
describe("queue service testing", () =>{
    var connection;
    beforeAll( async ()=>{
        queue_service.client = await MongoClient.connect("mongodb://localhost:27017/queue",{useUnifiedTopology:true});
        queue_service.db = await queue_service.client.db("queue");
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
        Mongoose.Promise = global.Promise;
    });

    afterAll(async (done) =>{
        // await connection.close();
        // await queue_service.db.close();
        // await queue_service.client.close();
        // done();
    });

    test("create db instance", ()=>{
        expect(queue_service.db).toBeInstanceOf(Mongodb);
        expect(connection).toBeDefined();
    });

    test("enque not a user", async done =>{
        const req = mock.mockRequest({
            username: "xxx",
            coursename: "xxx"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await expect(queue_service.db).toBeInstanceOf(Mongodb);
        await queue_service.enque(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);

        done();
    });

    test("enque kevin", async done =>{
        estime.calEST = jest.fn(()=>{return new Promise((resolve,reject)=>{
                resolve(0);
            });
        });
        const req = mock.mockRequest({
            username: "kevin",
            coursename: "CPEN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        expect(connection).toBeDefined();

        await queue_service.enque(req, res, next).then((x)=>{
            expect(res.json).toHaveBeenCalledWith({EST: 0, success:"you are in queue"});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(estime.calEST).toHaveBeenCalled();
        });

        await queue_service.db.collection(req.body.coursename).findOneAndDelete({username: req.body.username});
        done();
    });

    test("deque a user", async (done) =>{
        estime.updateAHT = jest.fn();
        const req = mock.mockRequest({
            coursename: "CPEN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();
        await queue_service.db.collection(req.body.coursename).insertOne({
            username:"kevin",
            entime: Date.now(),
            start: true,
            estime: 0
        })

        await queue_service.deque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(200);
            expect(estime.updateAHT).toHaveBeenCalled();
        });

        done();
    });

    test("create a new queue", async (done) =>{
        estime.newCourseTime = jest.fn(()=>{return 1;});
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
        done();
    });

    test("delete a queue", async(done)=>{
        const req = mock.mockRequest({
            coursename: "ABC000"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.db.collection(req.body.coursename).insertOne({
            username:"kevin",
            entime: Date.now(),
            start: true,
            estime: 0
        });

        await queue_service.queueDelete(req,res,next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({success: "deleted"});
        });
        done();
    });


});
