import { StyleSheet, Platform, View, Image } from "react-native";
import { useState, useEffect } from "react";
import * as Battery from "expo-battery";
import * as FileSystem from "expo-file-system";
import * as Cellular from "expo-cellular";

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
      headerImage={
        <Image
          style={styles.headerImage}
          source={require("@/assets/images/icon.png")}
        />
      }
    >
      {/* Earnings Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title">ChainCloud Node</ThemedText>
        <ThemedText type="subtitle">Earnings</ThemedText>
        <ThemedView style={styles.earningsCard}>
          <View style={styles.earningItem}>
            <ThemedText type="defaultSemiBold">Total Earned</ThemedText>
            <ThemedText type="title">
              ${earnings.totalEarned.toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.dividedSection}>
            <View style={styles.earningItem}>
              <ThemedText>Pending</ThemedText>
              <ThemedText type="subtitle">
                ${earnings.pendingPayout.toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.earningItem}>
              <ThemedText>Weekly Avg</ThemedText>
              <ThemedText type="subtitle">
                ${earnings.weeklyAverage.toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ThemedView>

      {/* System Status Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">System Status</ThemedText>
        <ThemedView style={styles.statusCard}>
          <View style={styles.statusItem}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(systemStatus.operational) },
                ]}
              />
              <ThemedText>Operational</ThemedText>
            </View>
            <ThemedText>
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
              <ThemedText>Battery</ThemedText>
            </View>
            <ThemedText>{batteryLevel}%</ThemedText>
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
              <ThemedText>Network</ThemedText>
            </View>
            <ThemedText>
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
              <ThemedText>Storage</ThemedText>
            </View>
            <ThemedText>
              {systemStatus.storageAvailable ? "Available" : "Limited"}
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>

      {/* Usage Statistics Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Usage Statistics</ThemedText>
        <ThemedView style={styles.usageCard}>
          <ThemedText type="subtitle">Storage</ThemedText>
          <View style={styles.statItem}>
            <ThemedText>Used by ChainCloud:</ThemedText>
            <ThemedText>
              {usageStats.storageUsed} GB / {usageStats.totalStorage} GB
            </ThemedText>
          </View>

          <ThemedText type="subtitle" style={styles.statHeader}>
            Network
          </ThemedText>
          <View style={styles.statItem}>
            <ThemedText>Data Uploaded:</ThemedText>
            <ThemedText>{usageStats.networkUploaded} GB</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText>Data Downloaded:</ThemedText>
            <ThemedText>{usageStats.networkDownloaded} GB</ThemedText>
          </View>

          <ThemedText type="subtitle" style={styles.statHeader}>
            Node Activity
          </ThemedText>
          <View style={styles.statItem}>
            <ThemedText>Active Hours:</ThemedText>
            <ThemedText>{usageStats.activeHours} hours</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText>Data Served:</ThemedText>
            <ThemedText>{usageStats.dataServed} GB</ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    gap: 12,
  },
  earningsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(58, 134, 255, 0.1)",
    gap: 16,
  },
  earningItem: {
    alignItems: "center",
  },
  dividedSection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(58, 134, 255, 0.05)",
    gap: 12,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  usageCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(58, 134, 255, 0.05)",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  statHeader: {
    marginTop: 16,
    marginBottom: 4,
  },
  headerImage: {
    height: 100,
    width: 100,
    position: "absolute",
    bottom: 20,
    right: 20,
    resizeMode: "contain",
  },
});
