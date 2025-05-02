import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function MiningScreen() {
  const [isMining, setIsMining] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(60); // percentage
  const [networkSpeed, setNetworkSpeed] = useState(2.3); // Mb/s
  
  // Animation for the mining indicator
  const pulseValue = useSharedValue(1);
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: pulseValue.value * 0.5 + 0.5,
    };
  });
  
  // Start pulsing animation when mining is active
  React.useEffect(() => {
    const pulse = () => {
      pulseValue.value = withSpring(1.2, { damping: 2 });
      setTimeout(() => {
        pulseValue.value = withSpring(1, { damping: 2 });
      }, 1000);
    };
    
    let interval: NodeJS.Timeout;
    if (isMining) {
      pulse();
      interval = setInterval(pulse, 2000);
      
      // Simulate fluctuating resources
      const resourceInterval = setInterval(() => {
        setCpuUsage(Math.floor(Math.random() * 20) + 50); // 50-70%
        setNetworkSpeed(Number((Math.random() * 1.5 + 1.5).toFixed(1))); // 1.5-3.0 Mb/s
      }, 5000);
      
      return () => {
        clearInterval(interval);
        clearInterval(resourceInterval);
      };
    }
    
    return () => clearInterval(interval);
  }, [isMining, pulseValue]);
  
  const toggleMining = () => {
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
                  {isMining && (
                    <Animated.View style={[styles.pulseCircle, pulseStyle]} />
                  )}
                  <View style={[styles.statusDot, { backgroundColor: isMining ? '#4CAF50' : '#FF5733' }]} />
                  <Text style={styles.statusText}>{isMining ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
              <Switch
                value={isMining}
                onValueChange={toggleMining}
                trackColor={{ false: 'rgba(126, 53, 37, 0.4)', true: 'rgba(126, 53, 37, 0.8)' }}
                thumbColor={isMining ? '#FF5733' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>

            {isMining && (
              <View style={styles.resourcesContainer}>
                <View style={styles.resourceItem}>
                  <Ionicons name="hardware-chip-outline" size={18} color="#FF5733" />
                  <Text style={styles.resourceLabel}>CPU Usage</Text>
                  <Text style={styles.resourceValue}>{cpuUsage}%</Text>
                </View>
                <View style={styles.resourceItem}>
                  <Ionicons name="cloud-upload-outline" size={18} color="#FF5733" />
                  <Text style={styles.resourceLabel}>Network</Text>
                  <Text style={styles.resourceValue}>{networkSpeed} Mb/s</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Mining Settings</Text>
        </View>

        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="speedometer-outline" size={24} color="#FF5733" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Resource Allocation</Text>
              <Text style={styles.settingDescription}>Set CPU and network usage limits</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000000F2" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="time-outline" size={24} color="#FF5733" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Schedule</Text>
              <Text style={styles.settingDescription}>Set automatic mining times</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000000F2" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="battery-charging-outline" size={24} color="#FF5733" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Power Settings</Text>
              <Text style={styles.settingDescription}>Only mine when charging</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000000F2" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Current Task</Text>
        </View>

        <View style={styles.taskCard}>
          {isMining ? (
            <>
              <View style={styles.taskHeader}>
                <Ionicons name="server-outline" size={24} color="#FF5733" />
                <Text style={styles.taskTitle}>RPC Node Validation</Text>
              </View>
              <Text style={styles.taskDescription}>
                Your node is currently validating and processing transactions for the Solana network.
              </Text>
              <View style={styles.taskStats}>
                <View style={styles.taskStat}>
                  <Text style={styles.taskStatLabel}>Transactions</Text>
                  <Text style={styles.taskStatValue}>248</Text>
                </View>
                <View style={styles.taskStat}>
                  <Text style={styles.taskStatLabel}>Blocks</Text>
                  <Text style={styles.taskStatValue}>12</Text>
                </View>
                <View style={styles.taskStat}>
                  <Text style={styles.taskStatLabel}>Estimated SOL</Text>
                  <Text style={styles.taskStatValue}>0.015</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.notMiningContainer}>
              <Ionicons name="pause-circle-outline" size={48} color="#FF5733" />
              <Text style={styles.notMiningText}>Mining is currently paused</Text>
              <Text style={styles.notMiningSubtext}>Toggle the switch above to start earning SOL</Text>
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