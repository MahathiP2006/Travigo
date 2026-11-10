import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function StatsGrid() {
  const { stats, savedPhrases, sm2Phrases } = useContext(ProfileContext);

  const statItems = [
    {
      id: 'retentionScore',
      label: 'SM-2 Retention',
      value: `${stats.retentionScore || 88}%`,
      icon: 'sparkles-outline',
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      id: 'phrasesLearned',
      label: 'Travel Phrases',
      value: Math.max(stats.phrasesLearned, savedPhrases.length),
      icon: 'book-outline',
      color: '#7b4eff',
      bgColor: '#f1ecff'
    },
    {
      id: 'streak',
      label: 'Study Streak',
      value: `${stats.streak} Days`,
      icon: 'flame',
      color: '#ff7a45',
      bgColor: '#fff2e8'
    },
    {
      id: 'dueReview',
      label: 'SM-2 Due Today',
      value: `${sm2Phrases.length}`,
      icon: 'bulb-outline',
      color: '#3b82f6',
      bgColor: '#eff6ff'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>TRAVEL VOCABULARY METRICS</Text>
      <View style={styles.grid}>
        {statItems.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.valueText}>{item.value}</Text>
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#edf0f7',
    shadowColor: '#7b4eff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e1e2d',
  },
  labelText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
});
