import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProfileProvider } from './context/ProfileContext';

import AuthBanner from './components/AuthBanner';
import BottomNav from './components/BottomNav';

import DashboardScreen from './screens/DashboardScreen';
import PracticeScreen from './screens/PracticeScreen';
import TranslatorScreen from './screens/TranslatorScreen';
import PhrasebookScreen from './screens/PhrasebookScreen';
import TripManagerScreen from './screens/TripManagerScreen';
import RetentionAnalyticsScreen from './screens/RetentionAnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';

function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen onSelectScreen={setCurrentScreen} />;
      case 'Practice':
        return <PracticeScreen onSelectScreen={setCurrentScreen} />;
      case 'Translator':
        return <TranslatorScreen onSelectScreen={setCurrentScreen} />;
      case 'Phrasebook':
        return <PhrasebookScreen onSelectScreen={setCurrentScreen} />;
      case 'TripManager':
        return <TripManagerScreen onSelectScreen={setCurrentScreen} />;
      case 'Retention':
        return <RetentionAnalyticsScreen onSelectScreen={setCurrentScreen} />;
      case 'Settings':
        return <SettingsScreen onSelectScreen={setCurrentScreen} />;
      default:
        return <DashboardScreen onSelectScreen={setCurrentScreen} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        {/* Recruiter Live Demo & Auth Banner */}
        <AuthBanner />

        {/* Active Screen View */}
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>

        {/* Bottom Tab Bar */}
        <BottomNav currentScreen={currentScreen} onSelectScreen={setCurrentScreen} />
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <MainNavigator />
      </ProfileProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Looks beautiful on desktop web while naturally fitting mobile screens
    alignSelf: 'center',
    backgroundColor: '#f8f9ff',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e2e8f0',
  },
  screenContainer: {
    flex: 1,
  },
});
