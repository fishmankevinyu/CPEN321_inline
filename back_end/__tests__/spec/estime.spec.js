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
        estime.client = await MongoClient.connect("mongodb://localhost:27017/Est",{
            useUnifiedTopology:true
        });
        estime.db = await estime.client.db("ESTs");
        estime.ests = await estime.db.collection("ests");
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

    test("newCourseTime test", async (done) =>{

        await estime.newCourseTime("ABC000","1").then((x)=>{
            estime.ests.findOne({coursename: "ABC000"}).then((x)=>{
                expect(x.coursename).toBe("ABC000");
            });
        });

        await estime.ests.findOneAndDelete({
            coursename: "ABC000"
        });
        done();

    });

    test("updateAHT test", async (done)=>{
        estime.ests.insertOne({
            coursename: "update_aht",
            AHT: 2,
            count: 1,
            AA: 1
          })

        var oldtime = estime.ests.findOne({coursename: "update_aht"})
        .then((result)=>{
            return result.AHT;
        });

        await estime.updateAHT("update_aht", "4").then((x)=>{
            return estime.ests.findOne({coursename: "update_aht"});
        })
        .then((result)=>{
            expect(result.AHT).toBe(3);
        });

        await estime.ests.findOneAndDelete({
            coursename: "update_aht"
        });
        done();
    });

    test("calEST test", async()=>{
        await estime.calEST("CPEN433", "kevin").then((x)=>{
            expect(x).toBeDefined();
        });
    });


});
