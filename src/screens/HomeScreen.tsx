import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../../App';
import { theme } from '../theme';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type MenuItem = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof TabParamList | keyof RootStackParamList;
  params?: any;
};

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const menuItems: MenuItem[] = [
    {
      title: "Today's Trade Recommendations",
      description: "View curated trade opportunities for today",
      icon: "trending-up",
      route: "TodaysPlays"
    },
    {
      title: "Trades in Action",
      description: "Monitor your active trades in real-time",
      icon: "pulse",
      route: "ActiveTrades"
    },
    {
      title: "Trade Journal",
      description: "Review and analyze your trading history",
      icon: "journal",
      route: "TradeJournal"
    },
    {
      title: "Community",
      description: "Connect and chat with fellow traders",
      icon: "people",
      route: "Community"
    }
  ];

  const handleNavigation = (item: MenuItem) => {
    navigation.navigate(item.route, item.params);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => handleNavigation(item)}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={item.icon} 
                size={32} 
                color={theme.colors.secondary}
              />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  } as ViewStyle,
  welcomeText: {
    fontSize: theme.typography.h1.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  menuGrid: {
    padding: theme.spacing.md,
  } as ViewStyle,
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  } as ViewStyle,
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  menuTitle: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  } as TextStyle,
  menuDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
}); 