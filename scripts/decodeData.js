import { ethers } from "ethers";
import abiObj from "./abi.js"

// Replace with your Holesky RPC URL
const provider = new ethers.JsonRpcProvider(`https://holesky.infura.io/v3/e3ad463fa7fb4328b78b73944a5f0600`);

// Replace with your contract's ABI
const abi = abiObj

const iface = new ethers.Interface(abi);

// Replace with the transaction hash you want to decode
const txHash = "0xbf4ecc1f3f8020ab93cdfdda8073e3b1a937fd24fb48c05151316b35a1b31dad";

async function decodeTransaction() {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx || !tx.data) {
      console.log("Transaction not found or has no input data");
      return;
    }

    const parsed = iface.parseTransaction({ data: tx.data, value: tx.value });
    console.log("Function name:", parsed.name);
    console.log("Arguments:", parsed.args);
  } catch (error) {
    console.error("Error decoding transaction:", error);
  }
}

decodeTransaction();
