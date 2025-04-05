import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { tradeSimulator, TradeSetup } from '../services/TradeSimulator';
import { Ionicons } from '@expo/vector-icons';

export default function TradeRecommendationsScreen() {
  const navigation = useNavigation();
  const [selectedTrades, setSelectedTrades] = useState<Set<number>>(new Set());

  const tradeSetups: TradeSetup[] = [
    {
      symbol: 'AAPL',
      type: 'CALL',
      strike: 175,
      expiry: '2024-05-17',
      entry: 175.50,
      stopLoss: 173.50,
      target: 180.00,
      probability: 0.65,
      setup: 'Bullish Breakout',
      analysis: 'Strong support at 173.50, momentum indicators turning positive',
    },
    {
      symbol: 'TSLA',
      type: 'PUT',
      strike: 185,
      expiry: '2024-05-17',
      entry: 185.20,
      stopLoss: 187.20,
      target: 180.00,
      probability: 0.70,
      setup: 'Bearish Reversal',
      analysis: 'Resistance at 187, overbought conditions on RSI',
    },
    {
      symbol: 'NVDA',
      type: 'CALL',
      strike: 880,
      expiry: '2024-05-17',
      entry: 880.30,
      stopLoss: 875.00,
      target: 890.00,
      probability: 0.75,
      setup: 'Momentum Continuation',
      analysis: 'Strong uptrend with increasing volume',
    },
  ];

  const toggleTradeSelection = (index: number) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTrades(newSelected);
  };

  const executeTrades = () => {
    // Execute each selected trade
    selectedTrades.forEach(index => {
      const trade = tradeSetups[index];
      tradeSimulator.executeTrade(trade);
    });

    // Clear selections
    setSelectedTrades(new Set());

    // Navigate to active trades screen
    navigation.navigate('ActiveTrades' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Trade Recommendations</Text>
          <Text style={styles.subtitle}>Select trades to start monitoring</Text>
        </View>

        {tradeSetups.map((trade, index) => (
          <Pressable
            key={index}
            style={[
              styles.tradeCard,
              selectedTrades.has(index) && styles.selectedCard
            ]}
            onPress={() => toggleTradeSelection(index)}
          >
            <View style={styles.tradeHeader}>
              <View style={styles.symbolContainer}>
                <Text style={styles.symbol}>{trade.symbol}</Text>
                <View style={[
                  styles.typeTag,
                  trade.type === 'CALL' ? styles.callTag : styles.putTag
                ]}>
                  <Text style={styles.typeText}>{trade.type}</Text>
                </View>
              </View>
              {selectedTrades.has(index) && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </View>

            <View style={styles.tradeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Entry:</Text>
                <Text style={styles.value}>${trade.entry.toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Stop Loss:</Text>
                <Text style={styles.value}>${trade.stopLoss.toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Target:</Text>
                <Text style={styles.value}>${trade.target.toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Probability:</Text>
                <Text style={styles.value}>{(trade.probability * 100).toFixed(0)}%</Text>
              </View>
            </View>

            <View style={styles.setupContainer}>
              <Text style={styles.setupTitle}>{trade.setup}</Text>
              <Text style={styles.analysis}>{trade.analysis}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {selectedTrades.size > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.executeButton}
            onPress={executeTrades}
          >
            <Text style={styles.executeButtonText}>
              Execute {selectedTrades.size} Trade{selectedTrades.size > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  tradeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  } as ViewStyle,
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  symbol: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  } as TextStyle,
  typeTag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  callTag: {
    backgroundColor: '#E3F2FD',
  } as ViewStyle,
  putTag: {
    backgroundColor: '#FFEBEE',
  } as ViewStyle,
  typeText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  } as TextStyle,
  tradeDetails: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  value: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '500',
  } as TextStyle,
  setupContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  } as ViewStyle,
  setupTitle: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  analysis: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as ViewStyle,
  executeButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  } as ViewStyle,
  executeButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  } as TextStyle,
}); 