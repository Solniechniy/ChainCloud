import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Sample transaction data
const transactions = [
  { id: 1, date: '2023-10-15', amount: 0.25, status: 'Completed' },
  { id: 2, date: '2023-10-14', amount: 0.18, status: 'Completed' },
  { id: 3, date: '2023-10-13', amount: 0.22, status: 'Completed' },
  { id: 4, date: '2023-10-12', amount: 0.15, status: 'Completed' },
  { id: 5, date: '2023-10-11', amount: 0.30, status: 'Completed' },
];

export default function RewardsScreen() {
  const totalBalance = 2.45; // SOL
  const pendingRewards = 0.12; // SOL
  const lifetimeEarnings = 5.82; // SOL

  return (
    <LinearGradient
      colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={['rgba(247, 229, 225, 0.62)', 'rgba(238, 206, 199, 1)']}
            style={styles.balanceCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>{totalBalance}</Text>
              <Text style={styles.balanceCurrency}>SOL</Text>
            </View>
            
            <View style={styles.rewardsStats}>
              <View style={styles.rewardStat}>
                <Text style={styles.rewardStatLabel}>Pending</Text>
                <Text style={styles.rewardStatValue}>{pendingRewards} SOL</Text>
              </View>
              <View style={styles.rewardStat}>
                <Text style={styles.rewardStatLabel}>Lifetime</Text>
                <Text style={styles.rewardStatValue}>{lifetimeEarnings} SOL</Text>
              </View>
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <LinearGradient
                  colors={['#FF5733', 'rgba(126, 53, 37, 0.9)']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="cash-outline" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Withdraw</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.secondaryButton}>
                  <Ionicons name="swap-horizontal-outline" size={20} color="#FF5733" style={styles.buttonIcon} />
                  <Text style={styles.secondaryButtonText}>Swap</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.earningsContainer}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Earnings Breakdown</Text>
          </View>
          
          <View style={styles.earningsCard}>
            <View style={styles.earningRow}>
              <View style={styles.earningLabelContainer}>
                <Ionicons name="today-outline" size={20} color="#FF5733" />
                <Text style={styles.earningLabel}>Daily Average</Text>
              </View>
              <Text style={styles.earningValue}>0.21 SOL</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.earningRow}>
              <View style={styles.earningLabelContainer}>
                <Ionicons name="calendar-outline" size={20} color="#FF5733" />
                <Text style={styles.earningLabel}>Weekly Total</Text>
              </View>
              <Text style={styles.earningValue}>1.45 SOL</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.earningRow}>
              <View style={styles.earningLabelContainer}>
                <Ionicons name="trending-up-outline" size={20} color="#FF5733" />
                <Text style={styles.earningLabel}>Monthly Projection</Text>
              </View>
              <Text style={styles.earningValue}>6.30 SOL</Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Recent Transactions</Text>
          </View>
          
          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIconContainer}>
                <Ionicons name="arrow-down" size={24} color="#4CAF50" />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Mining Reward</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={styles.transactionAmountText}>+{transaction.amount} SOL</Text>
                <Text style={styles.transactionStatus}>{transaction.status}</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Transactions</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF5733" />
          </TouchableOpacity>
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
  balanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  balanceCardGradient: {
    padding: 20,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 40,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  balanceCurrency: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#000000F2',
    marginLeft: 8,
    marginBottom: 6,
  },
  rewardsStats: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  rewardStat: {
    marginRight: 24,
  },
  rewardStatLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
    marginBottom: 4,
  },
  rewardStatValue: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 251, 250, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#FF5733',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    marginVertical: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  earningsContainer: {
    marginBottom: 16,
  },
  earningsCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 16,
    padding: 16,
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  earningLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningLabel: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#000000F2',
    marginLeft: 12,
  },
  earningValue: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#000000F2',
  },
  divider: {
    height: 1,
    backgroundColor: '#000000F2',
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionCard: {
    backgroundColor: 'rgba(126, 53, 37, 0.09)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#000000F2',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#4CAF50',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#000000F2',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#FF5733',
    marginRight: 8,
  },
}); 