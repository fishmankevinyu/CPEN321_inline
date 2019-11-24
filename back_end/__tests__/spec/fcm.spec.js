const config = require("../../src/config.json");
// jest.mock("firebase-admin"); 
const topic = require("../../src/fcm/send2.js"); 
var admin = require("firebase-admin");
var serviceAccount = require("../../src/fcm/privatekey.json");  //put the generated private key path here

console.log = jest.fn(); 

describe("fcm", () =>{

    beforeAll(async () => {
        //admin.initializeApp = jest.fn(); 
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://inline-f628d.firebaseio.com"
      });
      }); 

    test("subscribe",async ()=>{

        
         const tokenTemp = "1234";
         const topicTemp = "xxx";

        await topic.subscribe(tokenTemp,topicTemp); 
        expect(console.log).toHaveBeenCalledTimes(3);
         
         });

         test("unsubscribe",async ()=>{
            const tokenTemp = "1234";
            const topicTemp = "xxx";
   
           await topic.unsubscribe(tokenTemp,topicTemp); 
           expect(console.log).toHaveBeenCalledTimes(6);
            
            });

            test("sendNotification",async ()=>{
                const tokenTemp = "1234";
                const topicTemp = "xxx";
       
               await topic.sendNotification(topicTemp); 
               expect(console.log).toHaveBeenCalledTimes(7);
                
                });
   

         
        });
