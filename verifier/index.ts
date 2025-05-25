import { ethers } from "ethers";
import { createRequire } from 'module';
import dotenv from "dotenv"
dotenv.config()
if(!process.env.INFURA_KEY || !process.env.PRIVATE_KEY){
  throw new Error("Env file not configured correctly")
}

const require = createRequire(import.meta.url);
const tracking = require("../artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json");

// Setup provider (using Infura, Alchemy, or local node)
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/"+process.env.INFURA_KEY);
// Verify connection on startup
provider.getNetwork()
.then(network => console.log("Connected to network:", network.name))
.catch(err => console.error("Provider connection failed:", err));

// Setup contract instance
import ContractAddress from "../Context/contractAddress.ts";
import { sendLowBalanceEmail, sendWebsiteAlertEmail } from "./email.ts";
import { sendLowBalanceSMS, sendWebsiteDownSMS } from "./sms.ts";
const WebsiteMonitorABI=tracking.abi
const WebsiteMonitor = new ethers.Contract(ContractAddress, WebsiteMonitorABI , provider);

const tempWallet = new ethers.Wallet(process.env.PRIVATE_KEY+"", provider);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WebsiteMonitorSigned = WebsiteMonitor.connect(tempWallet) as any;

// set an interval of 15 mins
setInterval(async ()=>{
  try{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [websiteIds, websiteDetails]:[websiteIds:any[],websiteDetails:any[]] = await WebsiteMonitorSigned.getAllWebsites();
    websiteIds.forEach(async (websiteId,index)=>{
      const websiteTicks=await WebsiteMonitorSigned.getRecentTicks(websiteId,10)
      let downCount=0;
      websiteTicks.forEach((tick: { status: number; })=>{
        if(tick.status==1){
          downCount++;
        }
      })
      if(downCount>5){
        const contactInfo:string=websiteDetails[index][3]
        const allContacts=contactInfo.split(" ");
        allContacts.forEach((contact:string)=>{
          if(contact.includes("@")){
            sendWebsiteAlertEmail(contact,websiteDetails[index][0])
          }else{
            sendWebsiteDownSMS(contact,websiteDetails[index][0])
          }
        })
      }
    })


    websiteDetails.forEach((e)=>{
      // conversion is 1 => 10^18
      if(e[4]<Math.pow(10,14)){
        const contactInfo:string=e[3]
        const allContacts=contactInfo.split(" ");
        const balanceInStr=(e[4]/BigInt(Math.pow(10,18))).toString()
        allContacts.forEach((contact:string)=>{
          if(contact.includes("@")){
            sendLowBalanceEmail(contact,e[0],balanceInStr)
          }else{
            sendLowBalanceSMS(contact,e[0],balanceInStr)
          }
        })
      }
    })

  }catch(e){
    console.error(e);
  }

},300_000)