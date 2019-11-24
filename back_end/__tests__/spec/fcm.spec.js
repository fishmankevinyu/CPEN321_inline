const config = require("../../src/config.json");
jest.mock("firebase-admin"); 
var serviceAccount = require("../../src/fcm/privatekey.json"); //put the generated private key path here
var send2 = require("../../src/fcm/send2.js"); 

// jest.mock('firebase-admin', () => {
//     return {
//       messaging: jest.fn().mockReturnThis(),
//       subscribeToTopic: jest.fn()
//     };
//   });

  //var admin = require("firebase-admin"); 


describe("fcm", () =>{

    let adminStub, api;
         
         global.console = {
           log: jest.fn(),
           info: jest.fn(),
           error: jest.fn()
         }

    //admin.messaging = jest.fn(); 

        //admin.initializeApp = jest.fn(); 

    //     beforeAll(() => {
    //     admin.initializeApp({
    //         credential: admin.credential.cert(serviceAccount),
    //         databaseURL: "https://inline-f628d.firebaseio.com"
    //   });
    // })

        // adminStub = jest.spyOn(admin, "initializeApp");
        // });

         
    test("subscribe",async ()=>{
         const token = "1234";
         const topic = "xxx";

         let admin = {
            messaging: jest.fn(
                ()=>{
                    return {
                        subscribetotopic: jest.fn()
                    } 
                }
            )
        }

    // admin.messaging = jest.fn(()=>{return new Promise((resolve,reject)=>{
    //         resolve(0);
    //     });
    // });

    //      admin.messaging().subscribeToTopic = jest.fn(()=>{return new Promise((resolve,reject)=>{
    //         resolve(0);
    //     });
    // });
    //     admin.messaging().unsubscribeFromTopic = jest.fn(()=>{return new Promise((resolve,reject)=>{
    //         resolve(0);
    //     });
    // });

        await send2.subscribe(token,topic); 
        expect(admin.messaging().subscribeToTopic).toHaveBeenCalled();
         
         });
         
        //  test("unsubscribe", ()=>{

        //       token = "1234";
        //       topic = "xxx";
              
        //       const unsubscribe = {
        //          test(token, topic){
        //              send2.unsubscribe(token, topic);
        //          }
        //       };

        //      const spyTest = jest.spyOn(unsubscribe, 'test');
        //       unsubscribe.test(token, topic);


        //       expect(spyTest).toHaveBeenCalledWith(token, topic);
        //       expect(global.console.log).toHaveBeenCalledTimes(1);
              
        //       });

         
        //  test("sendNotification", ()=>{
        //       topic = "xxx";
              
        //       const send = {
        //          test(topic){
        //              send2.sendNotification(topic);
        //          }
        //       };

        //      const spyTest = jest.spyOn(send, 'test');
        //       send.test(topic);

        //       expect(spyTest).toHaveBeenCalledWith(topic);
        //       expect(global.console.log).toHaveBeenCalledTimes(1);
              
        //       });
         
        });
