import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: '1',
    user: 'Sarah',
    message: 'Anyone watching AAPL today? Looks like it might break out.',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    user: 'Mike',
    message: 'Yeah, volume is picking up nicely. RSI showing good momentum too.',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    user: 'Alex',
    message: 'Be careful of the resistance at 190. Might need a catalyst to break through.',
    timestamp: '10:35 AM',
  },
];

export const CommunityScreen = () => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Trading Community</Text>
        <Text style={styles.subtitle}>Connect with fellow traders</Text>
      </View>

      <ScrollView style={styles.chatContainer}>
        {MOCK_MESSAGES.map((msg) => (
          <View key={msg.id} style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <Text style={styles.username}>{msg.user}</Text>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
            <Text style={styles.messageText}>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={message.trim() ? theme.colors.secondary : theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    padding: theme.spacing.md,
  } as ViewStyle,
  messageContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  } as ViewStyle,
  username: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.secondary,
    fontWeight: '600',
  } as TextStyle,
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  } as TextStyle,
  messageText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  } as ViewStyle,
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    color: theme.colors.text,
    maxHeight: 100,
  } as TextStyle,
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
}); 