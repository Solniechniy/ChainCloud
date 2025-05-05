# ChainCloud

A distributed Solana RPC provider that leverages a network of devices to cache and serve account data.

## Project Structure

- **server**: Node.js WebSocket server for device coordination and RPC handling
- **smartcontracts**: Solana smart contracts for reward distribution
- **react-native-app**: Mobile application for data providers
- **landing**: Marketing website

## Server Component

The server is a Node.js application built with Express and TypeScript, providing both a WebSocket server for device connections and an HTTP API for Solana RPC requests.

### Features

- WebSocket server for device connections
- Device registration with public key
- Data block assignment and partitioning
- Reward system for data providers
- Fast response with Redis caching
- Fallback to traditional RPC providers when needed

### Technology Stack

- TypeScript
- Express.js
- WebSocket (ws)
- TypeORM with MySQL
- Redis for caching
- Docker for containerization

For more details, see the [server README](server/README.md).

## Smart Contract Component

The smart contract component provides on-chain reward distribution for storage providers in the ChainCloud network.

### Features

- SPL token-based rewards
- Admin role for managing rewards
- Storage provider registration
- Reward claiming mechanism

### Technology Stack

- Solana blockchain
- Anchor framework
- Rust
- TypeScript (for testing)

For more details, see the [smart contracts README](smartcontracts/README.md).

## Getting Started

To start the server:

```bash
cd server
./start.sh
```

To build and test the smart contracts:

```bash
cd smartcontracts
yarn install
anchor build
anchor test
```

## License

MIT
