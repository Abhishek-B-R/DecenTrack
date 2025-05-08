//npx hardhat compile
//npx hardhat run scripts/deploy.js --network holesky
// Inside `npx hardhat console --network holesky`
const contractAddress = "0x081c3Aab6BDA63AB61bf52d656d05e78D23D449f";
const WebsiteMonitor = await ethers.getContractAt("WebsiteMonitor", contractAddress);

// Register a validator
await WebsiteMonitor.registerValidator("0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De", "Hubli");
console.log("Validator registered.");

// Create a website
const tx = await WebsiteMonitor.createWebsite("https://googler.com");
const receipt = await tx.wait();

// Parse logs for website id
const event =await receipt.logs.map(log => WebsiteMonitor.interface.parseLog(log)).find(e => e.name === "WebsiteCreated");

const websiteId = event.args.websiteId;
console.log("Website ID:", websiteId);


// Add a tick (0 = Good, 1 = Bad, 2 = Unknown)
await WebsiteMonitor.addTick(mySites[2], 1, 120); // status = Good, latency = 120ms
console.log("Tick added.");

// Get your websites
const mySites = await WebsiteMonitor.getMyWebsites();
console.log("Your websites:", mySites);

// Get full website details
const data = await WebsiteMonitor.getWebsite(mySites[2]);

console.log("URL:", data[0]);
console.log("Owner:", data[1]);
console.log("Disabled:", data[2]);

console.log("Ticks:");
data[3].forEach(tick => {
  console.log(`- Validator: ${tick[0]}, Time: ${tick[1]}, Status: ${tick[2]==0?"Good":"Bad"}, Latency: ${tick[3]}`);
});

// Delete a website
await WebsiteMonitor.deleteWebsite(websiteId);
console.log("Website deleted.");

//Get all websites registered till now
const websites = await WebsiteMonitor.getAllWebsites();
console.log(websites)

//Get all the website ticks for particular website
const ticks = await WebsiteMonitor.getWebsiteTicks(mySites[0]);
ticks.forEach(tick => {
  console.log(`Validator: ${tick.validator}, Time: ${tick.createdAt}, Status: ${tick.status}, Latency: ${tick.latency}`);
});

//Get the recent ticks only for particular website
const n = 5;
const recentTicks = await WebsiteMonitor.getRecentTicks(mySites[0], n);
recentTicks.forEach(tick => {
  console.log(`Validator: ${tick.validator}, Time: ${tick.createdAt}, Status: ${tick.status}, Latency: ${tick.latency}`);
});

//Pay pending payouts to validator
(async ()=>{
    const payout = await WebsiteMonitor.myPendingPayout();
    console.log(payout)
    if (payout && payout > 0) {
        try {
        const tx = await WebsiteMonitor.getMyPayouts();
        await tx.wait();
        console.log("Payout claimed successfully!");
        } catch (err) {
        console.error("Payout claim failed:", err.message);
        }
    } else {
        console.log("No payouts available.");
    }
})()



// check the balance of smart-contract
const balance = await ethers.provider.getBalance(contractAddress);
console.log("Contract balance:", ethers.formatEther(balance));

//add some balance to smart-contract
const signer = await ethers.getSigner(); 
await signer.sendTransaction({
  to: contractAddress,
  value: ethers.parseEther("0.05") 
});


// check if the given address is valid or not
import { ethers } from "ethers";
const isValid = ethers.utils.isAddress("0x123...");
console.log("Valid address:", isValid);