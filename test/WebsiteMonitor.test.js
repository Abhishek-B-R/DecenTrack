// test/WebsiteMonitor.test.js
import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("WebsiteMonitor", function () {
  it("should deploy and create a website", async function () {
    const [owner] = await ethers.getSigners();
    const WebsiteMonitor = await ethers.getContractFactory("WebsiteMonitor");
    const contract = await WebsiteMonitor.deploy();
    await contract.waitForDeployment();

    const url = "https://example.com";
    const tx = await contract.createWebsite(url);
    await tx.wait();

    const ids = await contract.getMyWebsites();
    const id = ids[0];

    const website = await contract.getWebsite(id);
    expect(website.url).to.equal(url);
    expect(website.owner).to.equal(owner.address);
    expect(website.disabled).to.equal(false);
  });
});
