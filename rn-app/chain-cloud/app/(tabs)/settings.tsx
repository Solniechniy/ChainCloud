import { StyleSheet, ScrollView, View, Switch, Platform } from "react-native";
import { useState } from "react";
import React, { ReactNode } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

interface SettingsItemProps {
  label: string;
  value: string;
  description?: string;
}

interface SettingsSwitchItemProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  // Storage settings
  const [maxStorage, setMaxStorage] = useState(10); // GB
  const [allowMobileData, setAllowMobileData] = useState(false);
  const [allowBackgroundSync, setAllowBackgroundSync] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Payment settings
  const [walletAddress, setWalletAddress] = useState(
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  );
  const [minPayout, setMinPayout] = useState(25); // tokens
  const [autoWithdraw, setAutoWithdraw] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>
          Settings
        </ThemedText>

        <SettingsSection title="Storage Settings">
          <SettingsItem
            label="Max Storage Allocation"
            value={`${maxStorage} GB`}
            description="Maximum disk space ChainCloud can use"
          />

          <SettingsSwitchItem
            label="Allow Mobile Data"
            value={allowMobileData}
            onValueChange={setAllowMobileData}
            description="Allow data transfer over cellular connection"
          />

          <SettingsSwitchItem
            label="Background Syncing"
            value={allowBackgroundSync}
            onValueChange={setAllowBackgroundSync}
            description="Keep syncing data when app is in background"
          />

          <SettingsSwitchItem
            label="Low Power Mode"
            value={lowPowerMode}
            onValueChange={setLowPowerMode}
            description="Reduce resource usage when battery is low"
          />
        </SettingsSection>

        <SettingsSection title="App Settings">
          <SettingsSwitchItem
            label="Auto-Start"
            value={autoStart}
            onValueChange={setAutoStart}
            description="Start ChainCloud when device boots"
          />

          <SettingsSwitchItem
            label="Notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            description="Show earnings and status notifications"
          />
        </SettingsSection>

        <SettingsSection title="Payment Settings">
          <SettingsItem
            label="Wallet Address"
            value={
              walletAddress.substring(0, 7) +
              "..." +
              walletAddress.substring(walletAddress.length - 5)
            }
            description="Where earnings will be sent"
          />

          <SettingsItem
            label="Minimum Payout"
            value={`${minPayout} tokens`}
            description="Minimum amount required for withdrawal"
          />

          <SettingsSwitchItem
            label="Auto Withdraw"
            value={autoWithdraw}
            onValueChange={setAutoWithdraw}
            description="Automatically withdraw when minimum is reached"
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            label="Version"
            value="1.0.0"
            description="ChainCloud node client"
          />

          <SettingsItem
            label="Network Status"
            value="Online"
            description="ChainCloud network status"
          />
        </SettingsSection>
      </ScrollView>
    </ThemedView>
  );
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedView style={styles.sectionContent}>{children}</ThemedView>
    </ThemedView>
  );
}

function SettingsItem({ label, value, description }: SettingsItemProps) {
  return (
    <ThemedView style={styles.settingItem}>
      <View style={styles.settingMain}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <ThemedText>{value}</ThemedText>
      </View>
      {description && (
        <ThemedText style={styles.description}>{description}</ThemedText>
      )}
    </ThemedView>
  );
}

function SettingsSwitchItem({
  label,
  value,
  onValueChange,
  description,
}: SettingsSwitchItemProps) {
  return (
    <ThemedView style={styles.settingItem}>
      <View style={styles.settingMain}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: "#3a86ff" }}
          thumbColor={
            Platform.OS === "ios" ? undefined : value ? "#f5f5f5" : "#f5f5f5"
          }
        />
      </View>
      {description && (
        <ThemedText style={styles.description}>{description}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionContent: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(58, 134, 255, 0.05)",
    marginTop: 8,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    opacity: 0.7,
  },
});
