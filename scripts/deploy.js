// scripts/deploy.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const WebsiteMonitor = await ethers.getContractFactory("WebsiteMonitor");
  const contract = await WebsiteMonitor.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
