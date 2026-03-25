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

export default function AddCustomerScreen({ onBack, onSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  function handleAdd() {
    if (!name) {
      Alert.alert('Naam chaincha', 'Customer ko naam halunus');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Customer Thapiyो!',
        `${name} lai udhar book ma thapiyो`,
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
        <Text style={styles.title}>Naya Customer</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>

        <Text style={styles.label}>Naam *</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer ko naam"
          placeholderTextColor="#3d5870"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="98XXXXXXXX"
          placeholderTextColor="#3d5870"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Thegana</Text>
        <TextInput
          style={styles.input}
          placeholder="Ghar ko thegana"
          placeholderTextColor="#3d5870"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0f0d" />
          ) : (
            <Text style={styles.buttonText}>Customer Thapnus</Text>
          )}
        </TouchableOpacity>

      </View>

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
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#9bbfaa',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: '#3ddc84',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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