import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface CompletedTrade {
  id: string;
  symbol: string;
  type: 'CALL' | 'PUT';
  strike: number;
  expiry: string;
  entry: number;
  exit: number;
  profit: number;
  profitPercent: number;
  date: string;
  setup: string;
  analysis: string;
  lessons: string;
}

const MOCK_TRADES: CompletedTrade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'CALL',
    strike: 190,
    expiry: '2024-04-19',
    entry: 3.45,
    exit: 4.10,
    profit: 65,
    profitPercent: 18.84,
    date: '2024-03-15',
    setup: 'Golden Cross + Volume Surge',
    analysis: 'Strong momentum carried the trade to our target. Market breadth was supportive throughout the session.',
    lessons: 'Patience in waiting for volume confirmation paid off. The setup aligned with broader market momentum.',
  },
  {
    id: '2',
    symbol: 'TSLA',
    type: 'PUT',
    strike: 220,
    expiry: '2024-04-19',
    entry: 4.20,
    exit: 3.85,
    profit: -35,
    profitPercent: -8.33,
    date: '2024-03-14',
    setup: 'RSI Oversold + Support Test',
    analysis: 'Price consolidated longer than expected, leading to theta decay. Support level held strong.',
    lessons: 'Consider shorter-dated options when expecting quick moves. Monitor time decay more closely in consolidation.',
  },
];

export const TradeJournalScreen = () => {
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  const calculateStats = () => {
    const totalTrades = MOCK_TRADES.length;
    const winningTrades = MOCK_TRADES.filter(t => t.profit > 0).length;
    const totalProfit = MOCK_TRADES.reduce((sum, t) => sum + t.profit, 0);
    const avgReturn = MOCK_TRADES.reduce((sum, t) => sum + t.profitPercent, 0) / totalTrades;

    return {
      winRate: (winningTrades / totalTrades) * 100,
      totalProfit,
      avgReturn,
    };
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trade Journal</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Win Rate</Text>
            <Text style={styles.statValue}>{stats.winRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total P/L</Text>
            <Text style={[
              styles.statValue,
              { color: stats.totalProfit >= 0 ? theme.colors.success : theme.colors.danger }
            ]}>
              ${stats.totalProfit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg Return</Text>
            <Text style={[
              styles.statValue,
              { color: stats.avgReturn >= 0 ? theme.colors.success : theme.colors.danger }
            ]}>
              {stats.avgReturn >= 0 ? '+' : ''}{stats.avgReturn.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, timeframe === 'all' && styles.activeFilter]}
          onPress={() => setTimeframe('all')}
        >
          <Text style={[styles.filterText, timeframe === 'all' && styles.activeFilterText]}>
            All Time
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, timeframe === 'month' && styles.activeFilter]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[styles.filterText, timeframe === 'month' && styles.activeFilterText]}>
            This Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, timeframe === 'week' && styles.activeFilter]}
          onPress={() => setTimeframe('week')}
        >
          <Text style={[styles.filterText, timeframe === 'week' && styles.activeFilterText]}>
            This Week
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tradesList}>
        {MOCK_TRADES.map(trade => (
          <View key={trade.id} style={styles.tradeCard}>
            <View style={styles.tradeHeader}>
              <View>
                <Text style={styles.symbolText}>{trade.symbol}</Text>
                <Text style={styles.optionText}>
                  {trade.type} ${trade.strike} Exp {trade.expiry}
                </Text>
              </View>
              <Text style={[
                styles.profitText,
                { color: trade.profit >= 0 ? theme.colors.success : theme.colors.danger }
              ]}>
                ${trade.profit.toFixed(2)}
                {'\n'}
                <Text style={styles.profitPercent}>
                  ({trade.profitPercent >= 0 ? '+' : ''}{trade.profitPercent.toFixed(2)}%)
                </Text>
              </Text>
            </View>

            <View style={styles.tradeDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Entry</Text>
                  <Text style={styles.detailValue}>${trade.entry.toFixed(2)}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Exit</Text>
                  <Text style={styles.detailValue}>${trade.exit.toFixed(2)}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{trade.date}</Text>
                </View>
              </View>

              <View style={styles.setupContainer}>
                <Text style={styles.setupLabel}>Setup</Text>
                <Text style={styles.setupText}>{trade.setup}</Text>
              </View>

              <View style={styles.analysisContainer}>
                <Text style={styles.analysisLabel}>Analysis</Text>
                <Text style={styles.analysisText}>{trade.analysis}</Text>

                <Text style={styles.lessonsLabel}>Key Lessons</Text>
                <Text style={styles.lessonsText}>{trade.lessons}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  } as TextStyle,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  } as ViewStyle,
  statItem: {
    alignItems: 'center',
  } as ViewStyle,
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as TextStyle,
  statValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  } as TextStyle,
  filters: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  activeFilter: {
    backgroundColor: theme.colors.card,
  } as ViewStyle,
  filterText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  activeFilterText: {
    color: theme.colors.text,
    fontWeight: '600',
  } as TextStyle,
  tradesList: {
    flex: 1,
    padding: theme.spacing.md,
  } as ViewStyle,
  tradeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  symbolText: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  } as TextStyle,
  optionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  profitText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'right',
  } as TextStyle,
  profitPercent: {
    fontSize: theme.typography.caption.fontSize,
  } as TextStyle,
  tradeDetails: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  } as ViewStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  detail: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  detailLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  } as TextStyle,
  detailValue: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  } as TextStyle,
  setupContainer: {
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  setupLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  } as TextStyle,
  setupText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
  analysisContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  } as ViewStyle,
  analysisLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  } as TextStyle,
  analysisText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  lessonsLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  } as TextStyle,
  lessonsText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
}); 