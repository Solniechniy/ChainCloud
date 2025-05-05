import { Repository } from "typeorm";
import { Device } from "../entities/Device";
import { DataBlock } from "../entities/DataBlock";
import { AppDataSource } from "../config/database";
import {
  BlockAssignment,
  ConnectedDevice,
  MessageType,
  WebSocketMessage,
} from "../interfaces";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

const REWARD_AMOUNT = parseFloat(process.env.REWARD_AMOUNT || "0.000001");

export class DeviceService {
  private deviceRepository: Repository<Device>;
  private dataBlockRepository: Repository<DataBlock>;
  private connectedDevices: Map<string, ConnectedDevice> = new Map();

  constructor() {
    this.deviceRepository = AppDataSource.getRepository(Device);
    this.dataBlockRepository = AppDataSource.getRepository(DataBlock);
  }

  /**
   * Handle new device connection
   */
  public async registerDevice(
    ws: WebSocket,
    publicKey: string
  ): Promise<string> {
    try {
      // Find or create the device
      let device = await this.deviceRepository.findOne({
        where: { publicKey },
      });

      if (!device) {
        device = new Device();
        device.publicKey = publicKey;
        device.isOnline = true;
        device.lastSeen = new Date();
        await this.deviceRepository.save(device);
      } else {
        // Update the device status
        device.isOnline = true;
        device.lastSeen = new Date();
        await this.deviceRepository.save(device);
      }

      // Assign a data block if not already assigned
      if (!device.dataBlockIndex) {
        const blockAssignment = await this.assignDataBlock();
        device.dataBlockIndex = blockAssignment.blockIndex;
        await this.deviceRepository.save(device);

        // Send the block assignment to the device
        this.sendMessage(ws, {
          type: MessageType.ASSIGNED_BLOCK,
          payload: blockAssignment,
        });
      }

      // Add to connected devices
      this.connectedDevices.set(device.id, {
        ws,
        publicKey,
        deviceId: device.id,
        dataBlockIndex: device.dataBlockIndex,
        isReady: false,
        lastPing: Date.now(),
      });

      return device.id;
    } catch (error) {
      console.error("Error registering device:", error);
      throw error;
    }
  }

  /**
   * Assign a data block to a device
   */
  private async assignDataBlock(): Promise<BlockAssignment> {
    try {
      // Get all data blocks
      const allBlocks = await this.dataBlockRepository.find();

      // If no blocks exist yet, create initial blocks
      if (allBlocks.length === 0) {
        const totalBlocks = 10; // Start with 10 blocks

        for (let i = 0; i < totalBlocks; i++) {
          const newBlock = new DataBlock();
          newBlock.blockIndex = i;
          newBlock.description = `Initial data block ${i}`;
          await this.dataBlockRepository.save(newBlock);
        }

        // Return the first block
        return { blockIndex: 0, description: "Initial data block 0" };
      }

      // Find blocks with fewer devices (less popular)
      const devices = await this.deviceRepository.find();
      const blockUsage = new Map<number, number>();

      // Count how many devices have each block
      devices.forEach((device) => {
        if (
          device.dataBlockIndex !== null &&
          device.dataBlockIndex !== undefined
        ) {
          const count = blockUsage.get(device.dataBlockIndex) || 0;
          blockUsage.set(device.dataBlockIndex, count + 1);
        }
      });

      // Find the least used block
      let leastUsedBlock = allBlocks[0];
      let leastUsageCount = blockUsage.get(leastUsedBlock.blockIndex) || 0;

      for (const block of allBlocks) {
        const usageCount = blockUsage.get(block.blockIndex) || 0;
        if (usageCount < leastUsageCount) {
          leastUsedBlock = block;
          leastUsageCount = usageCount;
        }
      }

      return {
        blockIndex: leastUsedBlock.blockIndex,
        description:
          leastUsedBlock.description ||
          `Data block ${leastUsedBlock.blockIndex}`,
      };
    } catch (error) {
      console.error("Error assigning data block:", error);
      // Default to block 0 if there's an error
      return { blockIndex: 0 };
    }
  }

  /**
   * Handle device disconnection
   */
  public async handleDisconnect(deviceId: string): Promise<void> {
    try {
      // Get the device
      const device = await this.deviceRepository.findOne({
        where: { id: deviceId },
      });

      if (device) {
        // Update the device status
        device.isOnline = false;
        device.lastSeen = new Date();
        await this.deviceRepository.save(device);
      }

      // Remove from connected devices
      this.connectedDevices.delete(deviceId);
    } catch (error) {
      console.error(`Error handling disconnect for device ${deviceId}:`, error);
    }
  }

  /**
   * Get devices for a specific block
   */
  public getDevicesForBlock(blockIndex: number): ConnectedDevice[] {
    const devices: ConnectedDevice[] = [];

    this.connectedDevices.forEach((device) => {
      if (device.dataBlockIndex === blockIndex && device.isReady) {
        devices.push(device);
      }
    });

    return devices;
  }

  /**
   * Update device reward
   */
  public async updateDeviceReward(deviceId: string): Promise<void> {
    try {
      const device = await this.deviceRepository.findOne({
        where: { id: deviceId },
      });

      if (device) {
        device.providedResponses++;
        device.rewardEarned += REWARD_AMOUNT;
        await this.deviceRepository.save(device);
      }
    } catch (error) {
      console.error(`Error updating reward for device ${deviceId}:`, error);
    }
  }

  /**
   * Mark device as ready after sync
   */
  public markDeviceReady(deviceId: string): void {
    const device = this.connectedDevices.get(deviceId);

    if (device) {
      device.isReady = true;
      this.connectedDevices.set(deviceId, device);
    }
  }

  /**
   * Send WebSocket message to a device
   */
  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Get all connected devices
   */
  public getAllConnectedDevices(): Map<string, ConnectedDevice> {
    return this.connectedDevices;
  }

  /**
   * Update device ping time
   */
  public updateDevicePing(deviceId: string): void {
    const device = this.connectedDevices.get(deviceId);

    if (device) {
      device.lastPing = Date.now();
      this.connectedDevices.set(deviceId, device);
    }
  }
}
