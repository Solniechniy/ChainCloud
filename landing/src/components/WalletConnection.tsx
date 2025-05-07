import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletConnection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8">
          Please connect your Solana wallet to access the dashboard
        </p>
        <WalletMultiButton style={{ backgroundColor: "#e64a29", color: "white" }} />
      </div>
    </div>
  );
}; 