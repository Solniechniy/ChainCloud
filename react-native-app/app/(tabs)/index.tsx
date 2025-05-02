import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  // Sample data - in a real app, this would come from an API
  const nodeStatus = "Active";
  const computePower = 85; // percentage
  const solBalance = 2.45;
  const dailyReward = 0.12;
  const uptime = "14h 23m";
  const totalContributed = "245.3";

  return (
    <LinearGradient
      colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          <LinearGradient
            colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
            style={styles.statusCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.statusHeader}>
              <View style={styles.statusIndicatorContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: nodeStatus === "Active" ? '#4CAF50' : '#FF5733' }]} />
                <Text style={styles.statusText}>{nodeStatus}</Text>
              </View>
              <Text style={styles.walletAddress}>Wallet: ••••4Xpz</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="pulse" size={24} color="#FF5733" />
                <Text style={styles.statValue}>{computePower}%</Text>
                <Text style={styles.statLabel}>Computing Power</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="logo-usd" size={24} color="#FF5733" />
                <Text style={styles.statValue}>{solBalance} SOL</Text>
                <Text style={styles.statLabel}>Balance</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={24} color="#FF5733" />
                <Text style={styles.statValue}>{dailyReward} SOL</Text>
                <Text style={styles.statLabel}>Daily Reward</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Node Performance</Text>
        </View>

        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Uptime</Text>
            <Text style={styles.performanceValue}>{uptime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Total Contributed</Text>
            <Text style={styles.performanceValue}>{totalContributed} hours</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Network Statistics</Text>
        </View>

        <View style={styles.networkCard}>
          <View style={styles.networkItem}>
            <Ionicons name="globe-outline" size={32} color="#FF5733" style={styles.networkIcon} />
            <View>
              <Text style={styles.networkValue}>2,345</Text>
              <Text style={styles.networkLabel}>Active Nodes</Text>
            </View>
          </View>
          <View style={styles.networkItem}>
            <Ionicons name="flash-outline" size={32} color="#FF5733" style={styles.networkIcon} />
            <View>
              <Text style={styles.networkValue}>128.4 TH/s</Text>
              <Text style={styles.networkLabel}>Network Hashrate</Text>
            </View>
          </View>
          <View style={styles.networkItem}>
            <Ionicons name="server-outline" size={32} color="#FF5733" style={styles.networkIcon} />
            <View>
              <Text style={styles.networkValue}>98.7%</Text>
              <Text style={styles.networkLabel}>Network Uptime</Text>
            </View>
          </View>
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
    paddingTop: 80,
  },
  statusCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statusCardGradient: {
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  walletAddress: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
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
  performanceCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  divider: {
    width: 1,
    backgroundColor: '#000000F2',
    marginHorizontal: 20,
  },
  networkCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 20,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkIcon: {
    marginRight: 16,
  },
  networkValue: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  networkLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
});
