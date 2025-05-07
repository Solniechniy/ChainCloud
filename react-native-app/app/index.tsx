import { useSolanaWallet } from '@/context/SolanaWalletContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { connected } = useSolanaWallet();
  console.log('connected', connected);
  return connected ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}