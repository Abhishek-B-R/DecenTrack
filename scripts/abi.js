const abiObj = [
  {
    "inputs": [{ "internalType": "string", "name": "_url", "type": "string" }],
    "name": "createWebsite",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "websiteId", "type": "bytes32" }],
    "name": "getWebsite",
    "outputs": [
      { "internalType": "string", "name": "url", "type": "string" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "bool", "name": "disabled", "type": "bool" },
      {
        "components": [
          { "internalType": "address", "name": "validator", "type": "address" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "enum WebsiteMonitor.WebsiteStatus", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "latency", "type": "uint256" }
        ],
        "internalType": "struct WebsiteMonitor.WebsiteTick[]",
        "name": "ticks",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyWebsites",
    "outputs": [{ "internalType": "bytes32[]", "name": "ids", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "websiteId", "type": "bytes32" }],
    "name": "deleteWebsite",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_publicKey", "type": "string" },
      { "internalType": "string", "name": "_location", "type": "string" }
    ],
    "name": "registerValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "websiteId", "type": "bytes32" },
      { "internalType": "enum WebsiteMonitor.WebsiteStatus", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "latency", "type": "uint256" }
    ],
    "name": "addTick",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllWebsites",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "url", "type": "string" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "bool", "name": "disabled", "type": "bool" },
          {
            "components": [
              { "internalType": "address", "name": "validator", "type": "address" },
              { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
              { "internalType": "enum WebsiteMonitor.WebsiteStatus", "name": "status", "type": "uint8" },
              { "internalType": "uint256", "name": "latency", "type": "uint256" }
            ],
            "internalType": "struct WebsiteMonitor.WebsiteTick[]",
            "name": "ticks",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct WebsiteMonitor.Website[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "websiteId", "type": "bytes32" }],
    "name": "getWebsiteTicks",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "validator", "type": "address" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "enum WebsiteMonitor.WebsiteStatus", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "latency", "type": "uint256" }
        ],
        "internalType": "struct WebsiteMonitor.WebsiteTick[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "websiteId", "type": "bytes32" },
      { "internalType": "uint256", "name": "n", "type": "uint256" }
    ],
    "name": "getRecentTicks",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "validator", "type": "address" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "enum WebsiteMonitor.WebsiteStatus", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "latency", "type": "uint256" }
        ],
        "internalType": "struct WebsiteMonitor.WebsiteTick[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyPayouts",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "websiteId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "WebsiteCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "websiteId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "WebsiteDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "websiteId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "validator", "type": "address" }
    ],
    "name": "TickAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "validator", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Payout",
    "type": "event"
  }
];


export default abiObj