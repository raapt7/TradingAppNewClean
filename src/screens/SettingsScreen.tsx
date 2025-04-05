import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface ColorSettings {
  success: string;
  danger: string;
}

// Preset color options
const successColorOptions = [
  '#2ECC71', // Default green
  '#27AE60', // Darker green
  '#58D68D', // Lighter green
  '#1ABC9C', // Teal
  '#00C853', // Material green
];

const dangerColorOptions = [
  '#E74C3C', // Default red
  '#C0392B', // Darker red
  '#F1948A', // Lighter red
  '#E53935', // Material red
  '#FF5252', // Bright red
];

export function SettingsScreen() {
  const [colors, setColors] = useState<ColorSettings>({
    success: theme.colors.success,
    danger: theme.colors.danger,
  });

  const handleColorChange = (type: keyof ColorSettings, color: string) => {
    setColors(prev => ({
      ...prev,
      [type]: color,
    }));
    // Here we would also update the theme colors globally
    // This would require setting up a theme context or similar
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Settings</Text>
        <Text style={styles.sectionDescription}>
          Customize the colors used throughout the app to match your preferences
        </Text>

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Profit Color</Text>
          <View style={styles.colorOptionsContainer}>
            {successColorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  colors.success === color && styles.selectedColorOption
                ]}
                onPress={() => handleColorChange('success', color)}
              >
                {colors.success === color && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Loss Color</Text>
          <View style={styles.colorOptionsContainer}>
            {dangerColorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  colors.danger === color && styles.selectedColorOption
                ]}
                onPress={() => handleColorChange('danger', color)}
              >
                {colors.danger === color && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Preview</Text>
        <View style={styles.previewContainer}>
          <View style={[styles.previewItem, { backgroundColor: colors.success }]}>
            <Text style={styles.previewText}>Profit: +2.45%</Text>
          </View>
          <View style={[styles.previewItem, { backgroundColor: colors.danger }]}>
            <Text style={styles.previewText}>Loss: -1.23%</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={() => setColors({
        success: theme.colors.success,
        danger: theme.colors.danger,
      })}>
        <Text style={styles.resetButtonText}>Reset to Default Colors</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    borderRadius: 12,
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.text,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  previewItem: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: theme.colors.secondary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 