const queue_service = require("../../src/queue/queue.service");
const mock = require("../../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../../src/config.json");
const Db = require("../../src/_helpers/db");
const estime = require("../../src/queue/estime");

var connection;


estime.updateAHT = jest.fn();

beforeAll( async ()=>{
    queue_service.client = await MongoClient.connect("mongodb://localhost:27017/queue",{useUnifiedTopology:true});
    queue_service.db = await queue_service.client.db("queue");
    connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
    Mongoose.Promise = global.Promise;
});

describe("queue service testing", () =>{

    test("create db instance", ()=>{
        expect(queue_service.db).toBeInstanceOf(Mongodb);
        expect(connection).toBeDefined();
    });

    test("enque not a user", async (done) =>{
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

    test("enque kevin", async (done) =>{
        estime.calEST = jest.fn((coursename, username)=>{
            return new Promise((resolve,reject)=>{
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

    test("enque a null user", async (done)=>{
        const req = mock.mockRequest({
            username: null,
            coursename: "CPEN433"
        });
        var res = mock.mockResponse();
        var next = jest.fn();
        await queue_service.enque(req, res, next);

        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(estime.calEST).toHaveBeenCalled();

        done();
    });

    test("enque a null course", async (done)=>{
        const req = mock.mockRequest({
            username: "kevin",
            coursename: null
        });
        var res = mock.mockResponse();
        var next = jest.fn();
        await queue_service.enque(req, res, next);

        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(estime.calEST).toHaveBeenCalled();

        done();
    });

    test("enque a user who is not in this course", async (done)=>{
        const req = mock.mockRequest({
            username: "kevin",
            coursename: "CPEN432"
        });
        var res = mock.mockResponse();
        var next = jest.fn();
        await queue_service.enque(req, res, next);

        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(estime.calEST).toHaveBeenCalled();

        done();
    });
});

describe("deque", ()=>{

    test("deque a user", async (done) =>{
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

    test("deque a empty queue", async (done)=>{
        const req = mock.mockRequest({
            coursename: "NEN123"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.deque(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(estime.updateAHT).toHaveBeenCalled();
        
        done();
    });
});

describe("selfDeque", ()=>{
    test("a user self deque", async(done)=>{
        const req = mock.mockRequest({
            coursename: "NEXT321",
            username: "kevin"
        });
        var res = mock.mockResponse();
        var next = jest.fn();
        await queue_service.db.collection(req.body.coursename).insertOne({
            username: req.body.username,
            entime: Date.now(),
            start: true,
            estime: 0
        });

        await queue_service.selfDeque(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(estime.updateAHT).toHaveBeenCalled();
        
        done();
    });

    test("non user self deque", async(done)=>{
        const req = mock.mockRequest({
            coursename: "NEXT321",
            username: "kevin"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.selfDeque(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(estime.updateAHT).toHaveBeenCalled();
        done();
    });

});

describe("newQueue", ()=>{
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

    test("produce err by mock", async(done)=>{
        estime.newCourseTime = jest.fn(()=>{return 0;});
        const req = mock.mockRequest({
            coursename: "CEPN433",
            AA: "1"
        });
        var res = mock.mockResponse();
        var next = jest.fn((err)=>{return 0});

        await queue_service.newQueue2(req,res,next);
        expect(next).toHaveBeenCalled();
        done();
    });
});

describe("deleteQueue", ()=>{
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

    test("delete a null queue", async(done)=>{
        const req = mock.mockRequest({
            coursename: null
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.queueDelete(req,res,next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({failure: "coursename null"});
        });
        done();
    })
});

describe("updateEst", ()=>{
    
    test("update estime for a user", async ()=>{
        estime.calEST = jest.fn((coursename, username)=>{
            return new Promise((resolve,reject)=>{
                resolve(0);
            });
        });
        const req = mock.mockRequest({
            coursename: "ERR123",
            username: "kevin"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.updateEST(req,res,next);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("update estime for for invalid coursename", async ()=>{
        estime.calEST = jest.fn((coursename, username)=>{
            return new Promise((resolve,reject)=>{
                reject(1);
            });
        });
        const req = mock.mockRequest({
            coursename: "ERR123",
            username: "kevin"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        await queue_service.updateEST(req,res,next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

describe("checkIndex testing", ()=>{
    test("checkIndex of a user", async(done)=>{
        queue_service.db.collection("CPEN433").insertOne({
            username:"testbot",
            entime: Date.now(),
            start: true,
            estime: 0
        });

        let index = await queue_service.checkIndex("CPEN433","testbot");
        expect(index).toBe(1);

        queue_service.db.collection("CPEN433").findOneAndDelete({
            username:"testbot"
        });

        done();
    })
})

afterAll(async (done) =>{
    await queue_service.client.close();
    done();
});
