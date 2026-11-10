import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function UpcomingTrip({ onNavigateToTrip }) {
  const { activeTrip, getDepartureCountdown, sm2Phrases } = useContext(ProfileContext);
  const [countdown, setCountdown] = useState(getDepartureCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDepartureCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTrip]);

  const masteredCount = sm2Phrases.filter(p => (p.repetitions || 0) >= 3).length;
  const goalCount = activeTrip.goalPhrases || 50;
  const progress = Math.min(100, Math.round((masteredCount / goalCount) * 100));

  const formattedDate = new Date(activeTrip.departureDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="airplane" size={22} color="#ffffff" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.label}>UPCOMING ADVENTURE</Text>
          <Text style={styles.destination}>{activeTrip.destination}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{countdown.days}d {countdown.hours}h left</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.tripFooter}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Departure Flight</Text>
          <Text style={styles.footerValue}>{formattedDate}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Vocab Departure Readiness</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {onNavigateToTrip && (
          <TouchableOpacity style={styles.actionBtn} onPress={onNavigateToTrip}>
            <Text style={styles.actionBtnText}>View Countdown Details & Target Goals</Text>
            <Ionicons name="arrow-forward" size={14} color="#7b4eff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#7b4eff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#edf0f7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7b4eff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7b4eff',
    letterSpacing: 0.8,
  },
  destination: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e1e2d',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#7b4eff',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  tripFooter: {
    gap: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  footerValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '700',
  },
  progressContainer: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 12,
    color: '#7b4eff',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7b4eff',
    borderRadius: 3,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ff',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b4eff',
  },
});
