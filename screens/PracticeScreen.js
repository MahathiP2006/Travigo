import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function PracticeScreen({ navigation }) {
  const { sm2Phrases, submitSM2Review, playAudio, profile } = useContext(ProfileContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  const currentPhrase = sm2Phrases[currentIndex] || sm2Phrases[0];

  const handleRating = async (quality) => {
    if (!currentPhrase) return;
    await submitSM2Review(currentPhrase.id, quality);
    setSessionReviewed(prev => prev + 1);

    if (currentIndex + 1 < sm2Phrases.length) {
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      setIsCompleted(true);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsCompleted(false);
    setSessionReviewed(0);
  };

  const handleSpeak = () => {
    if (currentPhrase) {
      playAudio(currentPhrase.phrase, currentPhrase.language || 'es');
    }
  };

  if (!currentPhrase || sm2Phrases.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="book-outline" size={48} color="#7b4eff" />
        <Text style={styles.emptyTitle}>No Phrases to Review</Text>
        <Text style={styles.emptySubtitle}>Add or translate phrases to begin your SM-2 queue.</Text>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.celebrationIcon}>
          <Ionicons name="trophy" size={54} color="#f59e0b" />
        </View>
        <Text style={styles.completedTitle}>Daily Review Complete!</Text>
        <Text style={styles.completedSubtitle}>
          You practiced {sessionReviewed} phrases with the SuperMemo-2 Spaced Repetition engine.
        </Text>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Retention Boost</Text>
            <Text style={styles.statValue}>+14%</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Next Review Due</Text>
            <Text style={styles.statValue}>Tomorrow</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Memory Decay Prevented</Text>
            <Text style={styles.statValue}>SM-2 Curve</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={restartSession}>
          <Text style={styles.primaryBtnText}>Review Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPct = Math.round(((currentIndex + 1) / sm2Phrases.length) * 100);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerBadge}>SUPERMEMO-2 SPACED REPETITION</Text>
          <Text style={styles.headerTitle}>Travel Phrase Recall</Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Card {currentIndex + 1} of {sm2Phrases.length}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
      </View>

      {/* Spaced Repetition Flashcard */}
      <View style={styles.flashcard}>
        <View style={styles.cardTopRow}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag-outline" size={12} color="#7b4eff" />
            <Text style={styles.categoryBadgeText}>{currentPhrase.category || 'General'}</Text>
          </View>
          <View style={styles.sm2Telemetry}>
            <Text style={styles.sm2TelemetryText}>EF: {currentPhrase.ease_factor || 2.5}</Text>
            <Text style={styles.sm2TelemetryDot}>•</Text>
            <Text style={styles.sm2TelemetryText}>Reps: {currentPhrase.repetitions || 0}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.promptLabel}>TRANSLATE TO ENGLISH:</Text>
          <Text style={styles.foreignPhrase}>{currentPhrase.phrase}</Text>

          {currentPhrase.romanization ? (
            <Text style={styles.romanizationText}>🗣️ "{currentPhrase.romanization}"</Text>
          ) : null}

          <TouchableOpacity style={styles.audioSpeakerBtn} onPress={handleSpeak}>
            <Ionicons name="volume-high" size={20} color="#7b4eff" />
            <Text style={styles.audioSpeakerText}>Listen Native Audio</Text>
          </TouchableOpacity>
        </View>

        {/* Revealed Section */}
        {isRevealed ? (
          <View style={styles.revealedSection}>
            <View style={styles.revealDivider} />
            <Text style={styles.englishLabel}>ENGLISH MEANING:</Text>
            <Text style={styles.englishText}>{currentPhrase.translation}</Text>

            {currentPhrase.cultural_tip ? (
              <View style={styles.culturalTipBox}>
                <Ionicons name="airplane-outline" size={16} color="#4338ca" />
                <Text style={styles.culturalTipText}>{currentPhrase.cultural_tip}</Text>
              </View>
            ) : null}

            <View style={styles.retentionPill}>
              <Text style={styles.retentionPillText}>
                Mastery: {currentPhrase.mastery_level || 'Learning'} ({currentPhrase.retention_score || 50}% recall)
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.revealBtn} onPress={() => setIsRevealed(true)}>
            <Ionicons name="eye-outline" size={18} color="#ffffff" />
            <Text style={styles.revealBtnText}>Reveal Answer & Phonetics</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SM-2 Recall Rating Buttons */}
      {isRevealed && (
        <View style={styles.ratingsContainer}>
          <Text style={styles.ratingsHeader}>Rate Your Recall Difficulty (SM-2)</Text>
          <View style={styles.ratingsGrid}>
            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: '#fee2e2', borderColor: '#fca5a5' }]}
              onPress={() => handleRating(1)}
            >
              <Text style={[styles.rateBtnTitle, { color: '#dc2626' }]}>Again</Text>
              <Text style={styles.rateBtnInterval}>1 day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: '#fef3c7', borderColor: '#fcd34d' }]}
              onPress={() => handleRating(2)}
            >
              <Text style={[styles.rateBtnTitle, { color: '#d97706' }]}>Hard</Text>
              <Text style={styles.rateBtnInterval}>1 day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: '#e0e7ff', borderColor: '#a5b4fc' }]}
              onPress={() => handleRating(3)}
            >
              <Text style={[styles.rateBtnTitle, { color: '#4338ca' }]}>Good</Text>
              <Text style={styles.rateBtnInterval}>3 days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: '#d1fae5', borderColor: '#6ee7b7' }]}
              onPress={() => handleRating(4)}
            >
              <Text style={[styles.rateBtnTitle, { color: '#059669' }]}>Easy</Text>
              <Text style={styles.rateBtnInterval}>6 days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: '#ede9fe', borderColor: '#c4b5fd' }]}
              onPress={() => handleRating(5)}
            >
              <Text style={[styles.rateBtnTitle, { color: '#7c3aed' }]}>Mastered</Text>
              <Text style={styles.rateBtnInterval}>14+ days</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9ff',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  badgeContainer: {
    backgroundColor: '#ebe7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7b4eff',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7b4eff',
    borderRadius: 3,
  },
  flashcard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#7b4eff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#edf0f7',
    marginBottom: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
    textTransform: 'uppercase',
  },
  sm2Telemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sm2TelemetryText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  sm2TelemetryDot: {
    color: '#94a3b8',
    fontSize: 10,
  },
  cardBody: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  foreignPhrase: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  romanizationText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#6366f1',
    marginBottom: 16,
    textAlign: 'center',
  },
  audioSpeakerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 6,
  },
  audioSpeakerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7b4eff',
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b4eff',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
    gap: 8,
  },
  revealBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  revealedSection: {
    marginTop: 10,
  },
  revealDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  englishLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  englishText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  culturalTipBox: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  culturalTipText: {
    fontSize: 13,
    color: '#312e81',
    lineHeight: 18,
    flex: 1,
  },
  retentionPill: {
    backgroundColor: '#f8fafc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retentionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  ratingsContainer: {
    marginTop: 8,
  },
  ratingsHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    textAlign: 'center',
  },
  ratingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  rateBtnTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  rateBtnInterval: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9ff',
  },
  celebrationIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e1e2d',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#7b4eff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
});
