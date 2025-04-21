import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const barColor = colorScheme === "dark" ? "#4890fe" : "#3a86ff";
  const textColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  const [storageData, setStorageData] = useState([
    { value: 0, label: "Available", frontColor: "#4CAF50" },
    { value: 0, label: "Used", frontColor: barColor },
  ]);

  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { value: 8.2, label: "Mon", frontColor: barColor },
    { value: 7.8, label: "Tue", frontColor: barColor },
    { value: 10.5, label: "Wed", frontColor: barColor },
    { value: 9.3, label: "Thu", frontColor: barColor },
    { value: 8.9, label: "Fri", frontColor: barColor },
    { value: 12.1, label: "Sat", frontColor: barColor },
    { value: 10.8, label: "Sun", frontColor: barColor },
  ]);

  const [networkActivity, setNetworkActivity] = useState([
    { value: 25, label: "Upload", frontColor: "#FF9800" },
    { value: 65, label: "Download", frontColor: barColor },
  ]);

  const [historicalData, setHistoricalData] = useState({
    dataChunksStored: 186,
    dataRequestsServed: 724,
    totalDataDelivered: 215.6,
    totalEarned: 145.78,
    uptime: "98.7%",
    successRate: "99.3%",
  });

  useEffect(() => {
    const getStorageInfo = async () => {
      try {
        const freeStorage = await FileSystem.getFreeDiskStorageAsync();
        const totalStorage = await FileSystem.getTotalDiskCapacityAsync();
        const usedStorage = totalStorage - freeStorage;

        setStorageData([
          {
            value: Math.round(freeStorage / (1024 * 1024 * 1024)),
            label: "Available",
            frontColor: "#4CAF50",
          },
          {
            value: Math.round(usedStorage / (1024 * 1024 * 1024)),
            label: "Used",
            frontColor: barColor,
          },
        ]);
      } catch (e) {
        console.log("Error getting storage info:", e);
      }
    };

    getStorageInfo();

    // Simulate some dynamic data
    const interval = setInterval(() => {
      setNetworkActivity([
        {
          value: Math.round(20 + Math.random() * 10),
          label: "Upload",
          frontColor: "#FF9800",
        },
        {
          value: Math.round(60 + Math.random() * 15),
          label: "Download",
          frontColor: barColor,
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [barColor]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Weekly Earnings (in tokens)</ThemedText>
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.card}
        >
          <View style={styles.chartContainer}>
            <BarChart
              data={weeklyEarnings}
              width={Dimensions.get("window").width - 80}
              height={200}
              barWidth={30}
              spacing={20}
              hideRules
              xAxisThickness={1}
              yAxisThickness={1}
              xAxisColor={textColor}
              yAxisColor={textColor}
              yAxisTextStyle={{ color: textColor }}
              xAxisLabelTextStyle={{ color: textColor }}
              noOfSections={5}
              maxValue={15}
            />
          </View>
        </LinearGradient>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Storage Allocation (GB)</ThemedText>
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.card}
        >
          <View style={styles.chartContainer}>
            <BarChart
              data={storageData}
              width={Dimensions.get("window").width - 80}
              height={150}
              barWidth={60}
              spacing={40}
              hideRules
              xAxisThickness={1}
              yAxisThickness={1}
              xAxisColor={textColor}
              yAxisColor={textColor}
              yAxisTextStyle={{ color: textColor }}
              xAxisLabelTextStyle={{ color: textColor }}
              noOfSections={5}
            />
          </View>
        </LinearGradient>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Network Activity (GB)</ThemedText>
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.card}
        >
          <View style={styles.chartContainer}>
            <BarChart
              data={networkActivity}
              width={Dimensions.get("window").width - 80}
              height={150}
              barWidth={60}
              spacing={40}
              hideRules
              xAxisThickness={1}
              yAxisThickness={1}
              xAxisColor={textColor}
              yAxisColor={textColor}
              yAxisTextStyle={{ color: textColor }}
              xAxisLabelTextStyle={{ color: textColor }}
              noOfSections={5}
              maxValue={100}
            />
          </View>
        </LinearGradient>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Historical Performance</ThemedText>
        <LinearGradient
          colors={['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)']}
          style={styles.card}
        >
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {historicalData.dataChunksStored}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Data Chunks Stored
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {historicalData.dataRequestsServed}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Requests Served</ThemedText>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {historicalData.totalDataDelivered} GB
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Total Data Delivered
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                ${historicalData.totalEarned.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Earned</ThemedText>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {historicalData.uptime}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Uptime</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {historicalData.successRate}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Success Rate</ThemedText>
            </View>
          </View>
        </LinearGradient>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 56+24,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  sectionTitle: {
    marginBottom: 16,
    marginLeft: 8,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#3a86ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 16,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(58, 134, 255, 0.1)',
  },
  statItem: {
    width: "48%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    letterSpacing: 0.3,
  },
});
