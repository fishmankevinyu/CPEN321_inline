const MongoClient = require("mongodb").MongoClient;
const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyAt1l6XIypmIj9ABKX5SI09x76Y9FCYU4k",
    Promise: Promise
});
const mock = require("../../__mocks__/mock_api_request");
const location = require("../../src/location/location");

beforeAll(async()=>{
    location.client = await MongoClient.connect("mongodb://localhost:27017/locations",{useUnifiedTopology:true});
    location.locations = await location.client.db("Locations").collection("locations");
});

afterAll(async ()=>{
    await location.client.close();
});

describe("Integration location service", ()=>{
    test( "create -> get -> update -> destroy", async(done) =>{
        let req = mock.mockRequest({address: "Macloed Building, Vancouver, BC", coursename: "INTEG333"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.defaultNewLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);

        let req2 = {params:{coursename: "INTEG333"}};

        await location.getLocation(req2,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);

        let req3 = mock.mockRequest({coursename: "INTEG333", address: "Kaiser building, Vancouver, BC"});
        await location.updateLocation(req3,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);

        let req4 = mock.mockRequest({coursename: "INTEG333"});
        await location.deleteLocation(req4,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);

        done();
    });
});