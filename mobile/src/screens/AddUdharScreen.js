import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';
import { getCustomers, addTransaction } from '../api';

export default function AddUdharScreen({ onBack, onSuccess, shopId }) {
  const [step, setStep] = useState('selectCustomer');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const result = await getCustomers(shopId);
      if (result.customers) {
        setCustomers(result.customers);
      }
    } catch (err) {
      Alert.alert('Error', 'Customers load हुन सकिएन');
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleSave() {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Amount chaincha', 'Sahi amount halunus');
      return;
    }

    setLoading(true);
    try {
      const result = await addTransaction(
        shopId,
        selectedCustomer.id,
        type,
        amount,
        note
      );

      if (result.success) {
        Alert.alert(
          type === 'credit' ? 'Udhar Thapiyो!' : 'Payment Thapiyो!',
          `${selectedCustomer.name} ko lagi NPR ${amount} saved!\nNew balance: NPR ${result.newBalance}`,
          [{ text: 'Thik chha', onPress: onSuccess }]
        );
      } else {
        Alert.alert('Error', result.error || 'Save गर्न सकिएन');
      }
    } catch (err) {
      Alert.alert('Error', 'Server sanga connect हुन सकिएन');
    } finally {
      setLoading(false);
    }
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── STEP 1: Select Customer ──────────────────────
  if (step === 'selectCustomer') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.back}>← Farka</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Kun Customer?</Text>
          <View style={{ width: 60 }} />
        </View>

        <TextInput
          style={styles.search}
          placeholder="Customer khojnus..."
          placeholderTextColor="#3d5870"
          value={search}
          onChangeText={setSearch}
        />

        {loadingCustomers ? (
          <ActivityIndicator color="#3ddc84" size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.customerCard}
                onPress={() => {
                  setSelectedCustomer(item);
                  setStep('addUdhar');
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerPhone}>{item.phone}</Text>
                </View>
                <View style={styles.balanceContainer}>
                  <Text style={[
                    styles.balance,
                    parseFloat(item.balance) > 0 ? styles.balanceOwed : styles.balanceClear
                  ]}>
                    NPR {item.balance}
                  </Text>
                  <Text style={styles.balanceLabel}>
                    {parseFloat(item.balance) > 0 ? 'Baaki' : 'Clear ✓'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Koi customer bhेटिएन
              </Text>
            }
          />
        )}
      </View>
    );
  }

  // ── STEP 2: Add Udhar or Payment ─────────────────
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep('selectCustomer')}>
          <Text style={styles.back}>← Farka</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Udhar Log</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.selectedCustomerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {selectedCustomer.name.charAt(0)}
          </Text>
        </View>
        <View>
          <Text style={styles.selectedName}>{selectedCustomer.name}</Text>
          <Text style={styles.selectedBalance}>
            Haal baaki: NPR {selectedCustomer.balance}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>Kun kura?</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'credit' && styles.typeBtnRed]}
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
          style={[styles.typeBtn, type === 'payment' && styles.typeBtnGreen]}
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
    marginBottom: 20,
  },
  back: { color: '#3ddc84', fontSize: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#e2eaf5' },
  search: {
    backgroundColor: '#141f18',
    borderRadius: 8,
    padding: 14,
    color: '#e2eaf5',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    marginBottom: 16,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1a2920',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#3ddc84',
  },
  avatarText: {
    color: '#3ddc84',
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerInfo: { flex: 1 },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  customerPhone: { fontSize: 13, color: '#3d5870' },
  balanceContainer: { alignItems: 'flex-end' },
  balance: { fontSize: 15, fontWeight: 'bold' },
  balanceOwed: { color: '#f87171' },
  balanceClear: { color: '#3ddc84' },
  balanceLabel: { fontSize: 11, color: '#3d5870', marginTop: 2 },
  emptyText: {
    color: '#3d5870',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  selectedCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3ddc84',
    gap: 14,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  selectedBalance: { fontSize: 13, color: '#9bbfaa' },
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
  typeBtnRed: {
    backgroundColor: '#f87171',
    borderColor: '#f87171',
  },
  typeBtnGreen: {
    backgroundColor: '#3ddc84',
    borderColor: '#3ddc84',
  },
  typeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9bbfaa',
  },
  typeBtnTextActive: { color: '#0a0f0d' },
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
    marginBottom: 40,
  },
  buttonGreen: { backgroundColor: '#3ddc84' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#0a0f0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});