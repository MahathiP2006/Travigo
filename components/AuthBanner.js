import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileContext } from '../context/ProfileContext';

export default function AuthBanner() {
  const { profile, loginDemo, updateProfile } = useContext(ProfileContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = () => {
    if (!email) return;
    updateProfile({
      ...profile,
      username: email.split('@')[0],
      email: email,
      isDemo: false
    });
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.bannerText}>
            <Text style={{ fontWeight: '700' }}>Live Demo:</Text> {profile.username || 'Demo Recruiter'}
          </Text>
        </View>

        <TouchableOpacity style={styles.authBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="person-circle-outline" size={16} color="#7b4eff" />
          <Text style={styles.authBtnText}>Account / Supabase</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalBadge}>FASTAPI + SUPABASE AUTH</Text>
                <Text style={styles.modalTitle}>Authentication & Session</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Current User Session:</Text>
              <Text style={styles.statusValue}>{profile.username}</Text>
              <Text style={styles.statusEmail}>{profile.email || 'recruiter@travigo-demo.com'}</Text>
            </View>

            {/* 1-Click Recruiter Demo Button */}
            <TouchableOpacity
              style={styles.demoLoginBtn}
              onPress={() => {
                loginDemo();
                setModalVisible(false);
              }}
            >
              <Ionicons name="flash" size={18} color="#ffffff" />
              <Text style={styles.demoLoginBtnText}>⚡ Reset to 1-Click Recruiter Demo</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CUSTOM LOGIN</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleCustomLogin}>
              <Text style={styles.submitBtnText}>Sign In / Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ede9fe',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd6fe',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  bannerText: {
    fontSize: 12,
    color: '#4c1d95',
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  authBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7b4eff',
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
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7b4eff',
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e1e2d',
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
  },
  statusEmail: {
    fontSize: 12,
    color: '#7b4eff',
    marginTop: 1,
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b4eff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  demoLoginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
