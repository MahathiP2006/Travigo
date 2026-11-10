import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function PhrasebookScreen({ navigation }) {
  const { savedPhrases, addSavedPhrase, deleteSavedPhrase, playAudio, profile } = useContext(ProfileContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingId, setPlayingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const categories = ['All', 'Emergency', 'Dining', 'Shopping', 'Transit', 'Hotel', 'Custom'];

  const filteredPhrases = savedPhrases.filter((item) => {
    const matchesSearch =
      (item.phrase && item.phrase.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.translation && item.translation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSpeak = (item) => {
    setPlayingId(item.id);
    playAudio(item.phrase, item.language || 'es');
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleCreatePhrase = () => {
    if (!newPhrase.trim() || !newTranslation.trim()) {
      Alert.alert('Incomplete Fields', 'Please enter both the phrase and translation.');
      return;
    }
    addSavedPhrase(newPhrase.trim(), newTranslation.trim(), newCategory);
    setNewPhrase('');
    setNewTranslation('');
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.category || 'General'}</Text>
          </View>
          <View style={styles.masteryPill}>
            <Text style={styles.masteryText}>{item.mastery_level || 'Learning'}</Text>
          </View>
        </View>

        <Text style={styles.phraseText}>{item.phrase}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>

        {item.romanization ? (
          <Text style={styles.romanizationText}>🗣️ "{item.romanization}"</Text>
        ) : null}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.playBtnActive]}
            onPress={() => handleSpeak(item)}
          >
            <Ionicons
              name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
              size={18}
              color={isPlaying ? '#ffffff' : '#7b4eff'}
            />
            <Text style={[styles.playBtnText, isPlaying && styles.playBtnTextActive]}>
              {isPlaying ? 'Playing...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteSavedPhrase(item.id)}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBadge}>COMMUTE-FRIENDLY AUDIO</Text>
          <Text style={styles.headerTitle}>Saved Audio Phrasebook</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search phrases or translations..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter Scroll */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Phrases List */}
      <FlatList
        data={filteredPhrases}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={44} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No phrases found</Text>
            <Text style={styles.emptySub}>Add a new phrase or try a different filter.</Text>
          </View>
        }
      />

      {/* Add Phrase Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Travel Phrase</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{profile.learningLanguage} Phrase:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`e.g. ¿Dónde está la estación?`}
              value={newPhrase}
              onChangeText={setNewPhrase}
            />

            <Text style={styles.inputLabel}>English Translation:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Where is the station?"
              value={newTranslation}
              onChangeText={setNewTranslation}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCreatePhrase}>
              <Text style={styles.modalSaveBtnText}>Save & Add to SM-2 Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b4eff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#7b4eff',
    borderColor: '#7b4eff',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  masteryPill: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  masteryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7b4eff',
  },
  phraseText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  romanizationText: {
    fontSize: 12,
    color: '#6366f1',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    gap: 6,
  },
  playBtnActive: {
    backgroundColor: '#7b4eff',
    borderColor: '#7b4eff',
  },
  playBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7b4eff',
  },
  playBtnTextActive: {
    color: '#ffffff',
  },
  deleteBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e1e2d',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  modalSaveBtn: {
    backgroundColor: '#7b4eff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSaveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
