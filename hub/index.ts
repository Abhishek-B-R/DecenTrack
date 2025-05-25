import { WebSocketServer, WebSocket } from "ws";
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
import ContractAddress from "../context/contractAddress.ts";
const WebsiteMonitorABI=tracking.abi
const WebsiteMonitor = new ethers.Contract(ContractAddress, WebsiteMonitorABI , provider);

const wss = new WebSocketServer({ port: 8080 });
let allSocket: WebSocket[] = [];

wss.on("connection", (socket: WebSocket) => {
  allSocket.push(socket);

  socket.on("close", () => {
    allSocket = allSocket.filter(s => s !== socket);
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});


const tempWallet = new ethers.Wallet(process.env.PRIVATE_KEY+"", provider);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WebsiteMonitorSigned = WebsiteMonitor.connect(tempWallet) as any;

// Broadcast website data every 3 seconds
setInterval(async () => {
  try {
    const [websiteIds, websiteDetails] = await WebsiteMonitorSigned.getAllWebsites();
    
    const websiteDetailsUpdated = websiteDetails.map((e:[string,string,boolean,[],string]) => e[0]);
    const finalData = websiteDetailsUpdated.map((url:string, i:number) => ({
      id: websiteIds[i].toString(),
      url
    }));

    const payload = JSON.stringify({
      type: "websiteUpdate",
      data:finalData
    }, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    // console.log(payload)
    
    allSocket.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    });
  } catch (e) {
    console.error("Error fetching website data:", e);
  }
}, 300_000);