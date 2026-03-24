import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import OTPScreen from './OTPScreen';

export default function LoginScreen({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  function handleSendOTP() {
    if (!phone || phone.length !== 10) {
      Alert.alert('Galat number', 'Nepal ko 10 digit phone number halunus');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  }

  // Show OTP screen after OTP is sent
  if (otpSent) {
    return (
      <OTPScreen
        phone={phone}
        onSuccess={onLoginSuccess}
      />
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>पसले AI</Text>
      <Text style={styles.tagline}>Nepal ko Digital Khata Book</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Aaphno phone number halunus</Text>

        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryText}>+977</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="98XXXXXXXX"
            placeholderTextColor="#3d5870"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0f0d" />
          ) : (
            <Text style={styles.buttonText}>OTP Pathaunus</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Free 30 din trial — card chaincha
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3ddc84',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#9bbfaa',
    fontStyle: 'italic',
    marginBottom: 48,
  },
  card: {
    width: '100%',
    backgroundColor: '#141f18',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  label: {
    fontSize: 14,
    color: '#9bbfaa',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCode: {
    backgroundColor: '#1a2920',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  countryText: {
    color: '#9bbfaa',
    fontSize: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a2920',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#e2eaf5',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#3ddc84',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0a0f0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    color: '#3d5870',
  },
});