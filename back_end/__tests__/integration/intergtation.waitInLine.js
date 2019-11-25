const course_service = require("../../src/course/course.service");
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
        
        estime.client = await MongoClient.connect("mongodb://localhost:27017/Est",{useUnifiedTopology:true});
        estime.db = await estime.client.db("ESTs");
        estime.ests = await estime.db.collection("ests");

        queue_service.client = await MongoClient.connect("mongodb://localhost:27017/queue",{useUnifiedTopology:true});
        queue_service.db = await queue_service.client.db("queue");
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
        Mongoose.Promise = global.Promise;
    });

    afterAll(async () =>{
        connection.close();
        queue_service.client.close();
        estime.client.close();
    });

    test("enque then deque",async ()=>{

        req = mock.mockRequest({
            coursename: "CPEN433",
            username: "kevin"
        })

        res = mock.mockResponse();

        next = jest.fn();

        await queue_service.enque(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);

        await queue_service.selfDeque(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);

        await queue_service.enque(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);

        await queue_service.deque(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);


    });


});
