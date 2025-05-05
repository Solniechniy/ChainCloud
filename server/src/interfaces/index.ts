import { WebSocket } from "ws";

export interface ConnectedDevice {
  ws: WebSocket;
  publicKey: string;
  deviceId?: string;
  dataBlockIndex?: number;
  isReady: boolean;
  lastPing: number;
}

export interface AccountInfo {
  data: [string, string];
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
}

export interface SolanaAccountResponse {
  jsonrpc: string;
  result: {
    context: {
      apiVersion: string;
      slot: number;
    };
    value: AccountInfo | null;
  };
  id: number | string;
}

export interface SolanaRpcRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params: any[];
}

export interface DeviceDataResponse {
  publicKey: string;
  dataHash: string;
  lastBlockTimestamp: number;
  accountInfo: AccountInfo;
}

export interface BlockAssignment {
  blockIndex: number;
  description?: string;
}

export interface RegisterDeviceRequest {
  publicKey: string;
}

export interface RegisterDeviceResponse {
  deviceId: string;
  blockAssignment: BlockAssignment;
}

// WebSocket message types
export enum MessageType {
  REGISTER = "REGISTER",
  ASSIGNED_BLOCK = "ASSIGNED_BLOCK",
  ACCOUNT_REQUEST = "ACCOUNT_REQUEST",
  ACCOUNT_RESPONSE = "ACCOUNT_RESPONSE",
  SYNC_REQUEST = "SYNC_REQUEST",
  SYNC_COMPLETE = "SYNC_COMPLETE",
  PING = "PING",
  PONG = "PONG",
}

export interface WebSocketMessage {
  type: MessageType;
  payload: any;
}

export interface ErrorResponse {
  error: string;
  code?: number;
}
