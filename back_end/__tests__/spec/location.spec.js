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

describe("defaultNewLocation unit testing", ()=>{
    test("add new location of Macloead Building", async (done)=>{
        let req = mock.mockRequest({address: "Macloed Building, Vancouver, BC", coursename: "CPEN433"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.defaultNewLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test("add null location", async (done)=>{
        let req = mock.mockRequest({address: null, coursename: "CPEN433"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.defaultNewLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test("add null coursename", async (done)=>{
        let req = mock.mockRequest({address: "Macloed Building, Vancouver, BC", coursename: null});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.defaultNewLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });
});

describe("chooseLocation", ()=>{
    test("search Macloed", async (done)=>{
        let req = mock.mockRequest({address: "Macloed"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.chooseLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });
    test("search null", async (done)=>{
        let req = mock.mockRequest({address: null});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.chooseLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });
});

describe("getLocation", ()=>{
    test("get CPEN433", async (done)=>{
        let req = {params:
            {
                coursename: "CPEN433"
            }
        };
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.getLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test("get null", async (done)=>{
        let req = {params:
            {
                coursename: null
            }
        };
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.getLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    })
});

describe("updateLocation", ()=>{
    test("update CPEN433", async (done)=>{
        let req = mock.mockRequest({coursename: "CPEN433", address: "Kaiser building, Vancouver, BC"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.updateLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test("update null address", async (done)=>{
        let req = mock.mockRequest({coursename: "CPEN433", address: null});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.updateLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test("update null course", async (done)=>{
        let req = mock.mockRequest({coursename: null, address: null});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.updateLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test("update non-existed course", async(done)=>{
        let req = mock.mockRequest({coursename: "NEXT123", address: "Kaiser building, Vancouver, BC"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.updateLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        done();
    });
});

describe("deleteLocation",()=>{
    test("delete TEST123", async (done)=>{
        location.locations.insertOne({coursename: "TEST123", lat: 123, lng: 321});
        let req = mock.mockRequest({coursename: "TEST123"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.deleteLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        done();
    });

    test("delete null", async (done)=>{
        let req = mock.mockRequest({coursename: null});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.deleteLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        done();
    });

    test("delete non-existed", async (done)=>{
        let req = mock.mockRequest({coursename: "DUMB123"});
        let res = mock.mockResponse();
        let next = jest.fn();
        await location.deleteLocation(req,res,next);
        expect(res.json).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        done();
    })
});