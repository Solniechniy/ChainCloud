import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnection } from "./WalletConnection";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { connected } = useWallet();

  if (!connected) {
    return <WalletConnection />;
  }

  return <>{children}</>;
}; 