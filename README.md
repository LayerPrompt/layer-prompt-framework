# LAYERPROMPT FRAMEWORK

This project provides utilities for fetching and interacting with market data on Ethereum, DexScreener APIs, and Uniswap V3. It supports querying market cap, top holders, trending tokens, and executing transactions.

## Features

- **Transaction Execution**: Send transactions for specific actions (e.g., pump, trade) to Solana pools.
- **Buy/Sell Tokens**: Execute buy and sell orders on Uniswap V3.
- **Fetch Token Data**: Retrieve detailed token data from DexScreener.
- **Get Wallet Balance**: Check the balance of a specified wallet.

---

### Prerequisites
- Node.js (>= 16.x)
- npm (or yarn) installed
- PRIVATE_KEY

---

## Dependencies

The project utilizes the following dependencies:

| Dependency         | Version  | Description                                                                 |
|--------------------|----------|-------------------------------------------------------------------------|
| `dotenv`             | ^16.4.7   | Load environment variables from a .env file.           |
| `node-fetch`           | ^3.3.2  | Lightweight HTTP client for making API requests.                            |
| `viem`          | ^2.22.13  | Ethereum client for interacting with the blockchain. |
| `ethers`        | ^6.13.5   | Library for interacting with the Ethereum blockchain. |

## Dev Dependencies

The project utilizes the following development dependencies:

| Dependency         | Version  | Purpose                                                                 |
|--------------------|----------|-------------------------------------------------------------------------|
| `typescript`          | ^5.7.3  | Strongly-typed JavaScript for scalable and reliable code.	                                      |
| `ts-node`   | ^10.9.2  | Execute TypeScript code without transpiling it first.                          | 
| `@types/node-fetch` | ^2.6.12  | Type definitions for node-fetch. |

---

Install dependencies with:
```bash
npm install
```

## 🤝 Contribution
We welcome contributions! To get started:

- Fork the repository.
- Create a new branch (feature/my-feature).
- Make your changes and commit them.
- Open a pull request.