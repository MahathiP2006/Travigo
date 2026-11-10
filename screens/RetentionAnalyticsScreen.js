import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RETENTION_STUDY_DATA } from '../services/api';

export default function RetentionAnalyticsScreen() {
  const [selectedCohort, setSelectedCohort] = useState('comparison'); // 'comparison', 'baseline', 'treatment'
  const data = RETENTION_STUDY_DATA;

  const baselineData = data.cohorts[0].data;
  const treatmentData = data.cohorts[1].data;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadgeRow}>
          <Text style={styles.headerBadge}>RESUME METRIC SHOWCASE</Text>
          <View style={styles.metricPill}>
            <Text style={styles.metricPillText}>+35% Return Usage</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Retention & Cohort Study</Text>
        <Text style={styles.headerSubtitle}>
          Empirical validation across 15 test users diagnosing drop-off and proving feature impact.
        </Text>
      </View>

      {/* KPI Overview Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Net Retention Lift</Text>
          <Text style={[styles.kpiValue, { color: '#10b981' }]}>+35%</Text>
          <Text style={styles.kpiSub}>vs Baseline v1</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Test Cohort</Text>
          <Text style={styles.kpiValue}>15</Text>
          <Text style={styles.kpiSub}>Travelers tracked</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Study Window</Text>
          <Text style={styles.kpiValue}>30d</Text>
          <Text style={styles.kpiSub}>Pre-departure</Text>
        </View>
      </View>

      {/* Cohort Retention Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Return Usage Retention Curve</Text>
            <Text style={styles.chartSubtitle}>Active users returning to app over 30 days</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>V2: + Countdown & Audio (46.7%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>V1: Baseline (13.3%)</Text>
          </View>
        </View>

        {/* Bar Comparison Chart */}
        <View style={styles.barsContainer}>
          {treatmentData.map((tItem, index) => {
            const bItem = baselineData[index];
            const diff = Math.round(tItem.pct - bItem.pct);
            return (
              <View key={tItem.day} style={styles.barColumn}>
                <View style={styles.barsPair}>
                  {/* Baseline Bar */}
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${bItem.pct}%`, backgroundColor: '#fca5a5' }]} />
                  </View>
                  {/* Treatment Bar */}
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${tItem.pct}%`, backgroundColor: '#10b981' }]} />
                  </View>
                </View>
                <Text style={styles.dayLabel}>{tItem.day}</Text>
                {diff > 0 && (
                  <View style={styles.diffBadge}>
                    <Text style={styles.diffText}>+{diff}%</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Diagnosis & Findings */}
      <Text style={styles.sectionHeader}>RETENTION DIAGNOSIS & SOLUTIONS</Text>

      <View style={styles.insightCard}>
        <View style={[styles.insightIcon, { backgroundColor: '#fef3c7' }]}>
          <Ionicons name="alert-circle" size={24} color="#d97706" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>The Problem: Premature Drop-Off</Text>
          <Text style={styles.insightDesc}>
            Initial user testing revealed a steep retention drop-off by Day 3 (down to 53%).
            Interviews showed travelers suffered from lack of a tangible finish line and found generic drills boring.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={[styles.insightIcon, { backgroundColor: '#ede9fe' }]}>
          <Ionicons name="airplane" size={24} color="#7b4eff" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Feature 1: Flight Countdown Urgency</Text>
          <Text style={styles.insightDesc}>
            Adding an immutable departure countdown ("14 days until Madrid") converted vague study intentions into a concrete deadline, lifting Day-3 retention by +33.4%.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={[styles.insightIcon, { backgroundColor: '#dcfce7' }]}>
          <Ionicons name="volume-high" size={24} color="#16a34a" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Feature 2: Saved Audio for Commutes</Text>
          <Text style={styles.insightDesc}>
            Travelers requested hands-free listening. Saved audio phrases allowed users to review pronunciation while walking or riding the metro, maintaining 46.7% retention at Day 30.
          </Text>
        </View>
      </View>

      {/* Qualitative Feedback */}
      <Text style={styles.sectionHeader}>15 TEST USERS VERBATIM FEEDBACK</Text>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "Seeing that I had 12 days left until my flight to Tokyo gave me the exact push I needed to practice my 4 phrases every morning."
        </Text>
        <Text style={styles.quoteAuthor}>— Test User #04 (Tokyo Traveler)</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "The SM-2 flashcards didn't waste my time on phrases I already knew. The audio pronunciation button helped me order food with zero anxiety."
        </Text>
        <Text style={styles.quoteAuthor}>— Test User #11 (Madrid Traveler)</Text>
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
    marginBottom: 20,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
    letterSpacing: 0.8,
  },
  metricPill: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  metricPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e1e2d',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  kpiSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  chartHeader: {
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barsPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 4,
  },
  barTrack: {
    width: 12,
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 6,
  },
  diffBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  diffText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#7b4eff',
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
    marginTop: 6,
  },
});
