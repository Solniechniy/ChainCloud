import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey, Connection, Transaction, clusterApiUrl } from '@solana/web3.js';
import * as Linking from 'expo-linking';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
import { buildUrl } from '@/utils/buildUrl';
import { decryptPayload } from '@/utils/decryptPayload';
import { encryptPayload } from '@/utils/encryptPayload';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';

global.Buffer = global.Buffer || Buffer;

const onConnectRedirectLink = Linking.createURL('onConnect');
const onDisconnectRedirectLink = Linking.createURL('onDisconnect');
const onSignAndSendTransactionRedirectLink = Linking.createURL('onSignAndSendTransaction');

interface SolanaWalletContextProps {
  connection: Connection;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  submitting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction) => Promise<void>;
}

const SolanaWalletContext = createContext<SolanaWalletContextProps | null>(null);

export const useSolanaWallet = () => {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
};

interface SolanaWalletProviderProps {
  children: ReactNode;
  appUrl: string;
  cluster?: 'mainnet-beta' | 'testnet' | 'devnet';
}

export const SolanaWalletProvider: React.FC<SolanaWalletProviderProps> = ({
  children,
  appUrl,
  cluster = 'devnet',
}) => {
  console.log();
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [dappKeyPair] = useState(() => {
    const randomBytes = Crypto.getRandomBytes(32);
    return nacl.box.keyPair.fromSecretKey(randomBytes);
  });
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
  const [session, setSession] = useState<string>();
  const [deepLink, setDeepLink] = useState<string>('');
  
  const connection = new Connection(clusterApiUrl(cluster));

  // Initialize deeplinks and setup listeners
  useEffect(() => {
    const initializeDeeplinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    };
    initializeDeeplinks();
    const listener = Linking.addEventListener('url', handleDeepLink);
    return () => {
      listener.remove();
    };
  }, []);

  // Handle deep link events
  const handleDeepLink = ({ url }: Linking.EventType) => {
    setDeepLink(url);
  };

  // Process incoming deep links
  useEffect(() => {
    setSubmitting(false);
    if (!deepLink) return;

    const url = new URL(deepLink);
    const params = url.searchParams;

    // Handle errors
    if (params.get('errorCode')) {
      const error = Object.fromEntries([...params]);
      const message = error?.errorMessage ?? JSON.stringify(Object.fromEntries([...params]), null, 2);
      console.log('Error from Phantom:', message);
      setConnecting(false);
      return;
    }

    // Handle connect response
    if (/onConnect/.test(url.pathname)) {
      try {
        const sharedSecretDapp = nacl.box.before(
          bs58.decode(params.get('phantom_encryption_public_key')!),
          dappKeyPair.secretKey
        );
        const connectData = decryptPayload(
          params.get('data')!,
          params.get('nonce')!,
          sharedSecretDapp
        );
        setSharedSecret(sharedSecretDapp);
        setSession(connectData.session);
        setPublicKey(new PublicKey(connectData.public_key));
        setConnected(true);
        router.replace('/');
        console.log(`Connected to ${connectData.public_key.toString()}`);
      } catch (error) {
        console.error('Connection error:', error);
      }
      setConnecting(false);
    }

    // Handle disconnect response
    if (/onDisconnect/.test(url.pathname)) {
      setPublicKey(null);
      setConnected(false);
      setSession(undefined);
      setSharedSecret(undefined);
      router.replace('/login');
      console.log('Disconnected from wallet');
    }

    // Handle transaction response
    if (/onSignAndSendTransaction/.test(url.pathname)) {
      try {
        const signAndSendTransactionData = decryptPayload(
          params.get('data')!,
          params.get('nonce')!,
          sharedSecret
        );
        console.log('Transaction submitted:', signAndSendTransactionData);
      } catch (error) {
        console.error('Transaction error:', error);
      }
      setSubmitting(false);
    }
  }, [deepLink]);

  // Connect to Phantom wallet
  const connect = async () => {
    setConnecting(true);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster,
      app_url: appUrl,
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl('connect', params);
    Linking.openURL(url);
  };

  // Disconnect from Phantom wallet
  const disconnect = async () => {
    if (!connected || !session || !sharedSecret) return;
    
    const payload = { session };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    const url = buildUrl('disconnect', params);
    Linking.openURL(url);
  };

  // Sign and send a transaction
  const signAndSendTransaction = async (transaction: Transaction) => {
    if (!publicKey || !connected || !session || !sharedSecret) return;
    
    setSubmitting(true);
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    
    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
    };
    
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    
    const url = buildUrl('signAndSendTransaction', params);
    Linking.openURL(url);
  };

  const value = {
    connection,
    publicKey,
    connected,
    connecting,
    submitting,
    connect,
    disconnect,
    signAndSendTransaction,
  };

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  );
}; 