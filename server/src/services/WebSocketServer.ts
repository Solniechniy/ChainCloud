import { WebSocketServer as WSServer, WebSocket } from "ws";
import { DeviceService } from "./DeviceService";
import { SolanaService } from "./SolanaService";
import {
  MessageType,
  WebSocketMessage,
  DeviceDataResponse,
  SolanaRpcRequest,
} from "../interfaces";
import { cacheData } from "../config/redis";
import dotenv from "dotenv";

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT || "8080");
const PING_INTERVAL = 30000; // 30 seconds
const CONNECTION_TIMEOUT = 60000; // 60 seconds

export class WebSocketServer {
  private wss: WSServer;
  private deviceService: DeviceService;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(deviceService: DeviceService) {
    this.deviceService = deviceService;
    this.wss = new WSServer({ port: WS_PORT });

    console.log(`WebSocket server is running on port ${WS_PORT}`);

    this.setupWebSocketServer();
    this.startPingInterval();
  }

  private setupWebSocketServer(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("New connection established");

      ws.on("message", async (message: string) => {
        try {
          const parsedMessage = JSON.parse(message) as WebSocketMessage;
          await this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error("Error handling message:", error);
          this.sendErrorMessage(ws, "Invalid message format");
        }
      });

      ws.on("close", () => {
        // Find device ID for this connection and mark as disconnected
        const devices = this.deviceService.getAllConnectedDevices();

        for (const [deviceId, device] of devices.entries()) {
          if (device.ws === ws) {
            this.deviceService.handleDisconnect(deviceId);
            console.log(`Device ${deviceId} disconnected`);
            break;
          }
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  private async handleMessage(
    ws: WebSocket,
    message: WebSocketMessage
  ): Promise<void> {
    switch (message.type) {
      case MessageType.REGISTER:
        await this.handleRegister(ws, message.payload);
        break;

      case MessageType.SYNC_COMPLETE:
        await this.handleSyncComplete(ws, message.payload);
        break;

      case MessageType.ACCOUNT_RESPONSE:
        await this.handleAccountResponse(ws, message.payload);
        break;

      case MessageType.PONG:
        await this.handlePong(ws, message.payload);
        break;

      default:
        this.sendErrorMessage(ws, `Unknown message type: ${message.type}`);
    }
  }

  private async handleRegister(ws: WebSocket, payload: any): Promise<void> {
    try {
      if (!payload.publicKey) {
        return this.sendErrorMessage(ws, "Public key is required");
      }

      const deviceId = await this.deviceService.registerDevice(
        ws,
        payload.publicKey
      );

      this.sendMessage(ws, {
        type: MessageType.REGISTER,
        payload: { deviceId },
      });

      console.log(`Device registered with ID ${deviceId}`);
    } catch (error) {
      console.error("Error registering device:", error);
      this.sendErrorMessage(ws, "Error registering device");
    }
  }

  private async handleSyncComplete(ws: WebSocket, payload: any): Promise<void> {
    try {
      if (!payload.deviceId || !payload.dataHash || !payload.blockTimestamp) {
        return this.sendErrorMessage(
          ws,
          "Missing required fields for sync completion"
        );
      }

      // Mark the device as ready to receive requests
      this.deviceService.markDeviceReady(payload.deviceId);

      console.log(
        `Device ${payload.deviceId} completed sync with hash ${payload.dataHash}`
      );
    } catch (error) {
      console.error("Error handling sync complete:", error);
      this.sendErrorMessage(ws, "Error processing sync completion");
    }
  }

  private async handleAccountResponse(
    ws: WebSocket,
    payload: DeviceDataResponse
  ): Promise<void> {
    try {
      if (
        !payload.publicKey ||
        !payload.dataHash ||
        !payload.lastBlockTimestamp ||
        !payload.accountInfo
      ) {
        return this.sendErrorMessage(
          ws,
          "Missing required fields for account response"
        );
      }

      // Check if the data is fresh
      const isFresh = await SolanaService.isDataFresh(
        payload.lastBlockTimestamp
      );

      if (!isFresh) {
        console.log(
          `Received outdated data from ${payload.publicKey}, skipping`
        );
        return;
      }

      // Find the device ID
      let deviceId: string | undefined;
      const devices = this.deviceService.getAllConnectedDevices();

      for (const [id, device] of devices.entries()) {
        if (device.publicKey === payload.publicKey) {
          deviceId = id;
          break;
        }
      }

      if (deviceId) {
        // Update device reward
        await this.deviceService.updateDeviceReward(deviceId);

        // Cache the response
        const accountAddress = payload.accountInfo.owner; // Using owner as the identifier
        const cacheKey = `account:${accountAddress}:base58`;

        const responseData = {
          jsonrpc: "2.0",
          id: 1,
          result: {
            context: {
              apiVersion: "1.0.0",
              slot: payload.lastBlockTimestamp,
            },
            value: payload.accountInfo,
          },
        };

        await cacheData(cacheKey, responseData, 60); // Cache for 60 seconds

        console.log(`Cached account data from device ${deviceId}`);
      }
    } catch (error) {
      console.error("Error handling account response:", error);
    }
  }

  private async handlePong(ws: WebSocket, payload: any): Promise<void> {
    try {
      if (!payload.deviceId) {
        return;
      }

      // Update device's last ping time
      this.deviceService.updateDevicePing(payload.deviceId);
    } catch (error) {
      console.error("Error handling pong:", error);
    }
  }

  /**
   * Request account info from devices that hold the data
   */
  public async requestAccountInfo(request: SolanaRpcRequest): Promise<void> {
    try {
      const accountAddress = request.params[0] as string;

      // Determine which block this account belongs to
      const blockIndex = this.getBlockIndexForAccount(accountAddress);

      // Get devices that have this block
      const devices = this.deviceService.getDevicesForBlock(blockIndex);

      if (devices.length === 0) {
        console.log(`No devices available for block ${blockIndex}`);
        return;
      }

      // Send request to all ready devices for this block
      devices.forEach((device) => {
        this.sendMessage(device.ws, {
          type: MessageType.ACCOUNT_REQUEST,
          payload: {
            requestId: request.id,
            accountAddress,
            encoding: request.params[1]?.encoding || "base58",
          },
        });
      });

      console.log(
        `Sent account request to ${devices.length} devices for account ${accountAddress}`
      );
    } catch (error) {
      console.error("Error requesting account info:", error);
    }
  }

  /**
   * Send WebSocket message
   */
  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send error message
   */
  private sendErrorMessage(ws: WebSocket, errorMessage: string): void {
    this.sendMessage(ws, {
      type: MessageType.REGISTER,
      payload: { error: errorMessage },
    });
  }

  /**
   * Start ping interval to check connection status
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      const devices = this.deviceService.getAllConnectedDevices();
      const now = Date.now();

      devices.forEach((device, deviceId) => {
        // Check if device connection timed out
        if (now - device.lastPing > CONNECTION_TIMEOUT) {
          console.log(`Device ${deviceId} timed out, disconnecting`);
          this.deviceService.handleDisconnect(deviceId);
          if (device.ws.readyState === WebSocket.OPEN) {
            device.ws.terminate();
          }
          return;
        }

        // Send ping message
        this.sendMessage(device.ws, {
          type: MessageType.PING,
          payload: { timestamp: now },
        });
      });
    }, PING_INTERVAL);
  }

  /**
   * Determine which block an account belongs to
   * Simple hash function for now - can be improved later
   */
  private getBlockIndexForAccount(accountAddress: string): number {
    // Simple hashing - take the sum of character codes and mod by 10
    let sum = 0;
    for (let i = 0; i < accountAddress.length; i++) {
      sum += accountAddress.charCodeAt(i);
    }
    return sum % 10; // Assuming 10 blocks for now
  }

  /**
   * Stop the WebSocket server
   */
  public stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.wss.close(() => {
      console.log("WebSocket server stopped");
    });
  }
}
