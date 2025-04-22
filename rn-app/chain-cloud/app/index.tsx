import { Redirect } from 'expo-router';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';

export default function Index() {
  const { connected } = useSolanaWallet();
  return connected ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
} 