// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { createContext, useState, ReactNode } from "react";
// import Web3Modal from "web3modal";
// import { BrowserProvider, Contract, parseEther } from "ethers";

// // INTERNAL IMPORT
// import tracking from "@/artifacts/contracts/WebsiteMonitor.sol/WebsiteMonitor.json";
// import { createWebsiteError, createWebsiteSuccess } from "./interfaces";

// import ContractAddress from "./contractAddress";
// const ContractABI = tracking.abi;

// interface TickInput {
//   websiteId: string;
//   status: number;
//   latency: number;
// }

// // Types
// export interface MonitorContextType {
//   currentUser: string;
//   connectWallet: () => Promise<string | void>;
//   createWebsite: (url: string, contactInfo: string) => Promise<createWebsiteSuccess | createWebsiteError>;
//   addTick: (websiteId: string, status: number, latency: number) => Promise<any>;
//   addMultipleTicks: (ticks: TickInput[]) => Promise<any>;
//   getAllWebsites: () => Promise<any>;
//   deleteWebsite: (websiteId: string) => Promise<any>;
//   registerValidator: (publicKey: string, location: string) => Promise<any>;
//   getWebsite: (websiteId: string) => Promise<any>;
//   isValidatorAuthenticated: (address: string) => Promise<boolean>;
//   getValidator: (address: string) => Promise<any>;
//   getRecentTicks: (websiteId: string, n?: number) => Promise<any>;
//   getWebsiteTicks: (websiteId: string) => Promise<any>;
//   getMyWebsites: () => Promise<any>;
//   myPendingPayout: () => Promise<any>;
//   getMyPayouts: () => Promise<any>;
//   addWebsiteBalance: (websiteId: string, amount: string) => Promise<any>;
//   getWebsiteBalance: (websiteId: string) => Promise<any>;
// }

// export const MonitorContext = createContext<MonitorContextType | null>(null);

// export const MonitorProvider = ({ children }: { children: ReactNode }) => {
//   const [currentUser, setCurrentUser] = useState<string>("");

//   const connectWallet = async () => {
//     try {
//       if (!window.ethereum) throw new Error("Install MetaMask");
//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       setCurrentUser(accounts[0]);
//       return accounts[0];
//     } catch (error) {
//       console.error("Wallet connection failed:", error);
//       return;
//     }
//   };

//   const connectContract = async () => {
//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new BrowserProvider(connection);
//     const signer = await provider.getSigner();
//     return new Contract(ContractAddress, ContractABI, signer);
//   };

//   const createWebsite = async (url: string, contactInfo: string) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.createWebsite(url, contactInfo);
//       const receipt = await tx.wait();
//       return { status: "Success", response: receipt };
//     } catch (error: unknown) {
//       return { status: "Error", response: error };
//     }
//   };

