import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

const POPULAR_DESTINATIONS = [
  { city: 'Madrid, Spain', country: 'Spain', language: 'Spanish', flag: '🇪🇸', daysOffset: 97 },
  { city: 'Tokyo, Japan', country: 'Japan', language: 'Japanese', flag: '🇯🇵', daysOffset: 123 },
  { city: 'Paris, France', country: 'France', language: 'French', flag: '🇫🇷', daysOffset: 145 },
  { city: 'Berlin, Germany', country: 'Germany', language: 'German', flag: '🇩🇪', daysOffset: 82 },
  { city: 'Rome, Italy', country: 'Italy', language: 'Italian', flag: '🇮🇹', daysOffset: 57 }
];

export default function TripManagerScreen() {
  const { activeTrip, updateTrip, getDepartureCountdown, sm2Phrases, updateProfile } = useContext(ProfileContext);
  const [countdown, setCountdown] = useState(getDepartureCountdown());
  const [isEditing, setIsEditing] = useState(false);
  const [destinationInput, setDestinationInput] = useState(activeTrip.destination);

  // Live timer update
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDepartureCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTrip]);

  const masteredCount = sm2Phrases.filter(p => (p.repetitions || 0) >= 3).length;
  const goalCount = activeTrip.goalPhrases || 50;
  const readinessPct = Math.min(100, Math.round((masteredCount / goalCount) * 100));

  const handleSelectDestination = (dest) => {
    const departure = new Date();
    departure.setDate(departure.getDate() + dest.daysOffset);

    const newTrip = {
      ...activeTrip,
      destination: dest.city,
      country: dest.country,
      targetLanguage: dest.language,
      departureDate: departure.toISOString()
    };

    updateTrip(newTrip);
    updateProfile({ learningLanguage: dest.language });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBadge}>RETENTION DRIVER FEATURE</Text>
        <Text style={styles.headerTitle}>Trip Countdown & Goals</Text>
        <Text style={styles.headerSubtitle}>
          Anchoring vocabulary recall to your departure date to drive consistent practice.
        </Text>
      </View>

      {/* Main Countdown Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.destinationBox}>
            <Ionicons name="airplane" size={20} color="#ffffff" />
            <Text style={styles.heroDestination}>{activeTrip.destination}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Active Trip</Text>
          </View>
        </View>

        {/* Big Countdown Timer */}
        <View style={styles.timerRow}>
          <View style={styles.timeUnit}>
            <Text style={styles.timeNumber}>{countdown.days}</Text>
            <Text style={styles.timeLabel}>DAYS</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeNumber}>{String(countdown.hours).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>HOURS</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeNumber}>{String(countdown.minutes).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>MINUTES</Text>
          </View>
        </View>

        <Text style={styles.targetLanguageText}>
          Target Language: <Text style={{ fontWeight: '800' }}>{activeTrip.targetLanguage}</Text>
        </Text>

        {/* Readiness Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>Vocab Departure Readiness</Text>
            <Text style={styles.progressPercentage}>{readinessPct}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${readinessPct}%` }]} />
          </View>
          <Text style={styles.progressCaption}>
            {masteredCount} of {goalCount} travel phrases mastered with SM-2.
          </Text>
        </View>
      </View>

      {/* Daily Target Recommendation Card */}
      <View style={styles.targetCard}>
        <View style={styles.targetIcon}>
          <Ionicons name="calendar-outline" size={24} color="#7b4eff" />
        </View>
        <View style={styles.targetContent}>
          <Text style={styles.targetTitle}>Daily Recommendation</Text>
          <Text style={styles.targetDesc}>
            Practice <Text style={{ fontWeight: '700', color: '#7b4eff' }}>3 phrases per day</Text> to achieve 100% vocabulary mastery before landing!
          </Text>
        </View>
      </View>

      {/* Destination Switcher */}
      <Text style={styles.sectionHeader}>SWITCH TRIP DESTINATION</Text>
      <View style={styles.destList}>
        {POPULAR_DESTINATIONS.map((dest) => {
          const isSelected = activeTrip.destination.includes(dest.country);
          return (
            <TouchableOpacity
              key={dest.city}
              style={[styles.destCard, isSelected && styles.destCardSelected]}
              onPress={() => handleSelectDestination(dest)}
            >
              <Text style={styles.destFlag}>{dest.flag}</Text>
              <View style={styles.destInfo}>
                <Text style={styles.destCity}>{dest.city}</Text>
                <Text style={styles.destLang}>Language: {dest.language}</Text>
              </View>
              <View style={styles.destDaysPill}>
                <Text style={styles.destDaysText}>{dest.daysOffset}d left</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9ff',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1e2d',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: '#7b4eff',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#7b4eff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroDestination: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 12,
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 64,
  },
  timeNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e0e7ff',
    letterSpacing: 1,
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  targetLanguageText: {
    color: '#e0e7ff',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    borderRadius: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressPercentage: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34d399',
    borderRadius: 4,
  },
  progressCaption: {
    color: '#ede9fe',
    fontSize: 11,
  },
  targetCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  targetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetContent: {
    flex: 1,
  },
  targetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  targetDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  destList: {
    gap: 10,
    marginBottom: 20,
  },
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 14,
  },
  destCardSelected: {
    borderColor: '#7b4eff',
    backgroundColor: '#f5f3ff',
  },
  destFlag: {
    fontSize: 26,
  },
  destInfo: {
    flex: 1,
  },
  destCity: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  destLang: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  destDaysPill: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  destDaysText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
  },
});
