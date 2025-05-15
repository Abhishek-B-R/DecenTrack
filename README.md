# 🚀 DecenTrack

**DecenTrack** is a fully decentralized uptime monitoring platform that leverages Ethereum smart contracts, validator-based reporting, and real-world browser checks to ensure accurate uptime data from across the globe. All uptime data and validator interactions are recorded immutably on the blockchain.

---

## 🧠 Features

- 🌐 **Decentralized Uptime Monitoring** — Validators check website availability from their browser and log results on-chain.
- 🔐 **Ethereum Smart Contracts** — Uptime data and validator interactions are stored trustlessly on Sepolia testnet.
- 💼 **Wallet Integration** — Users can interact via their Ethereum wallets using Web3Modal.
- 📈 **Validator Reward System** — Validators are incentivized based on uptime check submissions.
- 🪄 **Modern UI** — Built with Tailwind CSS and Shadcn components for beautiful and accessible interfaces.
- 🧑‍💻 **Secure Auth** — Clerk is used for role-based user authentication.

---

## 🏗️ Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Frontend**  | Next.js, React 19, Tailwind CSS, Shadcn/UI, Radix UI, Clerk |
| **Backend**   | Node.js, Express (for relayers or backend logic if used) |
| **Blockchain**| Ethereum, Sepolia Testnet, Solidity, Hardhat, Ethers.js |
| **WebSockets**| `ws` library for real-time communication between validators and the monitoring network |
| **Email & SMS**| Nodemailer and Twilio used for optional notifications |

---

## 🔧 Smart Contracts

- Written in **Solidity**
- Compiled and deployed using **Hardhat**
- Verified with **Hardhat Verify**
- Gas usage measured via **hardhat-gas-reporter**
- Type bindings generated using **TypeChain**
- Coverage measured using **solidity-coverage**

### Notable Smart Contract Functions:

- `registerWebsite(string url)`
- `removeWebsite(uint id)`
- `logUptime(uint id, uint latency, bool status)`
- `withdrawEarnings()`

---

## 🌐 Ethereum & Sepolia

- The project is deployed on the **Sepolia** testnet for development.
- Interactions use **Ethers.js v6** and **Hardhat Toolbox**.
- Supports validator registration and rewards distribution in ETH.

---

## 🖼️ UI & Components

### Frameworks & Libraries

- **Next.js 15.3.0**
- **React 19**
- **Tailwind CSS 4.1.4**
- **tailwindcss-animate** for animations
- **Web3Modal** for wallet integration
- **Lucide React** for clean and modern icons

### Authentication

- **@clerk/nextjs** for user sign-in, sign-up, and session management.

### UI Library: Shadcn + Radix UI

Fully customizable and accessible components using:

#### Shadcn Components Used:

- `alert-dialog.tsx`
- `alert.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `input.tsx`
- `label.tsx`
- `loading-spinner.tsx`
- `select.tsx`
- `skeleton.tsx`
- `table.tsx`
- `tooltip.tsx`

These components are styled with Tailwind, using `clsx` and `class-variance-authority` for conditional styles.

---

## 📦 Dependencies

### Runtime

- `@clerk/nextjs`, `next`, `react`, `tailwindcss`, `web3modal`, `ethers`, `twilio`, `nodemailer`, `ws`

### UI/Styling

- `@radix-ui/react-*`, `lucide-react`, `clsx`, `class-variance-authority`, `tailwind-merge`, `tailwindcss-animate`

### Type Safety and Utilities

- `@types/*` for TypeScript support across all used packages
- `typescript` v5+

---

## 🧪 Dev & Testing Tools

- **Hardhat Toolbox** for local blockchain development
- **TypeChain** for type-safe contract calls
- **dotenv** for managing environment variables
- **Chai** for contract test assertions
- **ESLint** for code quality
- **Solidity Coverage** for test coverage reporting

---

## 🔌 WebSocket Validator Integration

- Validators connect via WebSocket to listen for uptime check tasks.
- Upon receiving a task, they verify website status and respond with latency and result.
- Uses `ws` library for managing WebSocket connections.

---


## 🧩 Project Structure
```bash
/contracts        → Solidity smart contracts
/pages            → Next.js frontend routes
/components/ui    → Shadcn/Radix UI components
/context          → Wallet + Clerk Auth context
/scripts          → Hardhat deploy + command scripts
/validator        → Uptime checkers run as validators
/hub              → Manages validator pool + assignments
```

---

## ⚙️ Deployment

- Smart contracts deployed via **Hardhat** to **Sepolia**.
- Frontend hosted on **Vercel** or similar platforms.
- Environment variables managed securely using `.env` and `dotenv`.

---

## ✅ Getting Started

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/DecenTrack.git
cd DecenTrack
```

### 2. Use pnpm for package management. Make sure you have it installed globally:

```bash
npm install -g pnpm
pnpm install
```

### 3. Copy the example env file:
```bash
cp .env.example .env
```

## 🚀 Deployment (Sepolia)

### 1. Compile Contracts

```bash
pnpm hardhat compile
```

### 2. Deploy to Sepolia
```bash
pnpm hardhat run scripts/deploy.ts --network sepolia
```
⚠️ After deployment, update the deployed contract address in:   /context/contractAddress.ts

## 🔍 Hardhat Console
You can interact with your contract manually using the Hardhat console:
```bash
pnpm hardhat console --network sepolia
```
### For a list of pre-built commands, refer to:
```bash
scripts/allCommands.js
```

## 💻 Running the Full Project
Start all services (hub, validator, and Next.js site):
```bash
pnpm run startAll
```

Or to run the Next.js frontend alone:
```bash
pnpm dev
```

## 🧪 Testing & Development Tools

- Hardhat Toolbox for compiling, testing, and deploying.

- TypeChain for type-safe contract interaction.

- Solidity Coverage to monitor test coverage.

- hardhat-gas-reporter to track gas usage.


## 🙏 Acknowledgements

- Ethereum.org — Blockchain platform
- Sepolia Testnet — For smart contract testing
- Hardhat — Ethereum development environment
- Ethers.js — Interact with Ethereum
- Web3Modal — Wallet connector
- Clerk.dev — Authentication system
- Twilio — SMS Notifications
- Nodemailer — Email alerts
- Shadcn UI — UI components
- Radix UI — Headless UI primitives
- Tailwind CSS — Styling utility framework
- Vercel — Hosting platform for frontend

# ✨ Author
## Developed with ❤️ by Abhishek B R
