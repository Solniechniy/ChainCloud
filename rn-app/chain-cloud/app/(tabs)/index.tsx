import { StyleSheet, View, Image, ScrollView, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Battery from "expo-battery";
import * as FileSystem from "expo-file-system";
import * as Cellular from "expo-cellular";
import { LinearGradient } from 'expo-linear-gradient';

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [earnings, setEarnings] = useState({
    totalEarned: 125.45,
    pendingPayout: 12.3,
    weeklyAverage: 8.75,
  });

  const [systemStatus, setSystemStatus] = useState({
    operational: true,
    batteryOptimized: true,
    networkConnection: "strong",
    storageAvailable: true,
  });

  const [usageStats, setUsageStats] = useState({
    storageUsed: 0,
    totalStorage: 0,
    networkUploaded: 0,
    networkDownloaded: 0,
    activeHours: 156,
    dataServed: 25.4, // GB
  });

  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    // Get battery level
    const getBatteryLevel = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(Math.round(level * 100));
    };

    // Get device storage info
    const getStorageInfo = async () => {
      const fileInfo = await FileSystem.getFreeDiskStorageAsync();
      const totalInfo = await FileSystem.getTotalDiskCapacityAsync();

      setUsageStats((prev) => ({
        ...prev,
        storageUsed: Math.round((totalInfo - fileInfo) / (1024 * 1024 * 1024)), // Convert to GB
        totalStorage: Math.round(totalInfo / (1024 * 1024 * 1024)), // Convert to GB
      }));
    };

    // Get cellular info
    const getCellularInfo = async () => {
      try {
        const cellularGeneration = await Cellular.getCellularGenerationAsync();
        // For simplicity, just check if we have cellular connectivity
        setSystemStatus((prev) => ({
          ...prev,
          networkConnection: cellularGeneration ? "strong" : "moderate",
        }));
      } catch (e) {
        console.log("Error getting cellular info:", e);
      }
    };

    getBatteryLevel();
    getStorageInfo();
    getCellularInfo();

    // Simulate random network stats for demo
    setUsageStats((prev) => ({
      ...prev,
      networkUploaded: Math.round(Math.random() * 50), // GB
      networkDownloaded: Math.round(Math.random() * 100), // GB
    }));

    const batterySubscription = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryLevel(Math.round(batteryLevel * 100));
      }
    );

    return () => {
      batterySubscription.remove();
    };
  }, []);

  const getStatusColor = (status: boolean | string): string => {
    if (status === true || status === "strong") return "#4CAF50";
    if (status === "moderate") return "#FF9800";
    return "#F44336";
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#3a86ff", dark: "#1D3D47" }}
      headerContainer={
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['rgba(58, 134, 255, 0.8)', 'rgba(58, 134, 255, 0.4)']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <ThemedText type="title" lightColor="#fff" darkColor="#000" style={styles.appName}>ChainCloud</ThemedText>
              <ThemedText type="default" lightColor="#fff" darkColor="#000" style={styles.appSubtitle}>Decentralized Storage</ThemedText>
            </View>
            <Image
              style={styles.headerImage}
              source={require("@/assets/images/chain-cloud.png")}
            />
          </LinearGradient>
        </View>
      }
    >
      <ScrollView style={styles.scrollView}>
        {/* Earnings Section */}
        <ThemedView style={styles.section}>
          <LinearGradient
            colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
            style={styles.earningsCard}
          >
            <View style={styles.earningItem}>
              <ThemedText type="defaultSemiBold" style={styles.earningLabel}>Total Earned</ThemedText>
              <ThemedText type="title" style={styles.earningValue}>
                ${earnings.totalEarned.toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.dividedSection}>
              <View style={styles.earningItem}>
                <ThemedText style={styles.earningLabel}>Pending</ThemedText>
                <ThemedText type="subtitle" style={styles.earningValue}>
                  ${earnings.pendingPayout.toFixed(2)}
                </ThemedText>
              </View>
              <View style={styles.earningItem}>
                <ThemedText style={styles.earningLabel}>Weekly Avg</ThemedText>
                <ThemedText type="subtitle" style={styles.earningValue}>
                  ${earnings.weeklyAverage.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </LinearGradient>
        </ThemedView>

      {/* System Status Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>System Status</ThemedText>
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.statusCard}
        >
          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(systemStatus.operational) },
                ]}
              />
              <ThemedText style={styles.statusLabel}>Operational</ThemedText>
            </View>
            <ThemedText style={styles.statusValue}>
              {systemStatus.operational ? "Active" : "Inactive"}
            </ThemedText>
          </View>

          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(batteryLevel > 20) },
                ]}
              />
              <ThemedText style={styles.statusLabel}>Battery</ThemedText>
            </View>
            <ThemedText style={styles.statusValue}>{batteryLevel}%</ThemedText>
          </View>

          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(
                      systemStatus.networkConnection
                    ),
                  },
                ]}
              />
              <ThemedText style={styles.statusLabel}>Network</ThemedText>
            </View>
            <ThemedText style={styles.statusValue}>
              {systemStatus.networkConnection === "strong"
                ? "Strong"
                : "Moderate"}
            </ThemedText>
          </View>

          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(
                      systemStatus.storageAvailable
                    ),
                  },
                ]}
              />
              <ThemedText style={styles.statusLabel}>Storage</ThemedText>
            </View>
            <ThemedText style={styles.statusValue}>
              {systemStatus.storageAvailable ? "Available" : "Limited"}
            </ThemedText>
          </View>
        </LinearGradient>
      </ThemedView>

        {/* Usage Statistics Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Usage Statistics</ThemedText>
          <LinearGradient
            colors={['rgba(58, 134, 255, 0.05)', 'rgba(58, 134, 255, 0.02)']}
            style={styles.usageCard}
          >
            <View style={styles.usageSection}>
              <ThemedText type="subtitle" style={styles.usageTitle}>Storage</ThemedText>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Used by ChainCloud:</ThemedText>
                <ThemedText style={styles.statValue}>
                  {usageStats.storageUsed} GB / {usageStats.totalStorage} GB
                </ThemedText>
              </View>
            </View>

            <View style={styles.usageSection}>
              <ThemedText type="subtitle" style={styles.usageTitle}>Network</ThemedText>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Data Uploaded:</ThemedText>
                <ThemedText style={styles.statValue}>{usageStats.networkUploaded} GB</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Data Downloaded:</ThemedText>
                <ThemedText style={styles.statValue}>{usageStats.networkDownloaded} GB</ThemedText>
              </View>
            </View>

            <View style={styles.usageSection}>
              <ThemedText type="subtitle" style={styles.usageTitle}>Node Activity</ThemedText>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Active Hours:</ThemedText>
                <ThemedText style={styles.statValue}>{usageStats.activeHours} hours</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Data Served:</ThemedText>
                <ThemedText style={styles.statValue}>{usageStats.dataServed} GB</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 56,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  headerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  headerGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  appSubtitle: {
    fontSize: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  earningsCard: {
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(58, 134, 255, 0.1)",
    gap: 24,
    shadowColor: "#3a86ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  earningItem: {
    alignItems: "center",
  },
  earningLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  earningValue: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividedSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(58, 134, 255, 0.2)",
    paddingTop: 20,
  },
  statusCard: {
    padding: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#3a86ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(58, 134, 255, 0.1)",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 14,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  usageCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(58, 134, 255, 0.05)",
    gap: 24,
    shadowColor: "#3a86ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  usageSection: {
    gap: 16,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(58, 134, 255, 0.1)",
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
