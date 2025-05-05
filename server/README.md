# ChainCloud Server

A distributed Solana RPC provider that leverages a network of devices to cache and serve account data.

## Features

- WebSocket server for device connections
- HTTP API for Solana RPC requests
- Device registration and data block assignment
- Distributed data caching system
- Reward system for data providers
- Fallback to traditional RPC when needed

## Architecture

The server consists of:

1. **WebSocket Server**: Handles device connections, registration, and data requests
2. **HTTP API**: Acts as a Solana RPC proxy, distributing requests to connected devices
3. **Device Management**: Tracks connected devices and their assigned data blocks
4. **Cache System**: Uses Redis to cache responses for fast retrieval
5. **Database**: MySQL database for persistent storage of device information

## Getting Started

### Prerequisites

- Node.js 16+
- Docker and Docker Compose
- MySQL
- Redis

### Installation

1. Clone the repository
2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Edit the `.env` file with your configuration
4. Build and start the containers:

```bash
docker-compose up -d
```

### Development

To run the server in development mode:

```bash
npm install
npm run dev
```

## API Endpoints

### Solana RPC Endpoint

```
POST /rpc
```

Accepts standard Solana JSON-RPC requests. Currently supports:

- `getAccountInfo`

### Stats Endpoint

```
GET /stats
```

Returns statistics about connected devices and the system.

## WebSocket Protocol

Devices connect via WebSocket and communicate using a message-based protocol:

1. **Registration**: Device sends public key to register
2. **Block Assignment**: Server assigns a data block to the device
3. **Data Sync**: Device downloads and syncs the assigned data block
4. **Account Requests**: Server requests specific account info as needed

## License

[MIT](LICENSE)
