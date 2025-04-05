import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, useColorScheme, Alert, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { theme } from './src/theme';

// Add chart configuration
const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 2,
  priceDecimals: 2,
};

const negativeChartConfig = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
};

const screenWidth = Dimensions.get('window').width;

// Types for trade data
interface Trade {
  id: string;
  symbol: string;
  type: 'CALL' | 'PUT';
  entry: number;
  target: number;
  stop: number;
  setup: string;
  selected?: boolean;
  executed?: boolean;
  currentPrice?: number;
  entryTime?: Date;
  progress?: number;
  profit?: number;
  confidence?: 'High' | 'Medium' | 'Low';
  timeFrame?: string;
  potentialReturn?: number;
  volume?: number;
  isDTE0?: boolean;
  quantity?: number;
  strikePrice?: number;
  expiryDate?: Date;
  netPosition?: number;
  percentROI?: number;
  deltaValue?: number;
  thetaValue?: number;
  impliedVolatility?: number;
  costBasis?: number;
  marketValue?: number;
  tradeStatus?: 'GAINING' | 'LOSING' | 'BREAKEVEN';
  priceHistory?: number[];
  relatedNews?: {
    headline: string;
    source: string;
    url: string;
    timestamp: Date;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  sectorPerformance?: {
    name: string;
    change: number;
  };
  indexInfo?: {
    name: string;
    change: number;
    indication: 'bullish' | 'bearish' | 'neutral';
  };
}

interface JournalEntry {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  profit: number;
  setup: string;
  lesson: string;
  date: Date;
}

// Simplified app without navigation
export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = React.useState('Home');
  
