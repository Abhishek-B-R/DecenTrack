/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from "react";
import Web3Modal from "web3modal";
import { BrowserProvider, Contract } from "ethers";

// INTERNAL IMPORT
import tracking from "../artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json";

const ContractAddress = "0xc5dFf6496D8a5Bf733C0c0408FbC7A16df951fd4";
const ContractABI = tracking.abi;

// Types
export interface MonitorContextType {
  currentUser: string;
  connectWallet: () => Promise<string | void>;
  createWebsite: (url: string) => Promise<void>;
  addTick: (websiteId: number, status: boolean, latency: number) => Promise<void>;
  getAllWebsites: () => Promise<any>;
  deleteWebsite: (websiteId: number) => Promise<void>;
  registerValidator: (publicKey: string, location: string) => Promise<void>;
  getWebsite: (websiteId: number) => Promise<any>;
  getRecentTicks: (websiteId: number, n?: number) => Promise<any>;
  getWebsiteTicks: (websiteId: number) => Promise<any>;
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
    } catch (error) {
      console.error("Failed to create website:", error);
    }
  };

  const addTick = async (websiteId: number, status: boolean, latency: number) => {
    try {
      const contract = await connectContract();
      const tx = await contract.addTick(websiteId, status, latency);
      await tx.wait();
      console.log("Tick added:", tx);
    } catch (error) {
      console.error("Failed to add tick:", error);
    }
  };

  const getAllWebsites = async () => {
    try {
      const contract = await connectContract();
      
      // Debug the raw call data
      const callData = contract.interface.encodeFunctionData("getAllWebsites");
      console.log("Call data:", callData);
      
      // Make a low-level call
      const provider = new BrowserProvider(window.ethereum);
      const rawResult = await provider.call({
        to: ContractAddress,
        data: callData
      });
      console.log("Raw result:", rawResult);
      
      // Try to decode manually
      if (rawResult === "0x") {
        throw new Error("Contract returned empty data (likely reverted)");
      }
      
      try {
        const decoded = contract.interface.decodeFunctionResult("getAllWebsites", rawResult);
        console.log("Decoded result:", decoded);
        return decoded;
      } catch (decodeError) {
        console.error("Decoding failed:", decodeError);
        throw new Error("ABI doesn't match contract implementation");
      }
      
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        data: error.data,
        stack: error.stack
      });
      throw error;
    }
  };
  

  const deleteWebsite = async (websiteId: number) => {
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

  const getWebsite = async (websiteId: number) => {
    try {
      const contract = await connectContract();
      return await contract.getWebsite(websiteId);
    } catch (error) {
      console.error("Failed to get website:", error);
    }
  };

  const getRecentTicks = async (websiteId: number, n: number = 10) => {
    try {
      const contract = await connectContract();
      return await contract.getRecentTicks(websiteId, n);
    } catch (error) {
      console.error("Failed to get recent ticks:", error);
    }
  };

  const getWebsiteTicks = async (websiteId: number) => {
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
