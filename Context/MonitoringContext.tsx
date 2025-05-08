/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from "react";
import Web3Modal from "web3modal";
import { BrowserProvider, Contract,TransactionResponse } from "ethers";

// INTERNAL IMPORT
import tracking from "../artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json";

const ContractAddress = "0x081c3Aab6BDA63AB61bf52d656d05e78D23D449f";
const ContractABI = tracking.abi;

// Types
export interface MonitorContextType {
  currentUser: string;
  connectWallet: () => Promise<string | void>;
  createWebsite: (url: string) => Promise<TransactionResponse>;
  addTick: (websiteId: string, status: boolean, latency: number) => Promise<void>;
  getAllWebsites: () => Promise<any>;
  deleteWebsite: (websiteId: string) => Promise<void>;
  registerValidator: (publicKey: string, location: string) => Promise<void>;
  getWebsite: (websiteId: string) => Promise<any>;
  getRecentTicks: (websiteId: string, n?: number) => Promise<any>;
  getWebsiteTicks: (websiteId: string) => Promise<any>;
  getMyWebsites: () => Promise<any>;
  myPendingPayout: () => Promise<any>;
  getMyPayouts: () => Promise<void>;
}

export const MonitorContext = createContext<MonitorContextType | null>(null);

export const MonitorProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>("");

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentUser(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Helper: Connect and get contract instance
  const connectContract = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();
    return new Contract(ContractAddress, ContractABI, signer);
  };

  const createWebsite = async (url: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.createWebsite(url);
      await tx.wait();
      console.log("Website created:", tx);
      return tx
    } catch (error) {
      console.error("Failed to create website:", error);
    }
  };

  const addTick = async (websiteId: string, status: boolean, latency: number) => {
    try {
      const contract = await connectContract();
      const tx = await contract.addTick(websiteId, status?0:1, latency);
      await tx.wait();
      console.log("Tick added:", tx);
    } catch (error) {
      console.error("Failed to add tick:", error);
    }
  };

  const getAllWebsites = async () => {
    try {
      const contract = await connectContract();
      return await contract.getAllWebsites();
    } catch (error) {
      console.error("Failed to get my websites:", error);
    }
  };
  

  const deleteWebsite = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.deleteWebsite(websiteId);
      await tx.wait();
      console.log("Website deleted:", tx);
    } catch (error) {
      console.error("Failed to delete website:", error);
    }
  };

  const registerValidator = async (publicKey: string, location: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.registerValidator(publicKey, location);
      await tx.wait();
      console.log("Validator registered:", tx);
    } catch (error) {
      console.error("Failed to register validator:", error);
    }
  };

  const getWebsite = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      return await contract.getWebsite(websiteId);
    } catch (error) {
      console.error("Failed to get website:", error);
    }
  };

  const getRecentTicks = async (websiteId: string, n: number = 10) => {
    try {
      const contract = await connectContract();
      return await contract.getRecentTicks(websiteId, n);
    } catch (error) {
      console.error("Failed to get recent ticks:", error);
    }
  };

  const getWebsiteTicks = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      return await contract.getWebsiteTicks(websiteId);
    } catch (error) {
      console.error("Failed to get website ticks:", error);
    }
  };

  const getMyWebsites = async () => {
    try {
      const contract = await connectContract();
      return await contract.getMyWebsites();
    } catch (error) {
      console.error("Failed to get my websites:", error);
    }
  };

  const myPendingPayout = async () => {
    try {
      const contract = await connectContract();
      return await contract.myPendingPayout();
    } catch (error) {
      console.error("Failed to get pending payout:", error);
    }
  };

  const getMyPayouts = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract.getMyPayouts();
      await tx.wait();
      console.log("Payout claimed:", tx);
    } catch (error) {
      console.error("Failed to claim payouts:", error);
    }
  };

  return (
    <MonitorContext.Provider
      value={{
        currentUser,
        connectWallet,
        createWebsite,
        addTick,
        getAllWebsites,
        deleteWebsite,
        registerValidator,
        getWebsite,
        getRecentTicks,
        getWebsiteTicks,
        getMyWebsites,
        myPendingPayout,
        getMyPayouts,
      }}
    >
      {children}
    </MonitorContext.Provider>
  );
};

// Optional helper for easier use
export const useMonitor = () => {
  const context = useContext(MonitorContext);
  if (!context) throw new Error("useMonitor must be used within a MonitorProvider");
  return context;
};
