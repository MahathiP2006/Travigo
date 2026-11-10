import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function BottomNav({ currentScreen, onSelectScreen }) {
  const { sm2Phrases } = useContext(ProfileContext);

  const dueCount = sm2Phrases.length;

  const tabs = [
    { key: 'Dashboard', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { key: 'Practice', label: 'SM-2 Review', icon: 'bulb-outline', activeIcon: 'bulb', badge: dueCount },
    { key: 'Translator', label: 'Translate', icon: 'globe-outline', activeIcon: 'globe' },
    { key: 'Phrasebook', label: 'Audio', icon: 'volume-high-outline', activeIcon: 'volume-high' },
    { key: 'TripManager', label: 'Countdown', icon: 'airplane-outline', activeIcon: 'airplane' },
    { key: 'Retention', label: 'Analytics', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabBtn}
            onPress={() => onSelectScreen(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? '#7b4eff' : '#94a3b8'}
              />
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBtn: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconContainer: {
    position: 'relative',
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#7b4eff',
    fontWeight: '700',
  },
});
