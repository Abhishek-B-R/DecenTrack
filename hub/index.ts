import { WebSocketServer, WebSocket } from "ws";
import { ethers } from "ethers";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tracking = require("../artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json");

const wss = new WebSocketServer({ port: 8080 });

// Setup provider (using Infura, Alchemy, or local node)
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/9e7169916c0a4ac1a4ae6f97cf122da4");

// Verify connection on startup
provider.getNetwork()
  .then(network => console.log("Connected to network:", network.name))
  .catch(err => console.error("Provider connection failed:", err));

// Setup contract instance
import ContractAddress from "../Context/contractAddress.ts";
const WebsiteMonitorABI=tracking.abi
const WebsiteMonitor = new ethers.Contract(ContractAddress, WebsiteMonitorABI, provider);

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

// Broadcast website data every 3 seconds
setInterval(async () => {
  try {
    const [websiteIds, websiteDetails] = await WebsiteMonitor.getAllWebsites();

    console.log(websiteDetails)
    console.log(websiteIds)
    const payload = JSON.stringify({
      type: "websiteUpdate",
      data: websiteDetails
    });

    allSocket.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    });
  } catch (e) {
    console.error("Error fetching website data:", e);
  }
}, 3000);
