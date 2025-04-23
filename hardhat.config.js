import dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-toolbox";

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
    }
  }
};

export default config;
