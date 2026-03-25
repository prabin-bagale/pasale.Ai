import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function InventoryScreen({ onBack }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [minQty, setMinQty] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [loading, setLoading] = useState(false);

  const products = [
    { id: '1', name: 'Tata Salt 1kg',      unit: 'pcs',    current_qty: 45, min_qty_alert: 20, isLow: false },
    { id: '2', name: 'Aashirvaad Atta 5kg', unit: 'bag',    current_qty: 8,  min_qty_alert: 10, isLow: true  },
    { id: '3', name: 'Soyabean Oil 1L',     unit: 'bottle', current_qty: 18, min_qty_alert: 12, isLow: false },
  ];

  function handleAddProduct() {
    if (!name || !qty) {
      Alert.alert('Chaincha', 'Naam ra quantity halunus');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAddProduct(false);
      setName(''); setQty(''); setMinQty('');
      Alert.alert('Product Thapiyो!', `${name} inventory ma thapiyो`);
    }, 1000);
  }

  const lowStock = products.filter(p => p.isLow);

  if (showAddProduct) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowAddProduct(false)}>
            <Text style={styles.back}>← Farka</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Naya Product</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.label}>Product Naam *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tata Salt 1kg"
          placeholderTextColor="#3d5870"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Haal ko Stock *</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#3d5870"
          keyboardType="number-pad"
          value={qty}
          onChangeText={setQty}
        />

        <Text style={styles.label}>Minimum Stock Alert</Text>
        <TextInput
          style={styles.input}
          placeholder="Alert kati ma aucha?"
          placeholderTextColor="#3d5870"
          keyboardType="number-pad"
          value={minQty}
          onChangeText={setMinQty}
        />

        <Text style={styles.label}>Unit</Text>
        <View style={styles.unitRow}>
          {['pcs', 'kg', 'bag', 'bottle', 'box'].map(u => (
            <TouchableOpacity
              key={u}
              style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
              onPress={() => setUnit(u)}
            >
              <Text style={[
                styles.unitBtnText,
                unit === u && styles.unitBtnTextActive
              ]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddProduct}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0a0f0d" />
            : <Text style={styles.buttonText}>Product Thapnus</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Farka</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inventory</Text>
        <TouchableOpacity onPress={() => setShowAddProduct(true)}>
          <Text style={styles.addBtn}>+ Thapnus</Text>
        </TouchableOpacity>
      </View>

      {lowStock.length > 0 && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>
            ⚠️ {lowStock.length} items stock kam chha!
          </Text>
          {lowStock.map(p => (
            <Text key={p.id} style={styles.alertItem}>
              • {p.name} — sirf {p.current_qty} {p.unit} baki
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Sabai Products</Text>

      {products.map(product => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productUnit}>{product.unit}</Text>
          </View>
          <View style={styles.stockInfo}>
            <Text style={[
              styles.stockQty,
              product.isLow ? styles.stockLow : styles.stockOk
            ]}>
              {product.current_qty}
            </Text>
            <Text style={styles.stockLabel}>
              {product.isLow ? '⚠️ Kam chha' : '✓ Thik chha'}
            </Text>
          </View>
        </View>
      ))}

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
    marginBottom: 24,
  },
  back: { color: '#3ddc84', fontSize: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#e2eaf5' },
  addBtn: { color: '#3ddc84', fontSize: 15, fontWeight: 'bold' },
  alertCard: {
    backgroundColor: '#1a1008',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertTitle: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  alertItem: { color: '#9bbfaa', fontSize: 13, marginBottom: 4 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 12,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  productUnit: { fontSize: 12, color: '#3d5870' },
  stockInfo: { alignItems: 'flex-end' },
  stockQty: { fontSize: 24, fontWeight: 'bold' },
  stockOk: { color: '#3ddc84' },
  stockLow: { color: '#f59e0b' },
  stockLabel: { fontSize: 11, color: '#3d5870', marginTop: 2 },
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
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  unitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#141f18',
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  unitBtnActive: {
    backgroundColor: '#3ddc84',
    borderColor: '#3ddc84',
  },
  unitBtnText: { color: '#9bbfaa', fontSize: 13 },
  unitBtnTextActive: { color: '#0a0f0d', fontWeight: 'bold' },
  button: {
    backgroundColor: '#3ddc84',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#0a0f0d', fontSize: 16, fontWeight: 'bold' },
});