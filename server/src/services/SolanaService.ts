import axios from "axios";
import { SolanaAccountResponse, SolanaRpcRequest } from "../interfaces";
import { cacheData, getCachedData } from "../config/redis";
import dotenv from "dotenv";

dotenv.config();

const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const CACHE_EXPIRATION = 60; // 60 seconds

export class SolanaService {
  /**
   * Get account info from Solana directly
   */
  static async getAccountInfo(
    accountAddress: string,
    encoding = "base58"
  ): Promise<SolanaAccountResponse> {
    const cacheKey = `account:${accountAddress}:${encoding}`;

    // Try to get from cache first
    const cachedData = await getCachedData<SolanaAccountResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, call Solana API
    const request: SolanaRpcRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [
        accountAddress,
        {
          encoding,
        },
      ],
    };

    try {
      const response = await axios.post<SolanaAccountResponse>(
        SOLANA_RPC_URL,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000, // 5 seconds timeout
        }
      );

      // Cache the response
      await cacheData(cacheKey, response.data, CACHE_EXPIRATION);

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching account info for ${accountAddress}:`,
        error
      );

      // Return an error response
      return {
        jsonrpc: "2.0",
        result: {
          context: {
            apiVersion: "0.0.0",
            slot: 0,
          },
          value: null,
        },
        id: 1,
      };
    }
  }

  /**
   * Get the current Solana block height
   */
  static async getCurrentBlockHeight(): Promise<number> {
    const request: SolanaRpcRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "getSlot",
      params: [],
    };

    try {
      const response = await axios.post(SOLANA_RPC_URL, request, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      return response.data.result;
    } catch (error) {
      console.error("Error fetching current block height:", error);
      throw error;
    }
  }

  /**
   * Check if data is considered fresh (within 50 seconds of current block time)
   */
  static async isDataFresh(lastBlockTimestamp: number): Promise<boolean> {
    try {
      const currentBlockHeight = await this.getCurrentBlockHeight();

      // Check if data is within 50 blocks (approximately 50 seconds on Solana)
      return currentBlockHeight - lastBlockTimestamp < 50;
    } catch (error) {
      console.error("Error checking data freshness:", error);
      return false;
    }
  }
}
