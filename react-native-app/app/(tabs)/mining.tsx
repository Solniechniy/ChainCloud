import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function MiningScreen() {
  const [isMining, setIsMining] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [activeServer, setActiveServer] = useState<string | null>(null);
  
  // Animation for the mining indicator
  const pulseValue = useSharedValue(1);
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: pulseValue.value * 0.5 + 0.5,
    };
  });
  
  // Simulate loading proxy servers
  const loadProxyServers = async () => {
    setIsConnecting(true);
    try {
      // Simulate API call to get proxy servers
      await new Promise(resolve => setTimeout(resolve, 2000));
      const servers = [
        'proxy1.chaincloud.com',
        'proxy2.chaincloud.com',
        'proxy3.chaincloud.com'
      ];
      setConnectionStatus('connected');
      setActiveServer(servers[0]);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to proxy servers');
      setConnectionStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle mining toggle
  const toggleMining = async () => {
    if (!isMining) {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      await loadProxyServers();
    } else {
      setConnectionStatus('disconnected');
      setActiveServer(null);
    }
    setIsMining(!isMining);
  };

  
  return (
    <LinearGradient
      colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.miningStatusCard}>
          <LinearGradient
            colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
            style={styles.miningCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.indicatorRow}>
              <View style={styles.miningLabelContainer}>
                <Text style={styles.miningLabel}>Mining Status</Text>
                <View style={styles.statusRow}>
                  {isMining && connectionStatus === 'connected' && (
                    <Animated.View style={[styles.pulseCircle, pulseStyle]} />
                  )}
                  <View style={[styles.statusDot, { 
                    backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : 
                                   connectionStatus === 'connecting' ? '#FFA500' : '#FF5733' 
                  }]} />
                  <Text style={styles.statusText}>
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isMining}
                onValueChange={toggleMining}
                disabled={isConnecting}
                trackColor={{ false: 'rgba(126, 53, 37, 0.4)', true: 'rgba(126, 53, 37, 0.8)' }}
                thumbColor={isMining ? '#FF5733' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>

            {isMining && connectionStatus === 'connected' && (
              <View style={styles.resourcesContainer}>
                <View style={styles.resourceItem}>
                  <Ionicons name="server-outline" size={18} color="#FF5733" />
                  <Text style={styles.resourceLabel}>Active Server</Text>
                  <Text style={styles.resourceValue}>{activeServer}</Text>
                </View>
                <View style={styles.resourceItem}>
                  <Ionicons name="cloud-upload-outline" size={18} color="#FF5733" />
                  <Text style={styles.resourceLabel}>Status</Text>
                  <Text style={styles.resourceValue}>Connected</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Connection Details</Text>
        </View>

        <View style={styles.taskCard}>
          {isMining ? (
            <>
              <View style={styles.taskHeader}>
                <Ionicons name="server-outline" size={24} color="#FF5733" />
                <Text style={styles.taskTitle}>Proxy Connection</Text>
              </View>
              <Text style={styles.taskDescription}>
                {connectionStatus === 'connecting' ? 
                  'Establishing connection to proxy servers...' :
                  connectionStatus === 'connected' ?
                  'Successfully connected to proxy network. Mining is active.' :
                  'Disconnected from proxy network.'}
              </Text>
              {connectionStatus === 'connected' && (
                <View style={styles.taskStats}>
                  <View style={styles.taskStat}>
                    <Text style={styles.taskStatLabel}>Active Server</Text>
                    <Text style={styles.taskStatValue}>{activeServer}</Text>
                  </View>
                  <View style={styles.taskStat}>
                    <Text style={styles.taskStatLabel}>Status</Text>
                    <Text style={styles.taskStatValue}>Connected</Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.notMiningContainer}>
              <Ionicons name="pause-circle-outline" size={48} color="#FF5733" />
              <Text style={styles.notMiningText}>Mining is currently paused</Text>
              <Text style={styles.notMiningSubtext}>Toggle the switch above to connect to proxy servers and start mining</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flex: 1,
    paddingTop: 80,
  },
  miningStatusCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  miningCardGradient: {
    padding: 20,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miningLabelContainer: {
    flex: 1,
  },
  miningLabel: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  switch: {
    transform: [{ scale: 1.1 }],
  },
  resourcesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  resourceItem: {
    alignItems: 'center',
  },
  resourceLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginVertical: 4,
  },
  resourceValue: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  sectionTitle: {
    marginVertical: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  settingsCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 87, 51, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#000000F2',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 251, 250, 0.1)',
    marginLeft: 56,
  },
  taskCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
    marginLeft: 12,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 16,
    lineHeight: 20,
  },
  taskStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskStat: {
    alignItems: 'center',
  },
  taskStatLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 4,
  },
  taskStatValue: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  notMiningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notMiningText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
    marginTop: 16,
    marginBottom: 8,
  },
  notMiningSubtext: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    textAlign: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    opacity: 0.5,
    left: -3,
  },
}); 