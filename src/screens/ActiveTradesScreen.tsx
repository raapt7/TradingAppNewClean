import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tradeSimulator, ActiveTrade } from '../services/TradeSimulator';
import { theme } from '../theme';

interface TradeWithAnimation extends ActiveTrade {
  fadeAnim: Animated.Value;
  isCompleting: boolean;
  priceHistory: number[];
}

interface ChartProps {
  data: number[];
  color: string;
}

const SimpleChart: React.FC<ChartProps> = ({ data, color }) => {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = Platform.OS === 'web' ? 600 : Dimensions.get('window').width - 64;
  const height = 100;
  const segments = data.length - 1;
  const segmentWidth = width / segments;

  return (
    <View style={styles.chartWrapper}>
      {data.map((value, index) => {
        if (index === data.length - 1) return null;
        const nextValue = data[index + 1];
        const currentHeight = ((value - min) / range) * height;
        const nextHeight = ((nextValue - min) / range) * height;
        const lineLength = Math.sqrt(Math.pow(segmentWidth, 2) + Math.pow(nextHeight - currentHeight, 2));
        const angle = Math.atan2(nextHeight - currentHeight, segmentWidth) * (180 / Math.PI);

        return (
          <View
            key={index}
            style={[
              styles.chartLine,
              {
                left: index * segmentWidth,
                bottom: currentHeight,
                width: lineLength,
                backgroundColor: color,
                transform: [
                  { translateY: 1 },
                  { rotate: `${angle}deg` },
                  { translateY: -1 }
                ]
              }
            ]}
          />
        );
      })}
    </View>
  );
};

