import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { theme } from '../theme';

type ChartScreenProps = {
  route: RouteProp<{ Chart: { symbol: string } }, 'Chart'>;
};

const ChartScreen = () => {
  const route = useRoute<RouteProp<{ Chart: { symbol: string } }, 'Chart'>>();
  const { symbol = 'BTC/USD' } = route.params || {};
  const [timeframe, setTimeframe] = useState('1D');
  const [currentPrice, setCurrentPrice] = useState(42500);
  
  // Format data for wagmi charts
  const [data, setData] = useState([
    { timestamp: new Date(Date.now() - 7 * 60000).getTime(), value: 42100 },
    { timestamp: new Date(Date.now() - 6 * 60000).getTime(), value: 42300 },
    { timestamp: new Date(Date.now() - 5 * 60000).getTime(), value: 42450 },
    { timestamp: new Date(Date.now() - 4 * 60000).getTime(), value: 42200 },
    { timestamp: new Date(Date.now() - 3 * 60000).getTime(), value: 42600 },
    { timestamp: new Date(Date.now() - 2 * 60000).getTime(), value: 42400 },
    { timestamp: new Date(Date.now() - 1 * 60000).getTime(), value: 42500 },
    { timestamp: Date.now(), value: 42500 },
  ]);

  // Mock price update every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const lastPrice = data[data.length - 1].value;
      const newPrice = lastPrice + (Math.random() - 0.5) * 200;
      const newTimestamp = Date.now();
      
      setCurrentPrice(newPrice);
      setData(prevData => [
        ...prevData.slice(1),
        { timestamp: newTimestamp, value: newPrice }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  const timeframes = ['1H', '1D', '1W', '1M', '1Y'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbolText}>{symbol}</Text>
        <Text style={styles.priceText}>
          ${currentPrice.toFixed(2)}
        </Text>
        <Text style={[styles.changeText, { color: theme.colors.success }]}>
          +2.5%
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart.Provider data={data}>
          <LineChart width={Dimensions.get('window').width} height={300}>
            <LineChart.Path color={theme.colors.success} width={2} />
            <LineChart.CursorCrosshair color={theme.colors.success}>
              <LineChart.Tooltip />
            </LineChart.CursorCrosshair>
          </LineChart>
        </LineChart.Provider>
      </View>
      
      <View style={styles.timeframeContainer}>
        {timeframes.map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.timeframeButton,
              timeframe === tf && styles.selectedTimeframe
            ]}
            onPress={() => setTimeframe(tf)}
          >
            <Text style={[
              styles.timeframeText,
              timeframe === tf && styles.selectedTimeframeText
            ]}>
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sellButton}>
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
  },
  header: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  symbolText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceText: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: theme.spacing.sm,
  },
  changeText: {
    color: theme.colors.text,
    fontSize: 18,
    marginTop: theme.spacing.xs,
  },
  chartContainer: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.md,
  },
  timeframeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  selectedTimeframe: {
    backgroundColor: theme.colors.success,
  },
  timeframeText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  selectedTimeframeText: {
    color: theme.colors.background,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginTop: 'auto',
    marginBottom: 32,
  },
  buyButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '48%',
  },
  sellButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '48%',
  },
  buttonText: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChartScreen; 