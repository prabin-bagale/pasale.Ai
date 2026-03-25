import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';

export default function AddUdharScreen({ onBack, onSuccess }) {
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSave() {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Amount chaincha', 'Sahi amount halunus');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        type === 'credit' ? 'Udhar Thapiyो!' : 'Payment Thapiyो!',
        `NPR ${amount} successfully logged`,
        [{ text: 'Thik chha', onPress: onSuccess }]
      );
    }, 1000);
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Farka</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Udhar Log Garnus</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.label}>Kun kura?</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'credit' && styles.typeBtnActive]}
          onPress={() => setType('credit')}
        >
          <Text style={[
            styles.typeBtnText,
            type === 'credit' && styles.typeBtnTextActive
          ]}>
            Udhar Diye
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeBtn, type === 'payment' && styles.typeBtnActiveGreen]}
          onPress={() => setType('payment')}
        >
          <Text style={[
            styles.typeBtnText,
            type === 'payment' && styles.typeBtnTextActive
          ]}>
            Paisa Aayo
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount (NPR)</Text>
      <TextInput
        style={styles.amountInput}
        placeholder="0"
        placeholderTextColor="#3d5870"
        keyboardType="number-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Chamal, daal, tel..."
        placeholderTextColor="#3d5870"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity
        style={[
          styles.button,
          type === 'payment' && styles.buttonGreen,
          loading && styles.buttonDisabled
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0a0f0d" />
        ) : (
          <Text style={styles.buttonText}>
            {type === 'credit' ? 'Udhar Save Garnus' : 'Payment Save Garnus'}
          </Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0d',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 32,
  },
  back: {
    color: '#3ddc84',
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2eaf5',
  },
  label: {
    fontSize: 13,
    color: '#9bbfaa',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#141f18',
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  typeBtnActive: {
    backgroundColor: '#f87171',
    borderColor: '#f87171',
  },
  typeBtnActiveGreen: {
    backgroundColor: '#3ddc84',
    borderColor: '#3ddc84',
  },
  typeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9bbfaa',
  },
  typeBtnTextActive: {
    color: '#0a0f0d',
  },
  amountInput: {
    backgroundColor: '#141f18',
    borderRadius: 8,
    padding: 16,
    color: '#3ddc84',
    fontSize: 42,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#1e2d3d',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#141f18',
    borderRadius: 8,
    padding: 16,
    color: '#e2eaf5',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#f87171',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonGreen: {
    backgroundColor: '#3ddc84',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0a0f0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});