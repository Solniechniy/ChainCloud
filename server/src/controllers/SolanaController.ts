import { Request, Response } from "express";
import { SolanaService } from "../services/SolanaService";
import { WebSocketServer } from "../services/WebSocketServer";
import { SolanaRpcRequest } from "../interfaces";
import { getCachedData } from "../config/redis";

export class SolanaController {
  private wsServer: WebSocketServer;

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  /**
   * Handle Solana RPC requests
   */
  public async handleRpcRequest(req: Request, res: Response): Promise<void> {
    try {
      const request = req.body as SolanaRpcRequest;

      // Only support getAccountInfo for now
      if (request.method !== "getAccountInfo") {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32601,
            message: "Method not supported",
          },
          id: request.id,
        });
        return;
      }

      // Check if we have this in cache
      const accountAddress = request.params[0] as string;
      const encoding = request.params[1]?.encoding || "base58";
      const cacheKey = `account:${accountAddress}:${encoding}`;

      const cachedData = await getCachedData(cacheKey);

      if (cachedData) {
        // Return from cache
        res.json(cachedData);
        return;
      }

      // Request data from connected devices
      this.wsServer.requestAccountInfo(request);

      // If no device response within 2 seconds, fall back to direct RPC
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(async () => {
          // Check cache again in case a device responded
          const updatedCache = await getCachedData(cacheKey);

          if (updatedCache) {
            res.json(updatedCache);
          } else {
            // Fall back to direct Solana RPC
            const response = await SolanaService.getAccountInfo(
              accountAddress,
              encoding
            );
            res.json(response);
          }
          resolve();
        }, 2000); // 2 second timeout
      });

      // Wait for the timeout to complete
      await timeoutPromise;
    } catch (error) {
      console.error("Error handling RPC request:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
        },
        id: req.body.id || null,
      });
    }
  }

  /**
   * Get device statistics
   */
  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      // Number of connected devices, etc.
      const devices = await new SolanaService().getCurrentBlockHeight();

      res.json({
        connectedDevices: devices,
        blockHeight: await SolanaService.getCurrentBlockHeight(),
      });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
