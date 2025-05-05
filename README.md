# ChainCloud

A distributed Solana RPC provider that leverages a network of devices to cache and serve account data.

## Project Structure

- **server**: Node.js WebSocket server for device coordination and RPC handling
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

## Getting Started

To start the server:

```bash
cd server
./start.sh
```

## License

MIT
