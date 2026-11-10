import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';
import { translatePhraseAPI } from '../services/api';

const TRAVEL_CATEGORIES = ['General', 'Dining', 'Emergency', 'Transit', 'Hotel', 'Shopping'];

const QUICK_PROMPTS = [
  'Where is the nearest bathroom',
  'A table for two, please',
  'Can you help me?',
  'How much does this cost?',
  'Take me to the airport, please'
];

export default function TranslatorScreen() {
  const { profile, addSavedPhrase, playAudio } = useContext(ProfileContext);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Dining');
  const [targetLang, setTargetLang] = useState(profile.learningLanguage || 'Spanish');
  const [translationResult, setTranslationResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleTranslate = async (textToTranslate = inputText) => {
    const text = textToTranslate.trim();
    if (!text) return;

    setIsTranslating(true);
    setIsSaved(false);

    try {
      const res = await translatePhraseAPI(text, targetLang, selectedCategory);
      setTranslationResult(res);
      // Auto-play audio on successful translation
      playAudio(res.translated_text, res.language_code);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveToDeck = () => {
    if (!translationResult) return;
    addSavedPhrase(
      translationResult.translated_text,
      translationResult.original_text,
      translationResult.category,
      translationResult.romanization
    );
    setIsSaved(true);
  };

  const handlePlayAudio = () => {
    if (translationResult) {
      setIsPlayingAudio(true);
      playAudio(translationResult.translated_text, translationResult.language_code);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBadge}>UNIFIED BACKEND SERVICE</Text>
        <Text style={styles.headerTitle}>Travel Translator & Audio</Text>
        <Text style={styles.headerSubtitle}>
          Real-time translation paired with native speech synthesis and cultural etiquette tips.
        </Text>
      </View>

      {/* Target Language Selector */}
      <View style={styles.langSelectorRow}>
        {['Spanish', 'French', 'Japanese', 'German', 'Italian'].map((lang) => {
          const isSelected = targetLang === lang;
          return (
            <TouchableOpacity
              key={lang}
              style={[styles.langPill, isSelected && styles.langPillActive]}
              onPress={() => setTargetLang(lang)}
            >
              <Text style={[styles.langPillText, isSelected && styles.langPillTextActive]}>
                {lang}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Travel Scenario Categories */}
      <Text style={styles.sectionLabel}>TRAVEL SCENARIO:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {TRAVEL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          placeholder="Type an English phrase (e.g., 'Where is the metro?')..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <View style={styles.inputActionRow}>
          <TouchableOpacity
            style={[styles.translateBtn, !inputText.trim() && styles.translateBtnDisabled]}
            disabled={!inputText.trim() || isTranslating}
            onPress={() => handleTranslate()}
          >
            {isTranslating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="sparkles" size={16} color="#ffffff" />
                <Text style={styles.translateBtnText}>Translate & Speak</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Travel Prompts */}
      <Text style={styles.sectionLabel}>COMMON TRAVEL PHRASES:</Text>
      <View style={styles.promptsGrid}>
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={styles.promptChip}
            onPress={() => {
              setInputText(prompt);
              handleTranslate(prompt);
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={13} color="#7b4eff" />
            <Text style={styles.promptChipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Translation Result Card */}
      {translationResult && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultCategoryPill}>
              <Text style={styles.resultCategoryText}>{translationResult.category}</Text>
            </View>
            <TouchableOpacity
              style={[styles.audioPillBtn, isPlayingAudio && styles.audioPillBtnActive]}
              onPress={handlePlayAudio}
            >
              <Ionicons
                name={isPlayingAudio ? 'volume-high' : 'volume-medium-outline'}
                size={18}
                color={isPlayingAudio ? '#ffffff' : '#7b4eff'}
              />
              <Text style={[styles.audioPillBtnText, isPlayingAudio && styles.audioPillBtnTextActive]}>
                Play Audio
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.translatedMainText}>{translationResult.translated_text}</Text>

          {translationResult.romanization ? (
            <Text style={styles.translatedRomanization}>
              Pronounce: {translationResult.romanization}
            </Text>
          ) : null}

          <View style={styles.resultDivider} />

          <Text style={styles.originalSubText}>"{translationResult.original_text}"</Text>

          {translationResult.cultural_tip ? (
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={18} color="#0284c7" />
              <Text style={styles.tipText}>{translationResult.cultural_tip}</Text>
            </View>
          ) : null}

          {/* Save to SM-2 Deck Action */}
          <TouchableOpacity
            style={[styles.saveBtn, isSaved && styles.saveBtnSaved]}
            onPress={handleSaveToDeck}
            disabled={isSaved}
          >
            <Ionicons
              name={isSaved ? 'checkmark-circle' : 'add-circle-outline'}
              size={18}
              color={isSaved ? '#10b981' : '#ffffff'}
            />
            <Text style={[styles.saveBtnText, isSaved && styles.saveBtnTextSaved]}>
              {isSaved ? 'Saved to SM-2 Flashcard Deck!' : 'Save & Practice with SM-2'}
            </Text>
          </TouchableOpacity>
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
  langSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  langPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  langPillActive: {
    backgroundColor: '#7b4eff',
    borderColor: '#7b4eff',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  langPillTextActive: {
    color: '#ffffff',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryPillActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#c4b5fd',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryPillTextActive: {
    color: '#7b4eff',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  textInput: {
    fontSize: 15,
    color: '#1e293b',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b4eff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 6,
  },
  translateBtnDisabled: {
    opacity: 0.5,
  },
  translateBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  promptChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    shadowColor: '#7b4eff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 30,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCategoryPill: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
    textTransform: 'uppercase',
  },
  audioPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    gap: 4,
  },
  audioPillBtnActive: {
    backgroundColor: '#7b4eff',
    borderColor: '#7b4eff',
  },
  audioPillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7b4eff',
  },
  audioPillBtnTextActive: {
    color: '#ffffff',
  },
  translatedMainText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  translatedRomanization: {
    fontSize: 14,
    color: '#6366f1',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  originalSubText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0284c7',
  },
  tipText: {
    fontSize: 12,
    color: '#0369a1',
    flex: 1,
    lineHeight: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b4eff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveBtnSaved: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtnTextSaved: {
    color: '#059669',
  },
});
