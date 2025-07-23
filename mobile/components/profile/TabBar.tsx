import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const TabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { label: 'Visitor Registration', icon: 'qrcode', library: 'FontAwesome5' },
    { label: 'Attraction Visit History', icon: 'location', library: 'Ionicons' },
    { label: 'Booking History', icon: 'clock', library: 'FontAwesome5' },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.label;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onTabPress(tab.label)}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
          >
            {tab.library === 'FontAwesome5' ? (
              <FontAwesome5
                name={tab.icon}
                size={24}
                color={isActive ? '#60dd8e' : '#64748b'}
              />
            ) : (
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? '#60dd8e' : '#64748b'}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderColor: '#60dd8e',
  },
});
