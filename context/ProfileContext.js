import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAVEL_PACKS, submitSM2ReviewAPI, playAudio } from '../services/api';

export const ProfileContext = createContext();

const STORAGE_KEYS = {
  PROFILE: '@travigo_profile',
  STATS: '@travigo_stats',
  PHRASES: '@travigo_phrases',
  SM2_DATA: '@travigo_sm2_phrases',
  TRIP: '@travigo_active_trip',
  ACHIEVEMENTS: '@travigo_achievements'
};

const DEFAULT_PROFILE = {
  username: 'Sarah Jenkins',
  email: 'recruiter@travigo-demo.com',
  isDemo: true,
  learningLanguage: 'Spanish'
};

const DEFAULT_TRIP = {
  destination: 'Madrid, Spain',
  country: 'Spain',
  departureDate: '2026-10-15T09:00:00.000Z',
  targetLanguage: 'Spanish',
  goalPhrases: 50,
  dailyGoal: 4
};

const DEFAULT_STATS = {
  studyTime: '14.8h',
  phrasesLearned: 18,
  streak: 14,
  scenarios: 8,
  retentionScore: 88
};

const DEFAULT_ACHIEVEMENTS = [
  { id: '1', title: 'First Steps', description: 'Start learning your first phrases', icon: 'footsteps', unlocked: true },
  { id: '2', title: 'Streak Master', description: 'Maintain a 14-day study streak', icon: 'flame', unlocked: true },
  { id: '3', title: 'SM-2 Scholar', description: 'Complete a spaced-repetition review session', icon: 'bulb', unlocked: true },
  { id: '4', title: 'Trip Ready', description: 'Reach 35% vocabulary departure readiness', icon: 'airplane', unlocked: true }
];

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [activeTrip, setActiveTrip] = useState(DEFAULT_TRIP);
  const [savedPhrases, setSavedPhrases] = useState([]);
  const [sm2Phrases, setSm2Phrases] = useState([]);
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
        const storedStats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
        const storedTrip = await AsyncStorage.getItem(STORAGE_KEYS.TRIP);
        const storedPhrases = await AsyncStorage.getItem(STORAGE_KEYS.PHRASES);
        const storedSM2 = await AsyncStorage.getItem(STORAGE_KEYS.SM2_DATA);
        const storedAchievements = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);

        const activeLang = storedProfile ? JSON.parse(storedProfile).learningLanguage : 'Spanish';

        if (storedProfile) setProfile(JSON.parse(storedProfile));
        if (storedStats) setStats(JSON.parse(storedStats));
        if (storedTrip) setActiveTrip(JSON.parse(storedTrip));
        if (storedAchievements) setAchievements(JSON.parse(storedAchievements));

        const basePhrases = TRAVEL_PACKS[activeLang] || TRAVEL_PACKS.Spanish;

        if (storedPhrases) {
          setSavedPhrases(JSON.parse(storedPhrases));
        } else {
          setSavedPhrases(basePhrases);
        }

        if (storedSM2) {
          setSm2Phrases(JSON.parse(storedSM2));
        } else {
          setSm2Phrases(basePhrases);
        }
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  // Sync profile details
  const updateProfile = async (newProfile) => {
    try {
      const langChanged = newProfile.learningLanguage !== profile.learningLanguage;
      if (langChanged) {
        const updatedPhrases = TRAVEL_PACKS[newProfile.learningLanguage] || TRAVEL_PACKS.Spanish;
        setSavedPhrases(updatedPhrases);
        setSm2Phrases(updatedPhrases);
        await AsyncStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(updatedPhrases));
        await AsyncStorage.setItem(STORAGE_KEYS.SM2_DATA, JSON.stringify(updatedPhrases));

        // Auto update trip destination to match learning language
        const tripMap = {
          Spanish: { destination: 'Madrid, Spain', country: 'Spain', date: '2026-10-15T09:00:00.000Z' },
          Japanese: { destination: 'Tokyo, Japan', country: 'Japan', date: '2026-11-10T14:30:00.000Z' },
          French: { destination: 'Paris, France', country: 'France', date: '2026-12-02T11:00:00.000Z' },
          German: { destination: 'Berlin, Germany', country: 'Germany', date: '2026-09-30T10:00:00.000Z' },
          Italian: { destination: 'Rome, Italy', country: 'Italy', date: '2026-09-05T08:00:00.000Z' }
        };
        const newTripData = tripMap[newProfile.learningLanguage] || tripMap.Spanish;
        const newTrip = {
          ...activeTrip,
          destination: newTripData.destination,
          country: newTripData.country,
          departureDate: newTripData.date,
          targetLanguage: newProfile.learningLanguage
        };
        setActiveTrip(newTrip);
        await AsyncStorage.setItem(STORAGE_KEYS.TRIP, JSON.stringify(newTrip));
      }

      setProfile(newProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Update Trip
  const updateTrip = async (newTrip) => {
    try {
      setActiveTrip(newTrip);
      await AsyncStorage.setItem(STORAGE_KEYS.TRIP, JSON.stringify(newTrip));
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  // Add custom saved phrase (and add to SM-2 queue)
  const addSavedPhrase = async (phraseText, translationText, category = 'General', romanization = '') => {
    try {
      const langMap = {
        Spanish: 'es',
        French: 'fr',
        Japanese: 'ja',
        German: 'de',
        Italian: 'it'
      };
      const langCode = langMap[profile.learningLanguage] || 'es';

      const newPhrase = {
        id: `custom-${Date.now()}`,
        phrase: phraseText,
        translation: translationText,
        language: langCode,
        target_language: profile.learningLanguage,
        romanization: romanization || phraseText,
        category: category || 'Custom',
        cultural_tip: 'Custom phrase saved for travel readiness.',
        repetitions: 0,
        ease_factor: 2.5,
        interval_days: 1,
        retention_score: 40,
        mastery_level: 'Learning'
      };

      const updatedPhrases = [newPhrase, ...savedPhrases];
      const updatedSM2 = [newPhrase, ...sm2Phrases];

      setSavedPhrases(updatedPhrases);
      setSm2Phrases(updatedSM2);

      await AsyncStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(updatedPhrases));
      await AsyncStorage.setItem(STORAGE_KEYS.SM2_DATA, JSON.stringify(updatedSM2));

      // Increment stats
      const updatedStats = {
        ...stats,
        phrasesLearned: stats.phrasesLearned + 1
      };
      setStats(updatedStats);
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error adding saved phrase:', error);
    }
  };

  // Delete saved phrase
  const deleteSavedPhrase = async (id) => {
    try {
      const updatedPhrases = savedPhrases.filter(item => item.id !== id);
      const updatedSM2 = sm2Phrases.filter(item => item.id !== id);
      setSavedPhrases(updatedPhrases);
      setSm2Phrases(updatedSM2);
      await AsyncStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(updatedPhrases));
      await AsyncStorage.setItem(STORAGE_KEYS.SM2_DATA, JSON.stringify(updatedSM2));
    } catch (error) {
      console.error('Error deleting saved phrase:', error);
    }
  };

  // Submit an SM-2 rating (0 - 5) for a phrase
  const submitSM2Review = async (phraseId, quality) => {
    try {
      const current = sm2Phrases.find(p => p.id === phraseId) || {};
      const result = await submitSM2ReviewAPI(phraseId, quality, current);

      const updated = sm2Phrases.map(p => {
        if (p.id === phraseId) {
          return {
            ...p,
            repetitions: result.repetitions,
            ease_factor: result.ease_factor,
            interval_days: result.interval_days,
            retention_score: result.retention_score,
            mastery_level: result.mastery_level,
            last_reviewed_at: new Date().toISOString(),
            scheduled_label: result.scheduled_label
          };
        }
        return p;
      });

      setSm2Phrases(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.SM2_DATA, JSON.stringify(updated));

      // Calculate new overall retention score
      const totalScore = updated.reduce((acc, curr) => acc + (curr.retention_score || 50), 0);
      const avgRetention = Math.round(totalScore / (updated.length || 1));

      const updatedStats = {
        ...stats,
        retentionScore: avgRetention,
        streak: quality >= 3 ? stats.streak : stats.streak
      };
      setStats(updatedStats);
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));

      return result;
    } catch (err) {
      console.error('Error submitting SM-2 review:', err);
    }
  };

  // Compute countdown to departure
  const getDepartureCountdown = () => {
    const departure = new Date(activeTrip.departureDate).getTime();
    const now = Date.now();
    const diff = departure - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, totalHours: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, totalHours: Math.floor(diff / (1000 * 60 * 60)), isPast: false };
  };

  // Recruiter demo login helper
  const loginDemo = () => {
    const demoProfile = {
      username: 'Sarah Jenkins (Demo Traveler)',
      email: 'recruiter@travigo-demo.com',
      isDemo: true,
      learningLanguage: 'Spanish'
    };
    updateProfile(demoProfile);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        stats,
        activeTrip,
        savedPhrases,
        sm2Phrases,
        achievements,
        loading,
        updateProfile,
        updateTrip,
        addSavedPhrase,
        deleteSavedPhrase,
        submitSM2Review,
        getDepartureCountdown,
        loginDemo,
        playAudio
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
