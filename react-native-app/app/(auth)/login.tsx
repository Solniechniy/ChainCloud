import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnectWallet = () => {
    setLoading(true);
    // This is a placeholder for the actual wallet connection logic
    // The user mentioned they will implement this themselves
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['rgba(255, 251, 250, 1)', 'rgba(173, 31, 0, 0.16)']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>DAN</Text>
          <Text style={styles.tagline}>Decentralized Computing Power</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Empower the Network</Text>
          <Text style={styles.infoText}>
            Share your device&apos;s computational power and earn SOL tokens as rewards.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnectWallet}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF5733', 'rgba(126, 53, 37, 0.9)']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {loading ? (
              <Text style={styles.connectButtonText}>Connecting...</Text>
            ) : (
              <>
                <Ionicons name="wallet-outline" size={24} color="white" style={styles.walletIcon} />
                <Text style={styles.connectButtonText}>Connect Solana Wallet</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF5733',
    fontFamily: 'SpaceGrotesk-Bold',
  },
  tagline: {
    fontSize: 18,
    color: '#000000F2',
    marginTop: 10,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  infoContainer: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000F2',
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  infoText: {
    fontSize: 16,
    color: '#000000F2',
    lineHeight: 24,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  connectButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  walletIcon: {
    marginRight: 10,
  },
}); 