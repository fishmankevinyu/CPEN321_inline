const config = require("../src/config.json");
var admin = require("firebase-admin");
var serviceAccount = require("../src/fcm/privatekey.json"); //put the generated private key path here
const {MongoClient} = require('mongodb');
var send2 = require("../src/fcm/send2.js")

const mockRequest = (data) =>{
    return data;
};


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}


describe("fcm", () =>{
         
         global.console = {
           log: jest.fn(),
           info: jest.fn(),
           error: jest.fn()
         }

         beforeAll(() => {
                   
        admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: "https://inline-f628d.firebaseio.com"
        });
        });

         
    test("subscribe", ()=>{

         token = "1234";
         topic = "xxx";
         
         const subscribe = {
            test(token, topic){
                send2.subscribe(token, topic);
            },
         
         adminSubscribe(token, topic){
            admin.messaging().subscribeToTopic(token, topic);
         }
         };

        const spyTest = jest.spyOn(subscribe, 'test');
         subscribe.test(token, topic);
         
         const spy = jest.spyOn(subscribe, 'adminSubscribe');
         //subscribe.adminSubscribe(token, topic);

         expect(spyTest).toHaveBeenCalledWith(token, topic);
         expect(global.console.log).toHaveBeenCalledTimes(1);
         
         });
         
         test("unsubscribe", ()=>{

              token = "1234";
              topic = "xxx";
              
              const unsubscribe = {
                 test(token, topic){
                     send2.unsubscribe(token, topic);
                 }
              };

             const spyTest = jest.spyOn(unsubscribe, 'test');
              unsubscribe.test(token, topic);


              expect(spyTest).toHaveBeenCalledWith(token, topic);
              expect(global.console.log).toHaveBeenCalledTimes(1);
              
              });

         
         test("sendNotification", ()=>{
              topic = "xxx";
              
              const send = {
                 test(topic){
                     send2.sendNotification(topic);
                 }
              };

             const spyTest = jest.spyOn(send, 'test');
              send.test(topic);

              expect(spyTest).toHaveBeenCalledWith(topic);
              expect(global.console.log).toHaveBeenCalledTimes(1);
              
              });
         
});

