import InventoryScreen from './InventoryScreen';
import PaisaReportScreen from './PaisaReportScreen';
import AddUdharScreen from './AddUdharScreen';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import UdharBookScreen from './UdharBookScreen';

export default function DashboardScreen({ shopId }) {
 const [screen, setScreen] = useState('dashboard');

if (screen === 'udharBook') {
    return (
      <UdharBookScreen
        onBack={() => setScreen('dashboard')}
        shopId={shopId}
      />
    );
  }
  if (screen === 'addUdhar') {
    return (
      <AddUdharScreen
        onBack={() => setScreen('dashboard')}
        onSuccess={() => setScreen('dashboard')}
      />
    );
  }
  if (screen === 'inventory') {
    return (
      <InventoryScreen
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'paisaReport') {
    return (
      <PaisaReportScreen
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.shopName}>Ram Kirana Store</Text>
        <Text style={styles.greeting}>Subha prabhat! 🙏</Text>
      </View>

      <View style={styles.udharCard}>
        <Text style={styles.udharLabel}>Total Udhar Baaki</Text>
        <Text style={styles.udharAmount}>NPR 2,000</Text>
        <Text style={styles.udharSub}>1 customer le tirnu baaki chha</Text>
      </View>

      <Text style={styles.sectionTitle}>Ke garnu cha?</Text>

      <View style={styles.menuGrid}>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setScreen('udharBook')}
        >
          <Text style={styles.menuIcon}>📒</Text>
          <Text style={styles.menuLabel}>Udhar Book</Text>
          <Text style={styles.menuSub}>Customers hernus</Text>
        </TouchableOpacity>

      <TouchableOpacity
  style={styles.menuItem}
  onPress={() => setScreen('addUdhar')}
>
  <Text style={styles.menuIcon}>➕</Text>
  <Text style={styles.menuLabel}>Udhar Dinus</Text>
  <Text style={styles.menuSub}>Credit log garnus</Text>
</TouchableOpacity>

       <TouchableOpacity
  style={styles.menuItem}
  onPress={() => setScreen('inventory')}
>
  <Text style={styles.menuIcon}>📦</Text>
  <Text style={styles.menuLabel}>Inventory</Text>
  <Text style={styles.menuSub}>Stock hernus</Text>
</TouchableOpacity>

     <TouchableOpacity
  style={styles.menuItem}
  onPress={() => setScreen('paisaReport')}
>
  <Text style={styles.menuIcon}>📊</Text>
  <Text style={styles.menuLabel}>Paisa Report</Text>
  <Text style={styles.menuSub}>Weekly summary</Text>
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
    marginTop: 60,
    marginBottom: 24,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2eaf5',
  },
  greeting: {
    fontSize: 15,
    color: '#9bbfaa',
    marginTop: 4,
  },
  udharCard: {
    backgroundColor: '#141f18',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    borderLeftWidth: 4,
    borderLeftColor: '#3ddc84',
  },
  udharLabel: {
    fontSize: 13,
    color: '#9bbfaa',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  udharAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3ddc84',
    marginBottom: 6,
  },
  udharSub: {
    fontSize: 14,
    color: '#3d5870',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '47%',
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  menuSub: {
    fontSize: 12,
    color: '#3d5870',
  },
});