//   const addTick = async (websiteId: string, status: number, latency: number) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.addTick(websiteId, status, latency);
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const addMultipleTicks = async (ticks: TickInput[]) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.addMultipleTicks(ticks);
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getAllWebsites = async () => {
//     try {
//       const contract = await connectContract();
//       const websites = await contract.getAllWebsites();
//       return websites
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const deleteWebsite = async (websiteId: string) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.deleteWebsite(websiteId);
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const registerValidator = async (publicKey: string, location: string) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.registerValidator(publicKey, location);
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getWebsite = async (websiteId: string) => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.getWebsite(websiteId);
//       return { status: "Success", data: result };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const isValidatorAuthenticated = async (address: string) => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.isValidatorAuthenticated(address);
//       return result;
//     } catch (error) {
//       console.error("Check validator auth failed", error);
//       return false;
//     }
//   };

//   const getValidator = async (address: string) => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.getValidator(address);
//       return { status: "Success", data: result };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getRecentTicks = async (websiteId: string, n = 10) => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.getRecentTicks(websiteId, n);
//       return { status: "Success", data: result };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getWebsiteTicks = async (websiteId: string) => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.getWebsiteTicks(websiteId);
//       return { status: "Success", data: result };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getMyWebsites = async () => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.getMyWebsites();
//       return { status: "Success", data: result };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const myPendingPayout = async () => {
//     try {
//       const contract = await connectContract();
//       const result = await contract.myPendingPayout();
//       return { status: "Success", data: result.toString() };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getMyPayouts = async () => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.getMyPayouts();
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const addWebsiteBalance = async (websiteId: string, amount: string) => {
//     try {
//       const contract = await connectContract();
//       const tx = await contract.addWebsiteBalance(websiteId, { value: parseEther(amount).toString() });
//       const receipt = await tx.wait();
//       return { status: "Success", txHash: receipt.hash };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   const getWebsiteBalance = async (websiteId: string) => {
//     try {
//       const contract = await connectContract();
//       const balance = await contract.getWebsiteBalance(websiteId);
//       return { status: "Success", data: balance.toString() };
//     } catch (error) {
//       return { status: "Error", error };
//     }
//   };

//   return (
//     <MonitorContext.Provider
//       value={{
//         currentUser,
//         connectWallet,
//         createWebsite,
//         addTick,
//         addMultipleTicks,
//         getAllWebsites,
//         deleteWebsite,
//         registerValidator,
//         getWebsite,
//         isValidatorAuthenticated,
//         getValidator,
//         getRecentTicks,
//         getWebsiteTicks,
//         getMyWebsites,
//         myPendingPayout,
//         getMyPayouts,
//         addWebsiteBalance,
//         getWebsiteBalance
//       }}
//     >
//       {children}
//     </MonitorContext.Provider>
//   );
// };

// context/MonitorContext.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode } from "react";

const SIM_BASE_URL = process.env.NEXT_PUBLIC_SIM_BASE_URL || process.env.SIM_BASE_URL || "http://localhost:8000";

interface TickInput {
  websiteId: string;
  status: number;
  latency: number;
}

export interface MonitorContextType {
  currentUser: string;
  connectWallet: () => Promise<string | void>;
  createWebsite: (url: string, contactInfo: string) => Promise<any>;
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
    // Keep MetaMask connect to reuse address for identity
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!window.ethereum) throw new Error("Install MetaMask");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentUser(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return;
    }
  };

  const createWebsite = async (url: string, contactInfo: string) => {
    const r = await fetch(`${SIM_BASE_URL}/website/create?owner=${currentUser || "0xowner"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, contactInfo }),
    });
    return r.json();
  };

  const addTick = async (websiteId: string, status: number, latency: number) => {
    const r = await fetch(`${SIM_BASE_URL}/tx/addTick?validator=${currentUser || "0xvalidator"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId, status, latency }),
    });
    return r.json();
  };

  const addMultipleTicks = async (ticks: TickInput[]) => {
    const r = await fetch(`${SIM_BASE_URL}/tx/addMultipleTicks?validator=${currentUser || "0xvalidator"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ticks }),
    });
    return r.json();
  };

  const getAllWebsites = async () => {
    const r = await fetch(`${SIM_BASE_URL}/websites`);
    const res = await r.json();
    return res.websites || [];   // return array directly
  };

  const deleteWebsite = async (websiteId: string) => {
    const r = await fetch(`${SIM_BASE_URL}/website/${websiteId}`, { method: "DELETE" });
    return r.json();
  };

  const registerValidator = async (publicKey: string, location: string) => {
    const r = await fetch(`${SIM_BASE_URL}/validator/register?address=${currentUser || "0xvalidator"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, location }),
    });
    return r.json();
  };

  const getWebsite = async (websiteId: string) => {
    const r = await fetch(`${SIM_BASE_URL}/website/${websiteId}`);
    return r.json();
  };

  const isValidatorAuthenticated = async (address: string) => {
    const r = await fetch(`${SIM_BASE_URL}/validator/${address}/authenticated`);
    return r.json();
  };

  const getValidator = async (address: string) => {
    const r = await fetch(`${SIM_BASE_URL}/validator/${address}`);
    return r.json();
  };

  const getRecentTicks = async (websiteId: string, n = 10) => {
    const r = await fetch(`${SIM_BASE_URL}/ticks/${websiteId}?n=${n}`);
    return r.json();
  };

  const getWebsiteTicks = async (websiteId: string) => {
    const r = await fetch(`${SIM_BASE_URL}/ticks/${websiteId}/all`);
    return r.json();
  };

  const getMyWebsites = async () => {
    const r = await fetch(`${SIM_BASE_URL}/me/websites?owner=${currentUser || "0xowner"}`);
    const res = await r.json();
    return res.data || [];       // return array directly
  };

  const myPendingPayout = async () => {
    const r = await fetch(`${SIM_BASE_URL}/me/pendingPayout?owner=${currentUser || "0xowner"}`);
    return r.json();
  };

  const getMyPayouts = async () => {
    const r = await fetch(`${SIM_BASE_URL}/me/payouts?owner=${currentUser || "0xowner"}`, { method: "POST" });
    return r.json();
  };

  const addWebsiteBalance = async (websiteId: string, amount: string) => {
    const r = await fetch(`${SIM_BASE_URL}/website/${websiteId}/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    return r.json();
  };

  const getWebsiteBalance = async (websiteId: string) => {
    const r = await fetch(`${SIM_BASE_URL}/website/${websiteId}/balance`);
    return r.json();
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
        getWebsiteBalance,
      }}
    >
      {children}
    </MonitorContext.Provider>
  );
};