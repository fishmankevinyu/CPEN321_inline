const queue_service = require("../src/queue/queue.service");
const mock = require("../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../src/config.json");
const Db = require("../src/_helpers/db")
describe("enque", () =>{
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

    test("enque not a user", () =>{
        const req = mock.mockRequest({
            username: "xxx",
            coursename: "xxx"
        });
        var res = mock.mockResponse();
        var next = jest.fn();

        expect(queue_service.db).toBeInstanceOf(Mongodb);

        queue_service.enque(req, res, next).then((x)=>{
            expect(res.status).toHaveBeenCalledWith(400);
        });

    });

    
});