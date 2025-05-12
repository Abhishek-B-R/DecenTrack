import dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-toolbox";

// const RPC_ENDPOINTS = [
//   `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
//   "https://eth.llamarpc.com",
//   "https://rpc.ankr.com/eth",
//   "https://cloudflare-eth.com"
// ];
// Simulate and use all to avoid rate-limiting
// or use wss connection to wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID

const config = {
  solidity: {
    version: "0.8.28"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    holesky: {
      url: "https://holesky.infura.io/v3/" + process.env.INFURA_KEY,
      accounts: [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY
        : "0x" + process.env.PRIVATE_KEY]
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_KEY,
      accounts: [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY
        : "0x" + process.env.PRIVATE_KEY]
    },
    hoodi: {
      url: "https://hoodi.infura.io/v3/" + process.env.INFURA_KEY,
      accounts: [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY
        : "0x" + process.env.PRIVATE_KEY]
    }
  }
};

export default config;
