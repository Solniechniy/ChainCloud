import { useSolanaWallet } from '@/context/SolanaWalletContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { publicKey } = useSolanaWallet();  
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoMining, setAutoMining] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  
  const handleLogout = () => {
    // In a real app, this would clear authentication state
    router.replace('/(auth)/login');
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
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>DU</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>SAN User</Text>
            <Text style={styles.walletAddress}>{publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#FF5733" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>App Settings</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: 'rgba(126, 53, 37, 0.4)', true: 'rgba(126, 53, 37, 0.8)' }}
              thumbColor={pushNotifications ? '#FF5733' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="hardware-chip-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Auto Mining on WiFi</Text>
            </View>
            <Switch
              value={autoMining}
              onValueChange={setAutoMining}
              trackColor={{ false: 'rgba(126, 53, 37, 0.4)', true: 'rgba(126, 53, 37, 0.8)' }}
              thumbColor={autoMining ? '#FF5733' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="finger-print-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: 'rgba(126, 53, 37, 0.4)', true: 'rgba(126, 53, 37, 0.8)' }}
              thumbColor={biometrics ? '#FF5733' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Support & Info</Text>
        </View>

        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="help-circle-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000F2" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="document-text-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000F2" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="shield-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000F2" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.supportRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#FF5733" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>About SAN</Text>
            </View>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color="#000000F2" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5733',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk-Bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 87, 51, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#000000F2',
  },
  divider: {
    height: 1,
    backgroundColor: '#000000F2',
    marginLeft: 56,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5733',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'white',
  },
}); 