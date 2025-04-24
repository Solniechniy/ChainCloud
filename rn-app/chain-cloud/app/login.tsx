import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import Button from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';

export default function LoginScreen() {
  const { connect, connecting } = useSolanaWallet();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Login',
        headerShown: false,
      }} />
      
      <LinearGradient
        colors={['rgba(58, 134, 255, 0.8)', 'rgba(58, 134, 255, 0.4)']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={require("@/assets/images/chain-cloud.png")}
        />
        <ThemedText type="title" style={styles.title}>ChainCloud</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>Decentralized Storage Platform</ThemedText>
        
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.card}
        >
          <ThemedText style={styles.cardText} lightColor="#fff" darkColor="#000">
            Connect your Solana wallet to access decentralized storage and earn tokens
            by sharing your device resources.
          </ThemedText>
          
          <Button 
            title="Connect Wallet" 
            onPress={connect} 
            isLoading={connecting} 
            style={styles.connectButton}
          />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  card: {
    width: width - 40,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(58, 134, 255, 0.1)',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#3a86ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButton: {
    width: '100%',
  },
}); 