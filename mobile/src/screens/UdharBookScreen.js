import { getCustomers } from '../api';
import AddCustomerScreen from './AddCustomerScreen';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';

export default function UdharBookScreen({ onBack, shopId}) {
  const [search, setSearch] = useState('');
const [showAddCustomer, setShowAddCustomer] = useState(false);
const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  }

  if (showAddCustomer) {
    return (
      <AddCustomerScreen
        onBack={() => setShowAddCustomer(false)}
        onSuccess={() => setShowAddCustomer(false)}
      />
    );
  }


  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Farka</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Udhar Book</Text>
       <TouchableOpacity onPress={() => setShowAddCustomer(true)}>
          <Text style={styles.addBtn}>+ Thapnus</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Customer khojnus..."
        placeholderTextColor="#3d5870"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView>
        {filtered.map(customer => (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={[
                styles.balance,
                customer.balance > 0 ? styles.balanceOwed : styles.balanceClear
              ]}>
                NPR {customer.balance}
              </Text>
              <Text style={styles.balanceLabel}>
                {customer.balance > 0 ? 'Baaki chha' : 'Clear ✓'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

    </View>
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
  back: {
    color: '#3ddc84',
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2eaf5',
  },
  addBtn: {
    color: '#3ddc84',
    fontSize: 15,
    fontWeight: 'bold',
  },
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
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 13,
    color: '#3d5870',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  balanceOwed: {
    color: '#f87171',
  },
  balanceClear: {
    color: '#3ddc84',
  },
  balanceLabel: {
    fontSize: 11,
    color: '#3d5870',
    marginTop: 2,
  },
});