export function ActiveTradesScreen() {
  const [trades, setTrades] = useState<TradeWithAnimation[]>([]);

  useEffect(() => {
    const currentTrades = tradeSimulator.getActiveTrades().map(trade => ({
      ...trade,
      fadeAnim: new Animated.Value(1),
      isCompleting: false,
      priceHistory: [trade.currentPrice],
    }));
    setTrades(currentTrades);

    const handleTradeUpdate = (updatedTrade: ActiveTrade) => {
      setTrades(current => {
        const existingTradeIndex = current.findIndex(t => t.id === updatedTrade.id);
        if (existingTradeIndex === -1 && !updatedTrade.status.includes('complet')) {
          const newTrade: TradeWithAnimation = {
            ...updatedTrade,
            fadeAnim: new Animated.Value(1),
            isCompleting: false,
            priceHistory: [updatedTrade.currentPrice],
          };
          return [...current, newTrade];
        }
        return current.map(trade => {
          if (trade.id === updatedTrade.id) {
            return {
              ...trade,
              ...updatedTrade,
              priceHistory: [...trade.priceHistory, updatedTrade.currentPrice].slice(-20),
            };
          }
          return trade;
        });
      });
    };

    const handleTradeCompleted = (completedTrade: ActiveTrade) => {
      setTrades(current => {
        return current.map(trade => {
          if (trade.id === completedTrade.id && !trade.isCompleting) {
            const timeoutId = setTimeout(() => {
              Animated.timing(trade.fadeAnim, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: false,
              }).start(() => {
                setTrades(prev => prev.filter(t => t.id !== trade.id));
              });
            }, 2000);
            
            return { ...trade, ...completedTrade, isCompleting: true };
          }
          return trade;
        });
      });
    };

    tradeSimulator.on('tradeUpdate', handleTradeUpdate);
    tradeSimulator.on('tradeCompleted', handleTradeCompleted);

    return () => {
      tradeSimulator.off('tradeUpdate', handleTradeUpdate);
      tradeSimulator.off('tradeCompleted', handleTradeCompleted);
    };
  }, []);

  const calculateMetrics = (trade: TradeWithAnimation) => {
    const principal = 1000; // Simulating $1000 per trade
    const totalValue = principal + trade.profitLoss;
    const totalPercent = trade.profitLossPercent;
    
    return {
      principal,
      totalValue: Math.round(totalValue * 100) / 100,
      totalPercent: Math.round(totalPercent * 100) / 100
    };
  };

  const getStatusColor = (status: string, profitLoss: number) => {
    if (status.includes('complet')) {
      return profitLoss >= 0 ? theme.colors.success : theme.colors.danger;
    }
    if (status === 'entering') return theme.colors.secondary;
    if (status === 'exiting') return theme.colors.warning;
    return theme.colors.textSecondary;
  };

  const getStatusMessage = (trade: TradeWithAnimation) => {
    if (trade.status === 'completed') {
      if (trade.profitLoss >= 0) {
        return 'Great job! This trade was profitable.';
      } else {
        return 'That\'s okay. Every trade is a learning opportunity.';
      }
    }
    if (trade.status === 'exiting') {
      return trade.exitReason || 'Exiting trade...';
    }
    if (trade.status === 'entering') {
      return 'Entering trade...';
    }
    return 'Monitoring trade...';
  };

  return (
    <ScrollView style={[styles.container, Platform.OS === 'web' && styles.webContainer]}>
      {trades.map((trade) => {
        const metrics = calculateMetrics(trade);

        return (
          <Animated.View
            key={trade.id}
            style={[
              styles.tradeCard,
              { opacity: trade.fadeAnim }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.symbolContainer}>
                <Text style={styles.symbol}>{trade.symbol}</Text>
                <View style={[styles.typeTag, trade.type === 'CALL' ? styles.callTag : styles.putTag]}>
                  <Text style={styles.typeText}>{trade.type}</Text>
                </View>
              </View>
              <Text style={[styles.status, { color: getStatusColor(trade.status, trade.profitLoss) }]}>
                {trade.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.chartContainer}>
              <SimpleChart 
                data={trade.priceHistory}
                color={trade.profitLoss >= 0 ? theme.colors.success : theme.colors.danger}
              />
            </View>

            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Capital</Text>
                  <Text style={styles.metricValue}>${metrics.principal}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Current Value</Text>
                  <Text style={styles.metricValue}>${metrics.totalValue}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Return</Text>
                  <Text style={[
                    styles.metricValue,
                    { color: metrics.totalPercent >= 0 ? theme.colors.success : theme.colors.danger }
                  ]}>
                    {metrics.totalPercent >= 0 ? '+' : ''}{metrics.totalPercent}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tradeInfo}>
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Entry</Text>
                  <Text style={styles.value}>${trade.entry}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Current</Text>
                  <Text style={[
                    styles.value,
                    { color: trade.profitLoss >= 0 ? theme.colors.success : theme.colors.danger }
                  ]}>
                    ${trade.currentPrice}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Stop Loss</Text>
                  <Text style={styles.value}>${trade.stopLoss}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Target</Text>
                  <Text style={styles.value}>${trade.target}</Text>
                </View>
              </View>
            </View>

            <View style={styles.profitSection}>
              <View style={styles.profitRow}>
                <Text style={[
                  styles.profitValue,
                  { color: trade.profitLoss >= 0 ? theme.colors.success : theme.colors.danger }
                ]}>
                  {trade.profitLoss >= 0 ? '+' : ''}${Math.abs(trade.profitLoss).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.message}>{getStatusMessage(trade)}</Text>
            </View>
          </Animated.View>
        );
      })}
      
      {trades.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="pulse" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>No active trades yet</Text>
          <Text style={styles.emptySubtext}>Head to Today's Trades to start trading</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  webContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  } as ViewStyle,
  chartWrapper: {
    height: 100,
    width: Platform.OS === 'web' ? 600 : Dimensions.get('window').width - 64,
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  } as ViewStyle,
  chartLine: {
    position: 'absolute',
    height: 2,
  } as ViewStyle,
  tradeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
      : Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
      : { elevation: 2 }
    ),
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  symbol: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  } as TextStyle,
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  } as ViewStyle,
  callTag: {
    backgroundColor: '#E3F2FD',
  } as ViewStyle,
  putTag: {
    backgroundColor: '#FFEBEE',
  } as ViewStyle,
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  status: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  chartContainer: {
    marginVertical: 12,
    alignItems: 'center',
  } as ViewStyle,
  metricsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  } as ViewStyle,
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  } as ViewStyle,
  metric: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  } as TextStyle,
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  } as TextStyle,
  tradeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  } as ViewStyle,
  infoColumn: {
    flex: 1,
  } as ViewStyle,
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  } as ViewStyle,
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  } as TextStyle,
  value: {
    fontSize: 14,
    fontWeight: '500',
  } as TextStyle,
  profitSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  } as ViewStyle,
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  profitValue: {
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  } as TextStyle,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  } as ViewStyle,
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 16,
  } as TextStyle,
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
  } as TextStyle,
}); 