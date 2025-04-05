import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { tradeSimulator, MarketData, TradeSetup } from '../services/TradeSimulator';

const MOCK_SETUPS: TradeSetup[] = [
  {
    symbol: 'AAPL',
    type: 'CALL',
    strike: 180,
    expiry: '2024-04-19',
    entry: 3.45,
    stopLoss: 3.10,
    target: 4.15,
    probability: 85,
    setup: 'Golden Cross + Volume Surge',
    analysis: 'Price breaking out of consolidation with increasing volume. RSI showing strong momentum.',
  },
  {
    symbol: 'TSLA',
    type: 'PUT',
    strike: 190,
    expiry: '2024-04-19',
    entry: 4.20,
    stopLoss: 4.50,
    target: 3.50,
    probability: 82,
    setup: 'Double Top + Bearish Divergence',
    analysis: 'Forming double top pattern with bearish RSI divergence. Volume increasing on downside moves.',
  },
  {
    symbol: 'NVDA',
    type: 'CALL',
    strike: 900,
    expiry: '2024-04-19',
    entry: 25.50,
    stopLoss: 23.00,
    target: 30.00,
    probability: 78,
    setup: 'Bull Flag + Support Test',
    analysis: 'Consolidating after strong uptrend. Finding support at 20-day MA with decreasing volume.',
  },
];

export const TodaysPlaysScreen = () => {
  const navigation = useNavigation();
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map());
  const [selectedSetups, setSelectedSetups] = useState<string[]>([]);
  const [priceAnimations] = useState<Map<string, Animated.Value>>(
    new Map(MOCK_SETUPS.map(setup => [setup.symbol, new Animated.Value(0)]))
  );

  useEffect(() => {
    // Initialize market data
    MOCK_SETUPS.forEach(setup => {
      const data = tradeSimulator.getMarketData(setup.symbol);
      if (data) {
        setMarketData(prev => new Map(prev).set(setup.symbol, data));
      }
    });

    // Start simulation
    tradeSimulator.startSimulation();

    // Listen for price updates
    const handlePriceUpdate = (symbol: string, data: MarketData) => {
      setMarketData(prev => new Map(prev).set(symbol, data));
      
      // Animate price changes
      const animation = priceAnimations.get(symbol);
      if (animation) {
        Animated.sequence([
          Animated.timing(animation, {
            toValue: data.currentPrice > data.lastPrice ? 1 : -1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    tradeSimulator.on('priceUpdate', handlePriceUpdate);

    return () => {
      tradeSimulator.removeListener('priceUpdate', handlePriceUpdate);
    };
  }, []);

  const toggleSetup = (symbol: string) => {
    setSelectedSetups(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const executeTrades = () => {
    const selectedTrades = MOCK_SETUPS.filter(setup => 
      selectedSetups.includes(setup.symbol)
    );

    selectedTrades.forEach(setup => {
      tradeSimulator.executeTrade(setup);
    });

    navigation.navigate('ActiveTrades' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Recommendations</Text>
        <Text style={styles.subtitle}>High-probability setups based on market conditions</Text>
      </View>

      <ScrollView style={styles.setupsList}>
        {MOCK_SETUPS.map(setup => {
          const data = marketData.get(setup.symbol);
          const priceAnimation = priceAnimations.get(setup.symbol);
          const isSelected = selectedSetups.includes(setup.symbol);

          return (
            <TouchableOpacity
              key={setup.symbol}
              style={[styles.setupCard, isSelected && styles.selectedCard]}
              onPress={() => toggleSetup(setup.symbol)}
            >
              <View style={styles.setupHeader}>
                <View>
                  <Text style={styles.symbolText}>{setup.symbol}</Text>
                  <Text style={styles.optionText}>
                    {setup.type} ${setup.strike} Exp {setup.expiry}
                  </Text>
                </View>
                {data && (
                  <Animated.Text
                    style={[
                      styles.priceText,
                      {
                        color: data.currentPrice >= data.lastPrice
                          ? theme.colors.success
                          : theme.colors.danger,
                        transform: [
                          {
                            translateY: priceAnimation?.interpolate({
                              inputRange: [-1, 0, 1],
                              outputRange: [10, 0, -10],
                            }) || 0,
                          },
                        ],
                      },
                    ]}
                  >
                    ${data.currentPrice.toFixed(2)}
                  </Animated.Text>
                )}
              </View>

              <View style={styles.setupDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Entry</Text>
                    <Text style={styles.detailValue}>${setup.entry}</Text>
                  </View>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Stop Loss</Text>
                    <Text style={styles.detailValue}>${setup.stopLoss}</Text>
                  </View>
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Target</Text>
                    <Text style={styles.detailValue}>${setup.target}</Text>
                  </View>
                </View>

                <View style={styles.probabilityContainer}>
                  <Text style={styles.probabilityText}>
                    {setup.probability}% Probability
                  </Text>
                  <View style={styles.probabilityBar}>
                    <View
                      style={[
                        styles.probabilityFill,
                        { width: `${setup.probability}%` },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.setupContainer}>
                  <Text style={styles.setupLabel}>Setup</Text>
                  <Text style={styles.setupText}>{setup.setup}</Text>
                </View>

                <View style={styles.analysisContainer}>
                  <Text style={styles.analysisLabel}>Analysis</Text>
                  <Text style={styles.analysisText}>{setup.analysis}</Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.secondary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.executeButton,
          selectedSetups.length === 0 && styles.disabledButton,
        ]}
        onPress={executeTrades}
        disabled={selectedSetups.length === 0}
      >
        <Text style={styles.executeButtonText}>
          Execute {selectedSetups.length} Trade{selectedSetups.length !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
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
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  setupsList: {
    flex: 1,
    padding: theme.spacing.md,
  } as ViewStyle,
  setupCard: {
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
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  } as ViewStyle,
  setupHeader: {
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
  priceText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
  } as TextStyle,
  setupDetails: {
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
  probabilityContainer: {
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  probabilityText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.success,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  probabilityBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  } as ViewStyle,
  probabilityFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 2,
  } as ViewStyle,
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
  } as TextStyle,
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  } as ViewStyle,
  executeButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  } as ViewStyle,
  disabledButton: {
    backgroundColor: theme.colors.textSecondary,
  } as ViewStyle,
  executeButtonText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.surface,
    textAlign: 'center',
    fontWeight: '600',
  } as TextStyle,
}); 