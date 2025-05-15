//npx hardhat compile
//npx hardhat run scripts/deploy.js --network holesky
// Inside `npx hardhat console --network holesky`
const contractAddress = "0x2f1F85A7f952f68fA28aF78B428698eB9113980F";
const WebsiteMonitor = await ethers.getContractAt("WebsiteMonitor", contractAddress);

// Register a validator
await WebsiteMonitor.registerValidator("0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De", "Hubli");
console.log("Validator registered.");

// check if validator is authenticated or not
const isRegistered = await WebsiteMonitor.isValidatorAuthenticated("0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De");
console.log("Is validator authenticated?", isRegistered);

// get all the validator details
const validatorDetails=await WebsiteMonitor.getValidator('0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De')
validatorDetails[2]=validatorDetails[2]/100000000000000000n
console.log(validatorDetails)

// Create a website
const tx = await WebsiteMonitor.createWebsite("https://googler.com","abhishekbr989@gmail.com");
const receipt = await tx.wait();

// Parse logs for website id
const event =await receipt.logs.map(log => WebsiteMonitor.interface.parseLog(log)).find(e => e.name === "WebsiteCreated");

const websiteId = event.args.websiteId;
console.log("Website ID:", websiteId);


// Add a tick (0 = Good, 1 = Bad, 2 = Unknown)
await WebsiteMonitor.addTick(mySites[0], 1, 120); // status = Good, latency = 120ms
console.log("Tick added.");

// Get your websites
const mySites = await WebsiteMonitor.getMyWebsites();
console.log("Your websites:", mySites);

// Get full website details
const data = await WebsiteMonitor.getWebsite(mySites[0]);

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
const [websiteIds, websiteDetails] = await WebsiteMonitor.getAllWebsites();
websiteIds.forEach((id, i) => {
  const site = websiteDetails[i];
  console.log(`ID: ${id}`);
  console.log(`  URL: ${site.url}`);
  console.log(`  Contact: ${site.contactInfo}`);
  console.log(`  Owner: ${site.owner}`);
  console.log(`  Disabled: ${site.disabled}`);
  console.log(`  Balance: ${ethers.formatEther(site.currentBalance)} ETH`);
});


//Get all the website ticks for particular website
const ticks = await WebsiteMonitor.getWebsiteTicks(mySites[0]);
ticks.forEach(tick => {
  console.log(`Validator: ${tick.validator}, Time: ${tick.createdAt}, Status: ${tick.status}, Latency: ${tick.latency}`);
});

//Get the recent ticks only for particular website
const n = 5;
const recentTicks = await WebsiteMonitor.getRecentTicks(mySites[0], n);
recentTicks.forEach(tick => {
  console.log(`Validator: ${tick.validator}, Time: ${tick.createdAt}, Status: ${tick.status}, Latency: ${tick.latency}, Location: ${tick.location}`);
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

// add balance to website
const amountInEth = "0.01"; // Change as needed
await WebsiteMonitor.addWebsiteBalance(websiteId, { value: ethers.parseEther(amountInEth) });
console.log(`Added ${amountInEth} ETH to website balance.`);

// get balance of the website
const websiteBalance = await WebsiteMonitor.getWebsiteBalance(websiteId);
console.log(`Website Balance: ${ethers.formatEther(websiteBalance)} ETH`);
