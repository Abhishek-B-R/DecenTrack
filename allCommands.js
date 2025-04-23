// Inside `npx hardhat console --network holesky`
const contractAddress = "0xC1e7514B433E2CFbc3311DaAfeb6b358cC2c794f";
const WebsiteMonitor = await ethers.getContractAt("WebsiteMonitor", contractAddress);

// Register a validator
await WebsiteMonitor.registerValidator("0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De", "Hubli");

// Create a website
const tx = await WebsiteMonitor.createWebsite("https://google.com");
const receipt = await tx.wait();
console.log(receipt.events);

const websiteId = receipt.events[0].args[0]; // WebsiteCreated(bytes32 indexed websiteId)
console.log("Website ID:", websiteId);

// Add a tick (0 = Good, 1 = Bad)
await WebsiteMonitor.addTick(websiteId, 0, 120); // status = Good, latency = 120ms

// Get your websites
const mySites = await WebsiteMonitor.getMyWebsites();
console.log("Your websites:", mySites);

// Get full website details
const data = await WebsiteMonitor.getWebsite(mySites[0]);
console.log("Website Data:", data);

// Delete a website
await WebsiteMonitor.deleteWebsite(websiteId);
console.log("Website deleted.");

import { ethers } from "ethers";
const isValid = ethers.utils.isAddress("0x123...");
console.log("Valid address:", isValid);


import { ethers } from "ethers";

const abi = [
  "function createWebsite(string _url)",
  "function addTick(bytes32 websiteId, uint8 status, uint256 latency)"
];

const iface = new ethers.utils.Interface(abi);
const txData = "0x..."; // your transaction input
const decoded = iface.decodeFunctionData("createWebsite", txData);
console.log("Decoded Data:", decoded);
