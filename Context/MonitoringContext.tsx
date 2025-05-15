/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode } from "react";
import Web3Modal from "web3modal";
import { BrowserProvider, Contract, parseEther } from "ethers";

// INTERNAL IMPORT
import tracking from "@/artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json";
import { createWebsiteError, createWebsiteSuccess } from "./interfaces";

import ContractAddress from "./contractAddress";
const ContractABI = tracking.abi;

interface TickInput {
  websiteId: string;
  status: number;
  latency: number;
}

// Types
export interface MonitorContextType {
  currentUser: string;
  connectWallet: () => Promise<string | void>;
  createWebsite: (url: string, contactInfo: string) => Promise<createWebsiteSuccess | createWebsiteError>;
  addTick: (websiteId: string, status: number, latency: number) => Promise<any>;
  addMultipleTicks: (ticks: TickInput[]) => Promise<any>;
  getAllWebsites: () => Promise<any>;
  deleteWebsite: (websiteId: string) => Promise<any>;
  registerValidator: (publicKey: string, location: string) => Promise<any>;
  getWebsite: (websiteId: string) => Promise<any>;
  isValidatorAuthenticated: (address: string) => Promise<boolean>;
  getValidator: (address: string) => Promise<any>;
  getRecentTicks: (websiteId: string, n?: number) => Promise<any>;
  getWebsiteTicks: (websiteId: string) => Promise<any>;
  getMyWebsites: () => Promise<any>;
  myPendingPayout: () => Promise<any>;
  getMyPayouts: () => Promise<any>;
  addWebsiteBalance: (websiteId: string, amount: string) => Promise<any>;
  getWebsiteBalance: (websiteId: string) => Promise<any>;
}

export const MonitorContext = createContext<MonitorContextType | null>(null);

export const MonitorProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentUser(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return;
    }
  };

  const connectContract = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();
    return new Contract(ContractAddress, ContractABI, signer);
  };

  const createWebsite = async (url: string, contactInfo: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.createWebsite(url, contactInfo);
      const receipt = await tx.wait();
      return { status: "Success", response: receipt };
    } catch (error: unknown) {
      return { status: "Error", response: error };
    }
  };

  const addTick = async (websiteId: string, status: number, latency: number) => {
    try {
      const contract = await connectContract();
      const tx = await contract.addTick(websiteId, status, latency);
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const addMultipleTicks = async (ticks: TickInput[]) => {
    try {
      const contract = await connectContract();
      const tx = await contract.addMultipleTicks(ticks);
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getAllWebsites = async () => {
    try {
      const contract = await connectContract();
      const websites = await contract.getAllWebsites();
      return websites
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.deleteWebsite(websiteId);
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const registerValidator = async (publicKey: string, location: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.registerValidator(publicKey, location);
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getWebsite = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      const result = await contract.getWebsite(websiteId);
      return { status: "Success", data: result };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const isValidatorAuthenticated = async (address: string) => {
    try {
      const contract = await connectContract();
      const result = await contract.isValidatorAuthenticated(address);
      return result;
    } catch (error) {
      console.error("Check validator auth failed", error);
      return false;
    }
  };

  const getValidator = async (address: string) => {
    try {
      const contract = await connectContract();
      const result = await contract.getValidator(address);
      return { status: "Success", data: result };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getRecentTicks = async (websiteId: string, n = 10) => {
    try {
      const contract = await connectContract();
      const result = await contract.getRecentTicks(websiteId, n);
      return { status: "Success", data: result };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getWebsiteTicks = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      const result = await contract.getWebsiteTicks(websiteId);
      return { status: "Success", data: result };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getMyWebsites = async () => {
    try {
      const contract = await connectContract();
      const result = await contract.getMyWebsites();
      return { status: "Success", data: result };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const myPendingPayout = async () => {
    try {
      const contract = await connectContract();
      const result = await contract.myPendingPayout();
      return { status: "Success", data: result.toString() };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getMyPayouts = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract.getMyPayouts();
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const addWebsiteBalance = async (websiteId: string, amount: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract.addWebsiteBalance(websiteId, { value: parseEther(amount).toString() });
      const receipt = await tx.wait();
      return { status: "Success", txHash: receipt.hash };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  const getWebsiteBalance = async (websiteId: string) => {
    try {
      const contract = await connectContract();
      const balance = await contract.getWebsiteBalance(websiteId);
      return { status: "Success", data: balance.toString() };
    } catch (error) {
      return { status: "Error", error };
    }
  };

  return (
    <MonitorContext.Provider
      value={{
        currentUser,
        connectWallet,
        createWebsite,
        addTick,
        addMultipleTicks,
        getAllWebsites,
        deleteWebsite,
        registerValidator,
        getWebsite,
        isValidatorAuthenticated,
        getValidator,
        getRecentTicks,
        getWebsiteTicks,
        getMyWebsites,
        myPendingPayout,
        getMyPayouts,
        addWebsiteBalance,
        getWebsiteBalance
      }}
    >
      {children}
    </MonitorContext.Provider>
  );
};