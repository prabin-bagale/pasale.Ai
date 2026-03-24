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

export default function OTPScreen({ phone, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  function handleVerify() {
    if (!otp || otp.length !== 6) {
      Alert.alert('Galat OTP', '6 digit OTP halunus');
      return;
    }

    setLoading(true);

    // We will connect to real API later
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>पसले AI</Text>

      <View style={styles.card}>
        <Text style={styles.title}>OTP Verify Garnus</Text>
        <Text style={styles.subtitle}>
          {phone} ma pathako 6-digit code halunus
        </Text>

        <TextInput
          style={styles.input}
          placeholder="• • • • • •"
          placeholderTextColor="#3d5870"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0f0d" />
          ) : (
            <Text style={styles.buttonText}>Verify Garnus</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.resend}>
          OTP aएन? 2 minute khusar garnus
        </Text>
      </View>

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
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3ddc84',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#141f18',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9bbfaa',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1a2920',
    borderRadius: 8,
    paddingVertical: 18,
    color: '#e2eaf5',
    fontSize: 32,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    marginBottom: 20,
    letterSpacing: 12,
  },
  button: {
    backgroundColor: '#3ddc84',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0a0f0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resend: {
    fontSize: 13,
    color: '#3d5870',
    textAlign: 'center',
  },
});