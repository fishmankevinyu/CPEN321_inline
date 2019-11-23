const regToken = require("../../src/fcm/regToken");
const MongoClient = require("mongodb").MongoClient;

describe("regToken", ()=>{
    beforeAll(async (done)=>{
        regToken.client = await MongoClient.connect("mongodb://localhost:27017/Token", {useUnifiedTopology:true});
        regToken.db = await regToken.client.db("RegTokens");
        regToken.tokens = await regToken.db.collection("regTokens");
        done();
    })

    test("addToken", async (done)=>{
        await regToken.addToken("kevin", "i_am_test_token");
        await regToken.tokens.findOne({username: "kevin"}).then((result)=>{
            expect(result.token).toBe("i_am_test_token");
        });
        done();
    });

    test("getToken", async (done)=>{
        await regToken.addToken("kevin", "i_am_test_token");
        let token = await regToken.getToken("kevin");
        expect(token).toBe("i_am_test_token");
        done();
    });

    test("deleteToken", async (done)=>{
        await regToken.addToken("testbot","i_am_test_token");
        await regToken.deleteToken("testbot");
        await regToken.tokens.findOne({username: "testbot"}).then((result)=>{
            expect(result).toBe(null);
        })
        done();
    });

    afterAll(()=>{
        regToken.client.close();
    });
});