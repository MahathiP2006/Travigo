import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';
import ProfileHeader from '../components/ProfileHeader';
import UpcomingTrip from '../components/UpcomingTrip';
import StatsGrid from '../components/StatsGrid';
import AchievementBadges from '../components/AchievementBadges';

export default function DashboardScreen({ onSelectScreen }) {
  const { loading, sm2Phrases, activeTrip } = useContext(ProfileContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7b4eff" />
        <Text style={styles.loadingText}>Loading Travigo Profile...</Text>
      </View>
    );
  }

  const dueCount = sm2Phrases.length;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <ProfileHeader />

      {/* SM-2 Spaced Repetition Call-to-Action Card */}
      <View style={styles.sm2CtaCard}>
        <View style={styles.sm2CtaHeader}>
          <View style={styles.sm2Badge}>
            <Ionicons name="sparkles" size={12} color="#ffffff" />
            <Text style={styles.sm2BadgeText}>SUPERMEMO-2 ENGINE</Text>
          </View>
          <Text style={styles.sm2DueTag}>{dueCount} Due Today</Text>
        </View>

        <Text style={styles.sm2CtaTitle}>Ready for Daily Recall Review?</Text>
        <Text style={styles.sm2CtaSub}>
          Reinforce phrases scheduled by the SM-2 algorithm to prevent memory decay before your flight.
        </Text>

        <TouchableOpacity
          style={styles.sm2StartBtn}
          onPress={() => onSelectScreen && onSelectScreen('Practice')}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={16} color="#ffffff" />
          <Text style={styles.sm2StartBtnText}>Start SM-2 Review ({dueCount} cards)</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Trip Countdown Banner */}
      <UpcomingTrip onNavigateToTrip={() => onSelectScreen && onSelectScreen('TripManager')} />

      {/* Quick Translator Shortcut */}
      <TouchableOpacity
        style={styles.translatorShortcutCard}
        onPress={() => onSelectScreen && onSelectScreen('Translator')}
        activeOpacity={0.8}
      >
        <View style={styles.translatorIconBox}>
          <Ionicons name="globe" size={24} color="#7b4eff" />
        </View>
        <View style={styles.translatorContent}>
          <Text style={styles.translatorTitle}>Unified Translator & Audio</Text>
          <Text style={styles.translatorSub}>Instant scenario translation with native audio speech</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </TouchableOpacity>

      {/* Retention Study Banner (Resume Metric) */}
      <TouchableOpacity
        style={styles.retentionBanner}
        onPress={() => onSelectScreen && onSelectScreen('Retention')}
        activeOpacity={0.8}
      >
        <View style={styles.retentionBadge}>
          <Text style={styles.retentionBadgeText}>+35% NET USAGE LIFT</Text>
        </View>
        <Text style={styles.retentionTitle}>15 Test Users Retention Study</Text>
        <Text style={styles.retentionSub}>
          Explore how trip countdowns & saved audio phrases solved drop-off.
        </Text>
      </TouchableOpacity>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Achievement Badges */}
      <AchievementBadges />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#7b4eff',
    fontSize: 14,
    fontWeight: '600',
  },
  sm2CtaCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  sm2CtaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sm2Badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4338ca',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  sm2BadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sm2DueTag: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: '700',
  },
  sm2CtaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  sm2CtaSub: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 17,
    marginBottom: 16,
  },
  sm2StartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b4eff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  sm2StartBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  translatorShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#edf0f7',
    gap: 12,
  },
  translatorIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  translatorContent: {
    flex: 1,
  },
  translatorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  translatorSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  retentionBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  retentionBadge: {
    backgroundColor: '#059669',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  retentionBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  retentionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065f46',
  },
  retentionSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
});
