const queue_service = require("../../src/queue/queue.service");
const mock = require("../../__mocks__/mock_api_request");
const Mongodb = require("mongodb").Db;
const MongoClient = require("mongodb").MongoClient;
const Mongoose = require("mongoose");
const config = require("../../src/config.json");
const Db = require("../../src/_helpers/db");
const estime = require("../../src/queue/estime");

describe("estime", () =>{
    var connection;
    beforeAll(async ()=>{
        await MongoClient.connect("mongodb://localhost:27017/Est",function(err,_db){
            if(err) {throw err;}
            estime.db = _db.db("ESTs");
            estime.client = _db;
            estime.ests = estime.db.collection("ests");
        });
        connection = await Mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
        Mongoose.Promise = global.Promise;
    });

    afterAll(async () =>{
        connection.close();
        estime.db.close();
        estime.client.close();
    });

    test("create estime db instance", ()=>{
        expect(estime.db).toBeInstanceOf(Mongodb);
    });

    test("newCourseTime test", async () =>{

        await estime.newCourseTime("ABC000","1").then((x)=>{
            estime.ests.findOne({coursename: "ABC000"}).then((x)=>{
                expect(x.coursename).toBe("ABC000");
            });
        });

    });

    test("updateAHT test", async ()=>{
        var oldtime = estime.ests.findOne({coursename: "ABC000"})
        .then((result)=>{
            return result.AHT;
        });

        await estime.updateAHT("ABC000", "1").then((x)=>{
            return estime.ests.findOne({coursename: "ABC000"});
        })
        .then((result)=>{
            expect(result.AHT).not.toBe(oldtime);
        });
    });

    test("calEST test", async()=>{
        await estime.calEST("CPEN433", "kevin").then((x)=>{
            expect(x).toBeDefined();
        });
    });


});