  // State for trade recommendations
  const [tradeRecommendations, setTradeRecommendations] = React.useState<Trade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'CALL',
      entry: 180.50,
      target: 187.25,
      stop: 177.80,
      setup: 'Bullish breakout with increasing volume',
      selected: false,
      confidence: 'High',
      timeFrame: '1-3 days',
      potentialReturn: 3.74,
      volume: 5.2,
      isDTE0: false
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'PUT',
      entry: 185.20,
      target: 180.00,
      stop: 187.50,
      setup: 'Bearish reversal at resistance',
      selected: false,
      confidence: 'Medium',
      timeFrame: '1 day',
      potentialReturn: 2.81,
      volume: 6.7,
      isDTE0: false
    },
    {
      id: '3',
      symbol: 'NVDA',
      type: 'CALL',
      entry: 905.75,
      target: 930.00,
      stop: 895.00,
      setup: 'Bull flag pattern after earnings',
      selected: false,
      confidence: 'High',
      timeFrame: '2-3 days',
      potentialReturn: 2.68,
      volume: 4.3,
      isDTE0: false
    },
    {
      id: '4',
      symbol: 'META',
      type: 'CALL',
      entry: 510.25,
      target: 525.00,
      stop: 500.00,
      setup: 'Support bounce with volume confirmation',
      selected: false,
      confidence: 'Medium',
      timeFrame: '1-2 days',
      potentialReturn: 2.89,
      volume: 3.8,
      isDTE0: false
    },
    {
      id: '5',
      symbol: 'SPY',
      type: 'CALL',
      entry: 524.50,
      target: 528.00,
      stop: 522.75,
      setup: '0DTE momentum play on market bounce',
      selected: false,
      confidence: 'Medium',
      timeFrame: 'Same day',
      potentialReturn: 2.55,
      volume: 12.4,
      isDTE0: true
    },
    {
      id: '6',
      symbol: 'QQQ',
      type: 'PUT',
      entry: 445.25,
      target: 442.00,
      stop: 447.00,
      setup: '0DTE technical breakdown at resistance',
      selected: false,
      confidence: 'High',
      timeFrame: 'Same day',
      potentialReturn: 3.10,
      volume: 8.7,
      isDTE0: true
    }
  ]);
  
  // Add some sample active trades
  const [activeTrades, setActiveTrades] = React.useState<Trade[]>([
    {
      id: '101',
      symbol: 'MSFT',
      type: 'CALL',
      entry: 415.75,
      target: 430.00,
      stop: 408.50,
      setup: 'Breakout from consolidation',
      executed: true,
      entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      currentPrice: 422.30,
      progress: 45,
      profit: 6.55,
      quantity: 5,
      strikePrice: 415.00,
      expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      netPosition: 3275.00,
      percentROI: 7.9,
      deltaValue: 0.65,
      thetaValue: -0.12,
      impliedVolatility: 32.5,
      costBasis: 2078.75,
      marketValue: 2111.50,
      tradeStatus: 'GAINING',
      priceHistory: [415.75, 414.20, 416.50, 418.75, 420.10, 422.30]
    },
    {
      id: '102',
      symbol: 'AMZN',
      type: 'CALL',
      entry: 182.25,
      target: 190.00,
      stop: 178.50,
      setup: 'Cup and handle pattern',
      executed: true,
      entryTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      currentPrice: 186.80,
      progress: 58,
      profit: 4.55,
      quantity: 10,
      strikePrice: 180.00,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      netPosition: 1868.00,
      percentROI: 12.3,
      deltaValue: 0.78,
      thetaValue: -0.09,
      impliedVolatility: 29.8,
      costBasis: 1822.50,
      marketValue: 1868.00,
      tradeStatus: 'GAINING',
      priceHistory: [182.25, 181.90, 183.45, 184.20, 185.50, 186.80]
    },
    {
      id: '103',
      symbol: 'SPY',
      type: 'PUT',
      entry: 523.75,
      target: 515.00,
      stop: 528.50,
      setup: '0DTE breakdown at resistance',
      executed: true,
      entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      currentPrice: 521.30,
      progress: 27,
      profit: 2.45,
      quantity: 3,
      strikePrice: 520.00,
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      netPosition: 1563.90,
      percentROI: 4.7,
      deltaValue: -0.52,
      thetaValue: -0.26,
      impliedVolatility: 22.1,
      costBasis: 1571.25,
      marketValue: 1563.90,
      tradeStatus: 'GAINING',
      priceHistory: [523.75, 524.10, 522.90, 522.50, 521.80, 521.30]
    },
    {
      id: '104',
      symbol: 'TSLA',
      type: 'PUT',
      entry: 248.50,
      target: 235.00,
      stop: 255.75,
      setup: 'Double top reversal',
      executed: true,
      entryTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      currentPrice: 252.80,
      progress: -59,
      profit: -4.30,
      quantity: 8,
      strikePrice: 245.00,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      netPosition: 2022.40,
      percentROI: -8.7,
      deltaValue: -0.48,
      thetaValue: -0.18,
      impliedVolatility: 38.2,
      costBasis: 1988.00,
      marketValue: 2022.40,
      tradeStatus: 'LOSING',
      priceHistory: [248.50, 249.75, 250.40, 251.90, 252.50, 252.80]
    }
  ]);
  
  // State for journal entries
  const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>([
    {
      id: '1',
      symbol: 'NVDA',
      entryPrice: 875.20,
      exitPrice: 880.50,
      profit: 5.30,
      setup: 'Momentum continuation play',
      lesson: 'Patience paid off with this trade. Holding through the consolidation period was key.',
      date: new Date('2023-04-01')
    },
    {
      id: '2',
      symbol: 'META',
      entryPrice: 505.40,
      exitPrice: 503.30,
      profit: -2.10,
      setup: 'Gap fill attempt',
      lesson: 'Position sizing was too large relative to stop distance. Need better risk management.',
      date: new Date('2023-03-28')
    },
    {
      id: '3',
      symbol: 'GOOGL',
      entryPrice: 172.30,
      exitPrice: 175.80,
      profit: 3.50,
      setup: 'Support bounce pattern',
      lesson: 'Taking profit at the first target was the right move. The stock reversed shortly after.',
      date: new Date('2023-03-25')
    }
  ]);

  // Settings state
  const [settings, setSettings] = React.useState({
    riskPerTrade: 2,
    accountSize: 10000,
    notificationsEnabled: true,
    darkModeEnabled: isDarkMode
  });

  // Update settings function
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Function to toggle trade selection
  const toggleTradeSelection = (id: string) => {
    setTradeRecommendations(prevTrades => 
      prevTrades.map(trade => 
        trade.id === id 
          ? { ...trade, selected: !trade.selected } 
          : trade
      )
    );
  };
  
  // Function to execute selected trades
  const executeSelectedTrades = () => {
    const selectedTrades = tradeRecommendations.filter(trade => trade.selected);
    
    if (selectedTrades.length === 0) {
      Alert.alert('No Trades Selected', 'Please select at least one trade to execute.');
      return;
    }
    
    // Transform selected trades into active trades
    const newActiveTrades = selectedTrades.map(trade => ({
      ...trade,
      executed: true,
      entryTime: new Date(),
      currentPrice: trade.entry + (trade.type === 'CALL' ? 2.45 : -1.30),
      progress: trade.type === 'CALL' ? 60 : 40,
      profit: trade.type === 'CALL' ? 2.45 : -1.30
    }));
    
    // Update active trades
    setActiveTrades(prev => [...prev, ...newActiveTrades]);
    
    // Remove selected trades from recommendations
    setTradeRecommendations(prevTrades => 
      prevTrades.filter(trade => !trade.selected)
    );
    
    // Navigate to Active Trades tab
    setActiveTab('Active Trades');
    
    Alert.alert('Trades Executed', `Successfully executed ${selectedTrades.length} trades.`);
  };
  
  // Function to close an active trade (add to journal)
  const closeActiveTrade = (tradeId: string, exitPrice: number) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    
    if (!trade) return;
    
    // Create a journal entry
    const newJournalEntry: JournalEntry = {
      id: Date.now().toString(),
      symbol: trade.symbol,
      entryPrice: trade.entry,
      exitPrice: exitPrice,
      profit: exitPrice - trade.entry,
      setup: trade.setup,
      lesson: trade.type === 'CALL' 
        ? 'Successfully captured upside movement.' 
        : 'Successfully captured downside movement.',
      date: new Date()
    };
    
    // Add to journal
    setJournalEntries(prev => [newJournalEntry, ...prev]);
    
    // Remove from active trades
    setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
    
    Alert.alert('Trade Closed', `${trade.symbol} trade has been closed and added to your journal.`);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen onTradeButtonPress={() => setActiveTab('Recommendations')} settings={settings} activeTrades={activeTrades.length} />;
      case 'Recommendations':
  return (
          <TradeRecommendationsScreen 
            trades={tradeRecommendations} 
            onToggleSelect={toggleTradeSelection}
            onExecuteTrades={executeSelectedTrades}
          />
        );
      case 'Active Trades':
        return (
          <ActiveTradesScreen 
            trades={activeTrades}
            onCloseTrade={closeActiveTrade}
          />
        );
      case 'Journal':
        return <TradeJournalScreen entries={journalEntries} />;
      case 'Settings':
        return <SettingsScreen settings={settings} onUpdateSettings={updateSettings} />;
      default:
        return <HomeScreen onTradeButtonPress={() => setActiveTab('Recommendations')} settings={settings} activeTrades={activeTrades.length} />;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {renderContent()}
      
      {/* Custom Tab Bar */}
      <View style={[
        styles.tabBar,
        { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }
      ]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Home')}
        >
          <Ionicons
            name={activeTab === 'Home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'Home' ? theme.colors.secondary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'Home' ? theme.colors.secondary : theme.colors.textSecondary }
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Recommendations')}
        >
          <Ionicons
            name={activeTab === 'Recommendations' ? 'analytics' : 'analytics-outline'}
            size={24}
            color={activeTab === 'Recommendations' ? theme.colors.secondary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'Recommendations' ? theme.colors.secondary : theme.colors.textSecondary }
            ]}
          >
            Trades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Active Trades')}
        >
          <Ionicons
            name={activeTab === 'Active Trades' ? 'pulse' : 'pulse-outline'}
            size={24}
            color={activeTab === 'Active Trades' ? theme.colors.secondary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'Active Trades' ? theme.colors.secondary : theme.colors.textSecondary }
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Journal')}
        >
          <Ionicons
            name={activeTab === 'Journal' ? 'book' : 'book-outline'}
            size={24}
            color={activeTab === 'Journal' ? theme.colors.secondary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'Journal' ? theme.colors.secondary : theme.colors.textSecondary }
            ]}
          >
            Journal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Settings')}
        >
          <Ionicons
            name={activeTab === 'Settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={activeTab === 'Settings' ? theme.colors.secondary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'Settings' ? theme.colors.secondary : theme.colors.textSecondary }
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Simple screen components
const HomeScreen = ({ 
  onTradeButtonPress,
  settings,
  activeTrades 
}: { 
  onTradeButtonPress: () => void,
  settings: { riskPerTrade: number, accountSize: number, notificationsEnabled: boolean },
  activeTrades: number 
}) => {
  return (
    <ScrollView style={styles.content}>
    <View style={styles.container}>
        <Text style={styles.heading}>Trading App</Text>
        <Text style={styles.subheading}>Welcome to your trading dashboard!</Text>
        
        <View style={styles.dashboardRow}>
          <View style={[styles.dashboardCard, styles.dashboardCardPrimary]}>
            <Text style={styles.dashboardValue}>4</Text>
            <Text style={styles.dashboardLabel}>Available Setups</Text>
    </View>
          
          <View style={[styles.dashboardCard, styles.dashboardCardSecondary]}>
            <Text style={styles.dashboardValue}>{activeTrades}</Text>
            <Text style={styles.dashboardLabel}>Active Trades</Text>
          </View>
        </View>
        
        <View style={styles.dashboardRow}>
          <View style={[styles.dashboardCard, styles.dashboardCardSuccess]}>
            <Text style={styles.dashboardValue}>68%</Text>
            <Text style={styles.dashboardLabel}>Win Rate</Text>
          </View>
          
          <View style={[styles.dashboardCard, styles.dashboardCardInfo]}>
            <Text style={styles.dashboardValue}>3.2%</Text>
            <Text style={styles.dashboardLabel}>Avg. Return</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Market Overview</Text>
          <Text style={styles.cardText}>Major indices are showing strength today with tech stocks leading the way.</Text>
          <View style={styles.marketStatsRow}>
            <View style={styles.marketStat}>
              <Text style={styles.marketStatLabel}>S&P 500</Text>
              <Text style={[styles.marketStatValue, styles.positiveValue]}>+1.2%</Text>
            </View>
            <View style={styles.marketStat}>
              <Text style={styles.marketStatLabel}>NASDAQ</Text>
              <Text style={[styles.marketStatValue, styles.positiveValue]}>+1.8%</Text>
            </View>
            <View style={styles.marketStat}>
              <Text style={styles.marketStatLabel}>DOW</Text>
              <Text style={[styles.marketStatValue, styles.positiveValue]}>+0.9%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Opportunities</Text>
          <Text style={styles.cardText}>Check out the Trade Recommendations tab for today's best setups.</Text>
          <TouchableOpacity 
            style={styles.viewTradesButton}
            onPress={onTradeButtonPress}
          >
            <Text style={styles.viewTradesButtonText}>View Trade Recommendations</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Text style={styles.settingTitle}>Settings</Text>
            <Ionicons name="settings-outline" size={20} color={theme.colors.textSecondary} />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Risk per Trade</Text>
            <Text style={styles.settingValue}>{settings.riskPerTrade}%</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Account Size</Text>
            <Text style={styles.settingValue}>${settings.accountSize.toLocaleString()}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <View style={styles.settingToggle}>
              <Text style={[styles.settingValue, { marginRight: 8 }]}>
                {settings.notificationsEnabled ? 'On' : 'Off'}
              </Text>
              <Ionicons 
                name={settings.notificationsEnabled ? "notifications" : "notifications-off"} 
                size={20} 
                color={settings.notificationsEnabled ? theme.colors.secondary : theme.colors.textSecondary} 
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Trade Recommendations Screen
const TradeRecommendationsScreen = ({ 
  trades, 
  onToggleSelect,
  onExecuteTrades
}: { 
  trades: Trade[], 
  onToggleSelect: (id: string) => void,
  onExecuteTrades: () => void
}) => {
  const [categoryTab, setCategoryTab] = React.useState<'all' | '0dte' | 'swing'>('all');
  const [hasSelectedTrades, setHasSelectedTrades] = React.useState(false);
  
  // Filter trades based on current tab
  const filteredTrades = React.useMemo(() => {
    switch(categoryTab) {
      case '0dte':
        return trades.filter(trade => trade.isDTE0);
      case 'swing':
        return trades.filter(trade => !trade.isDTE0);
      default:
        return trades;
    }
  }, [trades, categoryTab]);
  
  // Check if any trades are selected
  React.useEffect(() => {
    setHasSelectedTrades(trades.some(trade => trade.selected));
  }, [trades]);
  
  // Calculate Risk/Reward ratio
  const getRiskRewardRatio = (trade: Trade) => {
    const reward = Math.abs(trade.target - trade.entry);
    const risk = Math.abs(trade.stop - trade.entry);
    return (reward / risk).toFixed(1);
  };
  
  // Calculate potential profit and loss
  const getPotentialProfit = (trade: Trade) => {
    return Math.abs(trade.target - trade.entry).toFixed(2);
  };
  
  const getPotentialLoss = (trade: Trade) => {
    return Math.abs(trade.stop - trade.entry).toFixed(2);
  };
  
  // Get confidence level color
  const getConfidenceColor = (confidence?: 'High' | 'Medium' | 'Low') => {
    switch(confidence) {
      case 'High': return theme.colors.success;
      case 'Medium': return theme.colors.warning;
      case 'Low': return theme.colors.danger;
      default: return theme.colors.textSecondary;
    }
  };
  
  const renderTradeCard = (trade: Trade) => (
    <TouchableOpacity 
      key={trade.id}
      style={[
        styles.tradeCard,
        trade.selected && styles.selectedTradeCard
      ]}
      onPress={() => onToggleSelect(trade.id)}
    >
      <View style={styles.tradeHeader}>
        <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
        <View style={[styles.tradeType, trade.type === 'CALL' ? styles.callType : styles.putType]}>
          <Text style={styles.tradeTypeText}>{trade.type}</Text>
        </View>
      </View>
      
      <Text style={styles.tradeDetails}>
        Entry: ${trade.entry.toFixed(2)} • Target: ${trade.target.toFixed(2)} • Stop: ${trade.stop.toFixed(2)}
      </Text>
      
      <View style={styles.tradeMetricsRow}>
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>R/R Ratio</Text>
          <Text style={styles.tradeMetricValue}>{getRiskRewardRatio(trade)}</Text>
        </View>
        
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>Potential Gain</Text>
          <Text style={[styles.tradeMetricValue, { color: theme.colors.success }]}>
            ${getPotentialProfit(trade)}
          </Text>
        </View>
        
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>Potential Loss</Text>
          <Text style={[styles.tradeMetricValue, { color: theme.colors.danger }]}>
            ${getPotentialLoss(trade)}
          </Text>
        </View>
      </View>
      
      <View style={styles.tradeMetricsRow}>
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>Confidence</Text>
          <Text style={[styles.tradeMetricValue, { color: getConfidenceColor(trade.confidence) }]}>
            {trade.confidence || 'Medium'}
          </Text>
        </View>
        
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>Time Frame</Text>
          <Text style={styles.tradeMetricValue}>{trade.timeFrame || 'Short-term'}</Text>
        </View>
        
        <View style={styles.tradeMetric}>
          <Text style={styles.tradeMetricLabel}>Volume (M)</Text>
          <Text style={styles.tradeMetricValue}>{trade.volume?.toFixed(1) || '-'}</Text>
        </View>
      </View>
      
      <Text style={styles.tradeSetup}>{trade.setup}</Text>
      
      {trade.selected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.secondary} />
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.tradeRecoScreen}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, categoryTab === 'all' && styles.activeTabButton]}
          onPress={() => setCategoryTab('all')}
        >
          <Text style={[styles.tabButtonText, categoryTab === 'all' && styles.activeTabButtonText]}>
            All Trades
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, categoryTab === '0dte' && styles.activeTabButton]}
          onPress={() => setCategoryTab('0dte')}
        >
          <Text style={[styles.tabButtonText, categoryTab === '0dte' && styles.activeTabButtonText]}>
            0DTE Trades
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, categoryTab === 'swing' && styles.activeTabButton]}
          onPress={() => setCategoryTab('swing')}
        >
          <Text style={[styles.tabButtonText, categoryTab === 'swing' && styles.activeTabButtonText]}>
            Swing Trades
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, position: 'relative'}}>
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{paddingBottom: 160}} // Increase padding from 120 to 160
        >
          <View style={styles.container}>
            <Text style={styles.heading}>Trade Recommendations</Text>
            <Text style={styles.subheading}>Select trades to execute</Text>
            
            {filteredTrades.length > 0 ? (
              filteredTrades.map(renderTradeCard)
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyStateText}>No trades available in this category.</Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Fixed execute button - now sits above tab bar regardless of scroll position */}
        {trades.length > 0 && (
          <View style={styles.stickyButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.executeButton,
                !hasSelectedTrades && styles.executeButtonDisabled
              ]}
              onPress={onExecuteTrades}
              disabled={!hasSelectedTrades}
            >
              <Text style={styles.executeButtonText}>
                Execute Selected Trades
              </Text>
              {hasSelectedTrades && (
                <View style={styles.selectedCountBadge}>
                  <Text style={styles.selectedCountText}>
                    {trades.filter(t => t.selected).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// Active Trades Screen
const ActiveTradesScreen = ({ 
  trades,
  onCloseTrade
}: { 
  trades: Trade[],
  onCloseTrade: (id: string, exitPrice: number) => void
}) => {
  // Add state for real-time simulation
  const [simulatedTrades, setSimulatedTrades] = React.useState<Trade[]>(trades);
  const [marketStatus, setMarketStatus] = React.useState('Market open • Live data');
  const [lastUpdate, setLastUpdate] = React.useState(new Date());
  const [recentActivity, setRecentActivity] = React.useState<string | null>(null);
  
  // Run market simulation
  React.useEffect(() => {
    // Update initial state when trades prop changes
    setSimulatedTrades(trades.map(trade => ({
      ...trade,
      // Add sample news for each trade
      relatedNews: [
        {
          headline: trade.symbol === 'SPY' ? 'Fed signals potential rate cut in next meeting' : `${trade.symbol} beats quarterly earnings expectations`,
          source: trade.symbol === 'SPY' ? 'Wall Street Journal' : 'CNBC',
          url: 'https://www.example.com/news',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 12) * 60 * 60 * 1000),
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative'
        },
        {
          headline: trade.symbol === 'SPY' ? 'Market volatility expected ahead of jobs report' : `Analyst upgrades ${trade.symbol} to "buy" rating`,
          source: trade.symbol === 'SPY' ? 'Bloomberg' : 'Barron\'s',
          url: 'https://www.example.com/news2',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000),
          sentiment: Math.random() > 0.7 ? 'positive' : (Math.random() > 0.3 ? 'neutral' : 'negative')
        }
      ],
      // Add sector and index info - using Number() to ensure the change is a number, not a string
      sectorPerformance: {
        name: trade.symbol === 'AAPL' || trade.symbol === 'MSFT' ? 'Technology' : 
              trade.symbol === 'SPY' ? 'S&P 500' :
              trade.symbol === 'AMZN' ? 'Consumer Discretionary' : 'Financial Services',
        change: Number((Math.random() * 2 - 1).toFixed(2))
      },
      indexInfo: {
        name: trade.symbol === 'SPY' ? 'S&P 500' : 
              trade.symbol === 'MSFT' || trade.symbol === 'AAPL' ? 'NASDAQ' :
              'Dow Jones',
        change: Number((Math.random() * 2 - 1).toFixed(2)),
        indication: Math.random() > 0.5 ? 'bullish' : 'bearish'
      }
    })));
  }, [trades]);
  
  // Simulate live market with periodic updates
  React.useEffect(() => {
    // Skip if no trades
    if (simulatedTrades.length === 0) return;
    
    const simulationInterval = setInterval(() => {
      // Update prices randomly to simulate market movement
      setSimulatedTrades(prevTrades => {
        return prevTrades.map(trade => {
          // Random price movement between -0.5% and +0.5%
          const priceChange = trade.currentPrice ? (trade.currentPrice * (Math.random() * 0.01 - 0.005)) : 0;
          const newPrice = Number((trade.currentPrice || trade.entry) + priceChange).toFixed(2);
          
          // Calculate new profit based on price change
          const newProfit = Number(newPrice) - trade.entry;
          
          // Calculate progress toward target or stop
          let newProgress = 0;
          if (trade.type === 'CALL') {
            if (Number(newPrice) > trade.entry) {
              // Positive progress toward target for a CALL
              newProgress = ((Number(newPrice) - trade.entry) / (trade.target - trade.entry)) * 100;
            } else {
              // Negative progress toward stop loss for a CALL
              newProgress = ((Number(newPrice) - trade.entry) / (trade.stop - trade.entry)) * 100;
            }
          } else { // PUT
            if (Number(newPrice) < trade.entry) {
              // Positive progress toward target for a PUT
              newProgress = ((trade.entry - Number(newPrice)) / (trade.entry - trade.target)) * 100;
            } else {
              // Negative progress toward stop loss for a PUT
              newProgress = ((trade.entry - Number(newPrice)) / (trade.entry - trade.stop)) * 100;
            }
          }
          
          // Update price history
          const newPriceHistory = [...(trade.priceHistory || []), Number(newPrice)].slice(-10);
          
          // Return updated trade
          return {
            ...trade,
            currentPrice: Number(newPrice),
            profit: Number(newProfit.toFixed(2)),
            percentROI: Number(((newProfit / trade.entry) * 100).toFixed(2)),
            progress: Number(newProgress.toFixed(0)),
            priceHistory: newPriceHistory,
            marketValue: Number(newPrice) * (trade.quantity || 1)
          };
        });
      });
      
      // Update last update time
      setLastUpdate(new Date());
      
      // Generate random trade activity messages
      if (Math.random() > 0.7) {
        const activities = [
          "AAPL volume spike detected, considering adjustment",
          "Market volatility increasing, monitoring stops",
          "SPY approaching resistance levels",
          "Sector rotation observed, evaluating impact",
          "Earnings announcement impact being evaluated"
        ];
        setRecentActivity(activities[Math.floor(Math.random() * activities.length)]);
        
        // Clear activity message after 3 seconds
        setTimeout(() => setRecentActivity(null), 3000);
      }
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(simulationInterval);
  }, [simulatedTrades.length]);
  
  // Portfolio summary calculation
  const portfolioSummary = React.useMemo(() => {
    const totalInvested = simulatedTrades.reduce((sum, trade) => sum + (trade.costBasis || 0), 0);
    const currentValue = simulatedTrades.reduce((sum, trade) => sum + (trade.marketValue || 0), 0);
    const totalProfit = simulatedTrades.reduce((sum, trade) => sum + (trade.profit || 0) * (trade.quantity || 1), 0);
    const averageROI = simulatedTrades.length > 0 
      ? simulatedTrades.reduce((sum, trade) => sum + (trade.percentROI || 0), 0) / simulatedTrades.length
      : 0;
    const winningTrades = simulatedTrades.filter(trade => (trade.profit || 0) > 0).length;
    const losingTrades = simulatedTrades.filter(trade => (trade.profit || 0) < 0).length;
    
    return {
      totalInvested,
      currentValue,
      totalProfit,
      averageROI,
      winningTrades,
      losingTrades
    };
  }, [simulatedTrades]);

  // Generate chart data
  const getChartData = (trade: Trade) => {
    // Use price history if available, otherwise generate it
    const priceData = trade.priceHistory || [];
    
    if (priceData.length === 0) {
      const dataPoints = 6;
      const startPrice = trade.entry;
      const endPrice = trade.currentPrice || trade.entry;
      const priceIncrement = (endPrice - startPrice) / (dataPoints - 1);
      
      for (let i = 0; i < dataPoints; i++) {
        const basePrice = startPrice + (priceIncrement * i);
        // Add some randomness for realistic chart
        const jitter = startPrice * 0.005 * (Math.random() - 0.5);
        priceData.push(basePrice + jitter);
      }
    }
    
    return {
      labels: ["", "", "", "", "", ""],
      datasets: [
        {
          data: priceData,
          color: (opacity = 1) => (trade.profit || 0) > 0 
            ? `rgba(46, 204, 113, ${opacity})` 
            : `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };
  
  // Calculate duration
  const getTradeDuration = (trade: Trade) => {
    if (!trade.entryTime) return "N/A";
    
    const now = new Date();
    const entryTime = new Date(trade.entryTime);
    const diffMs = now.getTime() - entryTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (trade: Trade) => {
    if (!trade.expiryDate) return "N/A";
    
    const now = new Date();
    const expiryDate = new Date(trade.expiryDate);
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays}d` : "Today";
  };
  
  // Close a trade with profit loss simulation
  const simulateCloseTrade = (trade: Trade) => {
    Alert.alert(
      'Close Trade',
      `Are you sure you want to close your ${trade.symbol} ${trade.type} position?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Close with Profit',
          onPress: () => {
            // Simulate a profitable exit
            const exitPrice = trade.currentPrice || trade.entry;
            const profitableExit = exitPrice * 1.02; // 2% higher than current
            onCloseTrade(trade.id, profitableExit);
            Alert.alert('Trade Closed', `${trade.symbol} trade closed with profit! Added to journal.`);
          }
        },
        {
          text: 'Close Now',
          onPress: () => {
            // Close at current price
            const exitPrice = trade.currentPrice || trade.entry;
            onCloseTrade(trade.id, exitPrice);
            Alert.alert('Trade Closed', `${trade.symbol} trade closed at market price. Added to journal.`);
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.content}>
      <View style={styles.container}>
        <View style={styles.marketStatusContainer}>
          <Text style={styles.heading}>Active Trades</Text>
          <View style={styles.marketStatusRow}>
            <View style={styles.statusIndicator}></View>
            <Text style={styles.marketStatusText}>{marketStatus}</Text>
            <Text style={styles.marketUpdateTime}>
              Updated: {lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </Text>
          </View>
          
          {recentActivity && (
            <View style={styles.activityAlert}>
              <Ionicons name="alert-circle-outline" size={16} color={theme.colors.warning} />
              <Text style={styles.activityAlertText}>{recentActivity}</Text>
            </View>
          )}
        </View>
        
        {simulatedTrades.length > 0 && (
          <View style={styles.portfolioSummaryCard}>
            <Text style={styles.portfolioSummaryTitle}>Portfolio Summary</Text>
            <View style={styles.portfolioMetricsContainer}>
              <View style={styles.portfolioMetricColumn}>
                <View style={styles.portfolioMetric}>
                  <Text style={styles.portfolioMetricLabel}>Total Value</Text>
                  <Text style={styles.portfolioMetricValue}>
                    ${portfolioSummary.currentValue.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.portfolioMetric}>
                  <Text style={styles.portfolioMetricLabel}>Total P/L</Text>
                  <Text style={[
                    styles.portfolioMetricValue,
                    {color: portfolioSummary.totalProfit >= 0 ? theme.colors.success : theme.colors.danger}
                  ]}>
                    {portfolioSummary.totalProfit >= 0 ? '+' : ''}${portfolioSummary.totalProfit.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.portfolioMetricColumn}>
                <View style={styles.portfolioMetric}>
                  <Text style={styles.portfolioMetricLabel}>Avg. ROI</Text>
                  <Text style={[
                    styles.portfolioMetricValue, 
                    {color: portfolioSummary.averageROI >= 0 ? theme.colors.success : theme.colors.danger}
                  ]}>
                    {portfolioSummary.averageROI >= 0 ? '+' : ''}{portfolioSummary.averageROI.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.portfolioMetric}>
                  <Text style={styles.portfolioMetricLabel}>Win/Loss</Text>
                  <Text style={styles.portfolioMetricValue}>
                    {portfolioSummary.winningTrades}/{portfolioSummary.losingTrades}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {simulatedTrades.length > 0 ? (
          simulatedTrades.map(trade => {
            const chartData = getChartData(trade);
            const isProfit = (trade.profit || 0) > 0;
            const daysToExpiry = getDaysUntilExpiry(trade);
            const tradeDuration = getTradeDuration(trade);
            const totalValue = (trade.quantity || 1) * (trade.currentPrice || trade.entry);
            
            return (
              <View 
                key={trade.id}
                style={[
                  styles.activeTradeCard,
                  { borderLeftColor: isProfit ? theme.colors.success : theme.colors.danger }
                ]}
              >
                <View style={styles.tradeCardBadge}>
                  <Text style={styles.tradeCardBadgeText}>{trade.type}</Text>
                </View>
                
                <View style={styles.tradeHeader}>
                  <View style={styles.tradeSymbolContainer}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={styles.tradeQuantity}>×{trade.quantity || 1}</Text>
                  </View>
                  <View style={styles.tradeProfitContainer}>
                    <Text 
                      style={[
                        styles.tradeProfit, 
                        { color: isProfit ? theme.colors.success : theme.colors.danger }
                      ]}
                    >
                      {isProfit ? '+' : ''}{trade.profit?.toFixed(2)}
                    </Text>
                    <Text 
                      style={[
                        styles.tradeProfitPercent,
                        { color: isProfit ? theme.colors.success : theme.colors.danger }
                      ]}
                    >
                      ({trade.percentROI?.toFixed(2)}%)
                    </Text>
                  </View>
                </View>
                
                <View style={styles.tradeChartAndDetails}>
                  <View style={styles.chartContainer}>
                    <LineChart
                      data={chartData}
                      width={screenWidth * 0.4}
                      height={120}
                      chartConfig={isProfit ? chartConfig : negativeChartConfig}
                      bezier
                      withDots={false}
                      withInnerLines={false}
                      withOuterLines={false}
                      withHorizontalLabels={false}
                      withVerticalLabels={false}
                      style={styles.chart}
                    />
                  </View>
                  
                  <View style={styles.tradeDetailsSummary}>
                    <View style={styles.priceRow}>
                      <View style={styles.priceBlock}>
                        <Text style={styles.priceLabel}>Strike</Text>
                        <Text style={styles.priceValue}>${trade.strikePrice?.toFixed(2)}</Text>
                      </View>
                      <View style={styles.priceBlock}>
                        <Text style={styles.priceLabel}>Entry</Text>
                        <Text style={styles.priceValue}>${trade.entry.toFixed(2)}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.priceRow}>
                      <View style={styles.priceBlock}>
                        <Text style={styles.priceLabel}>Current</Text>
                        <View style={styles.currentPriceContainer}>
                          <Text style={[
                            styles.currentPrice,
                            {color: isProfit ? theme.colors.success : theme.colors.danger}
                          ]}>
                            ${trade.currentPrice?.toFixed(2)}
                          </Text>
                          <Ionicons 
                            name={isProfit ? "caret-up" : "caret-down"} 
                            size={12} 
                            color={isProfit ? theme.colors.success : theme.colors.danger} 
                            style={styles.priceChangeIcon}
                          />
                        </View>
                      </View>
                      <View style={styles.priceBlock}>
                        <Text style={styles.priceLabel}>Expiry</Text>
                        <Text style={[
                          styles.priceValue,
                          {color: daysToExpiry === 'Today' ? theme.colors.warning : theme.colors.text}
                        ]}>
                          {daysToExpiry}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.tradeMetricsGrid}>
                  <View style={[styles.tradeMetricBlock, styles.tradeMetricTopLeft]}>
                    <Text style={styles.tradeMetricLabel}>Target</Text>
                    <Text style={[styles.tradeMetricValue, {color: theme.colors.success}]}>
                      ${trade.target.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={[styles.tradeMetricBlock, styles.tradeMetricTopRight]}>
                    <Text style={styles.tradeMetricLabel}>Stop Loss</Text>
                    <Text style={[styles.tradeMetricValue, {color: theme.colors.danger}]}>
                      ${trade.stop.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={[styles.tradeMetricBlock, styles.tradeMetricBottomLeft]}>
                    <Text style={styles.tradeMetricLabel}>Net Position</Text>
                    <Text style={styles.tradeMetricValue}>
                      ${totalValue.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={[styles.tradeMetricBlock, styles.tradeMetricBottomRight]}>
                    <Text style={styles.tradeMetricLabel}>Duration</Text>
                    <Text style={styles.tradeMetricValue}>
                      {tradeDuration}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.optionsGridContainer}>
                  <Text style={styles.optionsGridTitle}>Options Data</Text>
                  <Text style={styles.optionsGridSubtitle}>
                    Live monitoring - Last update: {lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                  
                  <View style={styles.tradeOptionsGrid}>
                    <View style={styles.tradeOptionsBlock}>
                      <Text style={styles.tradeOptionsLabel}>Delta</Text>
                      <Text style={styles.tradeOptionsValue}>
                        {trade.deltaValue?.toFixed(2) || "0.00"}
                      </Text>
                      <Text style={styles.optionsTrend}>
                        {trade.type === 'CALL' ? '↑ as price ↑' : '↓ as price ↑'}
                      </Text>
                    </View>
                    
                    <View style={styles.tradeOptionsBlock}>
                      <Text style={styles.tradeOptionsLabel}>Theta</Text>
                      <Text style={styles.tradeOptionsValue}>
                        {trade.thetaValue?.toFixed(2) || "-0.05"}
                      </Text>
                      <Text style={styles.optionsTrend}>
                        ${(Math.abs((trade.thetaValue || -0.05) * (trade.quantity || 1))).toFixed(2)}/day
                      </Text>
                    </View>
                    
                    <View style={styles.tradeOptionsBlock}>
                      <Text style={styles.tradeOptionsLabel}>IV %</Text>
                      <Text style={styles.tradeOptionsValue}>
                        {trade.impliedVolatility?.toFixed(1) || "30.0"}
                      </Text>
                      <Text style={[
                        styles.optionsTrend, 
                        { color: (trade.impliedVolatility || 0) > 30 ? theme.colors.warning : theme.colors.textSecondary }
                      ]}>
                        {(trade.impliedVolatility || 0) > 30 ? "High" : "Normal"}
                      </Text>
                    </View>
                    
                    <View style={styles.tradeOptionsBlock}>
                      <Text style={styles.tradeOptionsLabel}>Cost Basis</Text>
                      <Text style={styles.tradeOptionsValue}>
                        ${trade.costBasis?.toFixed(2) || (trade.entry * (trade.quantity || 1)).toFixed(2)}
                      </Text>
                      <Text style={styles.optionsTrend}>
                        {trade.quantity || 1} contract{(trade.quantity || 1) > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Add Risk Management Section */}
                <View style={styles.riskManagementContainer}>
                  <Text style={styles.riskManagementTitle}>Risk Management</Text>
                  
                  <View style={styles.riskMetricsGrid}>
                    <View style={styles.riskMetricBlock}>
                      <Text style={styles.riskMetricLabel}>Break Even</Text>
                      <Text style={styles.riskMetricValue}>
                        ${(trade.type === 'CALL' ? 
                          trade.strikePrice || trade.entry : 
                          trade.strikePrice || trade.entry
                        ).toFixed(2)}
                      </Text>
                    </View>
                    
                    <View style={styles.riskMetricBlock}>
                      <Text style={styles.riskMetricLabel}>Max Loss</Text>
                      <Text style={[styles.riskMetricValue, {color: theme.colors.danger}]}>
                        ${(trade.costBasis || (trade.entry * (trade.quantity || 1))).toFixed(2)}
                      </Text>
                    </View>
                    
                    <View style={styles.riskMetricBlock}>
                      <Text style={styles.riskMetricLabel}>Monitoring</Text>
                      <View style={styles.monitoringStatus}>
                        <View style={[
                          styles.monitoringIndicator, 
                          {backgroundColor: isProfit ? theme.colors.success : theme.colors.warning}
                        ]} />
                        <Text style={styles.monitoringStatusText}>
                          {isProfit ? 'Active - In Profit' : 'Active - Watching'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.riskMetricBlock}>
                      <Text style={styles.riskMetricLabel}>Auto-Close</Text>
                      <View style={styles.monitoringStatus}>
                        <View style={styles.monitoringIndicator} />
                        <Text style={styles.monitoringStatusText}>
                          {Math.abs(trade.progress || 0) > 90 ? 'Preparing' : 'Ready'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* Enhanced Market Context Section with broader market data and news */}
                <View style={styles.marketContextContainer}>
                  <View style={styles.marketContextHeader}>
                    <Text style={styles.marketContextTitle}>Market Context</Text>
                    <View style={[
                      styles.marketContextBadge, 
                      { backgroundColor: trade.type === 'CALL' ? '#E3F2FD' : '#FFEBEE' }
                    ]}>
                      <Text style={styles.marketContextBadgeText}>
                        {trade.type === 'CALL' ? 'Bullish' : 'Bearish'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Add sector and index performance */}
                  <View style={styles.marketStatsContainer}>
                    <View style={styles.marketStatItem}>
                      <Text style={styles.marketStatItemLabel}>{trade.symbol}</Text>
                      <Text style={[
                        styles.marketStatItemValue, 
                        { color: isProfit ? theme.colors.success : theme.colors.danger }
                      ]}>
                        {isProfit ? '+' : ''}{trade.percentROI?.toFixed(2)}%
                      </Text>
                    </View>
                    
                    <View style={styles.marketStatItem}>
                      <Text style={styles.marketStatItemLabel}>{trade.sectorPerformance?.name}</Text>
                      <Text style={[
                        styles.marketStatItemValue, 
                        { color: Number(trade.sectorPerformance?.change) >= 0 ? theme.colors.success : theme.colors.danger }
                      ]}>
                        {Number(trade.sectorPerformance?.change) >= 0 ? '+' : ''}{trade.sectorPerformance?.change}%
                      </Text>
                    </View>
                    
                    <View style={styles.marketStatItem}>
                      <Text style={styles.marketStatItemLabel}>{trade.indexInfo?.name}</Text>
                      <Text style={[
                        styles.marketStatItemValue, 
                        { color: Number(trade.indexInfo?.change) >= 0 ? theme.colors.success : theme.colors.danger }
                      ]}>
                        {Number(trade.indexInfo?.change) >= 0 ? '+' : ''}{trade.indexInfo?.change}%
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.marketContextDescription}>
                    {trade.type === 'CALL' ? 
                      `${trade.symbol} showing ${isProfit ? 'strong' : 'moderate'} upward momentum with ${trade.indexInfo?.name} ${trade.indexInfo?.indication}. Monitoring key resistance at $${(trade.currentPrice ? trade.currentPrice * 1.02 : trade.target).toFixed(2)}.` : 
                      `${trade.symbol} showing ${isProfit ? 'strong' : 'moderate'} downward pressure with ${trade.indexInfo?.name} ${trade.indexInfo?.indication}. Watching support at $${(trade.currentPrice ? trade.currentPrice * 0.98 : trade.target).toFixed(2)}.`
                    }
                  </Text>
                  
                  {/* Add relevant news headlines */}
                  <View style={styles.newsContainer}>
                    <Text style={styles.newsTitle}>Latest News</Text>
                    
                    {trade.relatedNews?.map((news, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.newsItem}
                        onPress={() => Alert.alert('Open Link', `This would open ${news.url} in your browser.`)}
                      >
                        <View style={styles.newsHeader}>
                          <Text style={styles.newsSource}>{news.source}</Text>
                          <Text style={styles.newsTime}>
                            {news.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Text>
                        </View>
                        
                        <Text style={styles.newsHeadline}>{news.headline}</Text>
                        
                        <View style={[
                          styles.newsSentimentBadge, 
                          { 
                            backgroundColor: 
                              news.sentiment === 'positive' ? 'rgba(46, 204, 113, 0.1)' : 
                              news.sentiment === 'negative' ? 'rgba(231, 76, 60, 0.1)' : 
                              'rgba(189, 189, 189, 0.1)' 
                          }
                        ]}>
                          <Text style={[
                            styles.newsSentimentText,
                            {
                              color: 
                                news.sentiment === 'positive' ? theme.colors.success : 
                                news.sentiment === 'negative' ? theme.colors.danger : 
                                theme.colors.textSecondary
                            }
                          ]}>
                            {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progress, 
                        { 
                          width: `${Math.max(0, Math.min(100, (trade.progress || 0) + 100) / 2)}%`,
                          backgroundColor: isProfit ? theme.colors.success : theme.colors.danger
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {isProfit ? 
                      `${Math.abs(trade.progress || 0)}% to target (${trade.type})` : 
                      `${Math.abs(trade.progress || 0)}% to stop loss (${trade.type})`}
                  </Text>
                </View>
                
                <View style={styles.tradeActionRow}>
                  <TouchableOpacity 
                    style={[styles.tradeActionButton, styles.tradeCloseButton]}
                    onPress={() => simulateCloseTrade(trade)}
                  >
                    <Text style={styles.tradeActionButtonText}>Close Position</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.tradeActionButton, styles.tradeAdjustButton]}
                    onPress={() => Alert.alert('Adjust Stop/Target', 'This feature will allow you to adjust your stop loss and price targets.')}
                  >
                    <Text style={styles.tradeActionButtonText}>Adjust Stop/Target</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="pulse-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>No active trades. Execute trades from the Recommendations tab.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Trade Journal Screen
const TradeJournalScreen = ({ entries }: { entries: JournalEntry[] }) => {
  // Generate chart data for journal entries
  const getJournalChartData = (entry: JournalEntry) => {
    // Generate realistic-looking price data
    const isProfit = entry.profit > 0;
    const dataPoints = 5;
    const priceData = [];
    const startPrice = entry.entryPrice;
    const endPrice = entry.exitPrice;
    const priceRange = Math.abs(endPrice - startPrice);
    
    for (let i = 0; i < dataPoints; i++) {
      if (i === 0) {
        priceData.push(startPrice);
      } else if (i === dataPoints - 1) {
        priceData.push(endPrice);
      } else {
        // Create a curve that goes in the direction of the trade result
        const progress = i / (dataPoints - 1);
        let midPoint;
        
        if (isProfit) {
          // For profit trades, go above the exit price a bit in the middle
          midPoint = startPrice + (priceRange * 1.2 * Math.sin(progress * Math.PI));
        } else {
          // For loss trades, go below the exit price a bit in the middle
          midPoint = startPrice - (priceRange * 0.8 * Math.sin(progress * Math.PI)) + priceRange;
        }
        
        // Add some randomness
        const jitter = priceRange * 0.1 * (Math.random() - 0.5);
        priceData.push(midPoint + jitter);
      }
    }
    
    return {
      labels: ["", "", "", "", ""],
      datasets: [
        {
          data: priceData,
          color: (opacity = 1) => isProfit 
            ? `rgba(46, 204, 113, ${opacity})` 
            : `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };
  
  // Calculate return percentage
  const getReturnPercentage = (entry: JournalEntry) => {
    return ((entry.exitPrice - entry.entryPrice) / entry.entryPrice * 100).toFixed(2);
  };
  
  return (
    <ScrollView style={styles.content}>
      <View style={styles.container}>
        <Text style={styles.heading}>Trade Journal</Text>
        <Text style={styles.subheading}>Review your trading history</Text>
        
        <View style={styles.journalSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Trades</Text>
            <Text style={styles.summaryValue}>{entries.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Win Rate</Text>
            <Text style={styles.summaryValue}>
              {Math.round((entries.filter(e => e.profit > 0).length / entries.length) * 100)}%
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg. Return</Text>
            <Text style={styles.summaryValue}>
              {entries.length > 0 
                ? (entries.reduce((sum, entry) => sum + ((entry.exitPrice - entry.entryPrice) / entry.entryPrice) * 100, 0) / entries.length).toFixed(2)
                : 0}%
            </Text>
          </View>
        </View>
        
        {entries.map(entry => {
          const chartData = getJournalChartData(entry);
          const returnPercentage = getReturnPercentage(entry);
          const isProfit = entry.profit > 0;
          
          return (
            <View 
              key={entry.id}
              style={[
                styles.journalCard,
                { borderLeftWidth: 4, borderLeftColor: isProfit ? theme.colors.success : theme.colors.danger }
              ]}
            >
              <View style={styles.tradeHeader}>
                <Text style={styles.tradeSymbol}>{entry.symbol}</Text>
                <Text 
                  style={[
                    styles.tradeProfit, 
                    { color: isProfit ? theme.colors.success : theme.colors.danger }
                  ]}
                >
                  {isProfit ? '+' : ''}{entry.profit.toFixed(2)} ({returnPercentage}%)
                </Text>
              </View>
              
              <View style={styles.journalChartRow}>
                <View style={styles.journalDetails}>
                  <Text style={styles.tradeDetails}>
                    Entry: ${entry.entryPrice.toFixed(2)} • Exit: ${entry.exitPrice.toFixed(2)}
                  </Text>
                  <Text style={styles.tradeSetup}>{entry.setup}</Text>
                  <Text style={styles.tradeDate}>
                    {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
                
                <View style={styles.miniChartContainer}>
                  <LineChart
                    data={chartData}
                    width={100}
                    height={60}
                    chartConfig={isProfit ? chartConfig : negativeChartConfig}
                    bezier
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withHorizontalLabels={false}
                    withVerticalLabels={false}
                    style={styles.miniChart}
                  />
                </View>
              </View>
              
              <Text style={styles.lessonText}>{entry.lesson}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

// Settings Screen
const SettingsScreen = ({ 
  settings, 
  onUpdateSettings 
}: { 
  settings: { 
    riskPerTrade: number, 
    accountSize: number, 
    notificationsEnabled: boolean,
    darkModeEnabled: boolean
  }, 
  onUpdateSettings: (newSettings: Partial<typeof settings>) => void
}) => {
  const [riskPerTrade, setRiskPerTrade] = React.useState(settings.riskPerTrade.toString());
  const [accountSize, setAccountSize] = React.useState(settings.accountSize.toString());

  const saveSettings = () => {
    onUpdateSettings({
      riskPerTrade: parseFloat(riskPerTrade) || 2,
      accountSize: parseFloat(accountSize) || 10000,
    });
    Alert.alert('Settings Saved', 'Your settings have been updated successfully.');
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>
        <Text style={styles.subheading}>Customize your trading preferences</Text>
        
        <View style={styles.settingsFormCard}>
          <Text style={styles.settingsFormLabel}>Risk per Trade (%)</Text>
          <TextInput
            style={styles.settingsFormInput}
            value={riskPerTrade}
            onChangeText={setRiskPerTrade}
            keyboardType="numeric"
            placeholder="Enter risk percentage"
          />
          
          <Text style={styles.settingsFormLabel}>Account Size ($)</Text>
          <TextInput
            style={styles.settingsFormInput}
            value={accountSize}
            onChangeText={setAccountSize}
            keyboardType="numeric"
            placeholder="Enter account size"
          />
          
          <View style={styles.settingsToggleRow}>
            <Text style={styles.settingsFormLabel}>Notifications</Text>
            <TouchableOpacity
              onPress={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              style={styles.settingsToggleButton}
            >
              <View style={[
                styles.toggleTrack, 
                { backgroundColor: settings.notificationsEnabled ? theme.colors.secondary : '#E0E0E0' }
              ]}>
                <View style={[
                  styles.toggleThumb, 
                  { transform: [{ translateX: settings.notificationsEnabled ? 20 : 0 }] }
                ]} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsToggleRow}>
            <Text style={styles.settingsFormLabel}>Dark Mode</Text>
            <TouchableOpacity
              onPress={() => onUpdateSettings({ darkModeEnabled: !settings.darkModeEnabled })}
              style={styles.settingsToggleButton}
            >
              <View style={[
                styles.toggleTrack, 
                { backgroundColor: settings.darkModeEnabled ? theme.colors.secondary : '#E0E0E0' }
              ]}>
                <View style={[
                  styles.toggleThumb, 
                  { transform: [{ translateX: settings.darkModeEnabled ? 20 : 0 }] }
                ]} />
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.saveSettingsButton}
            onPress={saveSettings}
          >
            <Text style={styles.saveSettingsButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Trading App</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Trading App helps you discover trading opportunities and manage your active trades efficiently.
          </Text>
          
          <TouchableOpacity style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 80, // Add padding for tab bar
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tradeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedTradeCard: {
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  activeTradeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  journalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tradeType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  callType: {
    backgroundColor: '#E3F2FD',
  },
  putType: {
    backgroundColor: '#FFEBEE',
  },
  tradeTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tradeDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  tradeSetup: {
    fontSize: 14,
    color: theme.colors.text,
  },
  tradeProfit: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progress: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  lessonText: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginTop: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  executeButtonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    paddingBottom: 0,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  executeButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  closeTradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeTradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tradeDetailsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  tradeDetailItem: {
    flex: 1,
  },
  tradeDetailLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tradeDetailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  tradeDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 3,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  journalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  journalChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalDetails: {
    flex: 1,
  },
  miniChartContainer: {
    width: 100,
    height: 60,
  },
  miniChart: {
    borderRadius: 12,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardCardPrimary: {
    backgroundColor: '#E3F2FD',
  },
  dashboardCardSecondary: {
    backgroundColor: '#FFEBEE',
  },
  dashboardCardSuccess: {
    backgroundColor: '#DCEDC8',
  },
  dashboardCardInfo: {
    backgroundColor: '#FFF9C4',
  },
  dashboardValue: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  dashboardLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  marketStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketStat: {
    flex: 1,
    alignItems: 'center',
  },
  marketStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  marketStatValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  positiveValue: {
    color: theme.colors.success,
  },
  viewTradesButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  viewTradesButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  settingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsFormCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingsFormLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  settingsFormInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsToggleButton: {
    padding: 8,
  },
  toggleTrack: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    width: 40,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  saveSettingsButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveSettingsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  aboutDescription: {
    fontSize: 14,
    color: theme.colors.text,
  },
  aboutLink: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  aboutLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tradeMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  tradeMetric: {
    flex: 1,
    alignItems: 'center',
  },
  tradeMetricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tradeMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tradeRecoScreen: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 4,
    margin: 16,
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  activeTabButtonText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  executeButtonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
  selectedCountBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectedCountText: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 80, // Increase from 16 to 80 to be well above the tab bar
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    paddingBottom: 0,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  portfolioSummaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  portfolioSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  portfolioMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioMetricColumn: {
    flex: 1,
  },
  portfolioMetric: {
    marginBottom: 12,
  },
  portfolioMetricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  portfolioMetricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tradeCardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tradeCardBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tradeSymbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeQuantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  tradeProfitContainer: {
    alignItems: 'flex-end',
  },
  tradeProfitPercent: {
    fontSize: 12,
    marginTop: 2,
  },
  tradeChartAndDetails: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 4,
  },
  tradeDetailsSummary: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  tradeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tradeMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  tradeMetricBlock: {
    width: '50%',
    padding: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  tradeOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  tradeOptionsBlock: {
    width: '24%', // Slightly reduce width to prevent overlapping
    padding: 8,
    marginVertical: 2,
  },
  tradeOptionsLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tradeOptionsValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
  },
  tradeActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tradeActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tradeCloseButton: {
    backgroundColor: theme.colors.primary,
    marginRight: 8,
  },
  tradeAdjustButton: {
    backgroundColor: theme.colors.secondary,
    marginLeft: 8,
  },
  tradeActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  marketStatusContainer: {
    marginBottom: 16,
  },
  marketStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  marketStatusText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  marketUpdateTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activityAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  activityAlertText: {
    fontSize: 12,
    color: theme.colors.warning,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  priceBlock: {
    flex: 1,
    paddingRight: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
  },
  currentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceChangeIcon: {
    marginLeft: 2,
  },
  tradeMetricTopLeft: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  tradeMetricTopRight: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderColor: '#E2E8F0',
  },
  tradeMetricBottomLeft: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  tradeMetricBottomRight: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  optionsGridContainer: {
    marginVertical: 12,
  },
  optionsGridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  optionsGridSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  optionsTrend: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  riskManagementContainer: {
    marginVertical: 12,
  },
  riskManagementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  riskMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  riskMetricBlock: {
    width: '50%',
    padding: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  riskMetricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  riskMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  monitoringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monitoringIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 5,
  },
  monitoringStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
  },
  marketContextContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  marketContextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  marketContextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  marketContextBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  marketContextBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
  },
  marketContextDescription: {
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 18,
  },
  marketStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  marketStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  marketStatItemLabel: { // Renamed from marketStatLabel
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  marketStatItemValue: { // Renamed from marketStatValue
    fontSize: 14,
    fontWeight: '600',
  },
  newsContainer: {
    marginTop: 12,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  newsItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  newsSource: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  newsTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  newsHeadline: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  newsSentimentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newsSentimentText: {
    fontSize: 10,
    fontWeight: '600',
  }
});
