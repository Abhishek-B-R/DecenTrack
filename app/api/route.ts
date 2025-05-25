import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { createRequire } from 'module';
import dotenv from "dotenv"
dotenv.config()
if(!process.env.INFURA_KEY || !process.env.PRIVATE_KEY){
  throw new Error("Env file not configured correctly")
}

const require = createRequire(import.meta.url);
const tracking = require("@/artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json");

// Setup provider (using Infura, Alchemy, or local node)
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/"+process.env.INFURA_KEY);
// Verify connection on startup
provider.getNetwork()
.then(network => console.log("Connected to network:", network.name))
.catch(err => console.error("Provider connection failed:", err));

// Setup contract instance
import ContractAddress from "@/context/contractAddress";
const WebsiteMonitorABI=tracking.abi
const WebsiteMonitor = new ethers.Contract(ContractAddress, WebsiteMonitorABI , provider);

interface RequestType{
    url:string,
    websiteId:string,
    status:number,
    latency:number
}


const tempWallet = new ethers.Wallet(process.env.PRIVATE_KEY+"", provider);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WebsiteMonitorSigned = WebsiteMonitor.connect(tempWallet) as any;

export async function POST(request: NextRequest){
    const body:{data:RequestType[]}=await request.json()
    console.log(body)
    
    let response;
    try{
        response=await WebsiteMonitorSigned.addMultipleTicks(body)
    }catch(e){
        return NextResponse.json({
            error:e
        })
    }
    console.log(response)
    return NextResponse.json({
        msg:"added ticks successfully",
    })
}