import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { SolanaController } from "./controllers/SolanaController";
import { WebSocketServer } from "./services/WebSocketServer";
import { DeviceService } from "./services/DeviceService";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000");

export class App {
  private app: Application;
  private solanaController: SolanaController;
  private wsServer: WebSocketServer;

  constructor() {
    this.app = express();
    this.setupMiddleware();

    // Initialize services
    const deviceService = new DeviceService();
    this.wsServer = new WebSocketServer(deviceService);
    this.solanaController = new SolanaController(this.wsServer);

    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Solana RPC endpoint
    this.app.post(
      "/rpc",
      this.solanaController.handleRpcRequest.bind(this.solanaController)
    );

    // Stats endpoint
    this.app.get(
      "/stats",
      this.solanaController.getStats.bind(this.solanaController)
    );

    // Health check
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // Not found handler
    this.app.use((req, res) => {
      res.status(404).json({ error: "Not found" });
    });
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
    });
  }

  public stop(): void {
    // Cleanup
    this.wsServer.stop();
  }
}
