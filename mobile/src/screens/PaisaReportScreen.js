import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share
} from 'react-native';

export default function PaisaReportScreen({ onBack }) {

  const report = {
    shopName: 'Ram Kirana Store',
    totalUdhar: 2000,
    debtorsCount: 1,
    collectedThisWeek: 500,
    lowStockCount: 1,
    totalCustomers: 3,
  };

  async function handleShare() {
    const message =
      `📊 *${report.shopName} — Hapta Report*\n\n` +
      `💰 Total udhar baaki: NPR ${report.totalUdhar}\n` +
      `👥 Udhar customers: ${report.debtorsCount}\n` +
      `✅ Is hapta aako: NPR ${report.collectedThisWeek}\n` +
      `📦 Low stock items: ${report.lowStockCount}\n\n` +
      `Subha din hos! 🙏`;

    await Share.share({ message });
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Farka</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paisa Report</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.weekBadge}>
        <Text style={styles.weekText}>Is Hapta ko Summary</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Total Udhar Baaki</Text>
        <Text style={styles.mainAmount}>NPR {report.totalUdhar}</Text>
        <Text style={styles.mainSub}>
          {report.debtorsCount} customer le tirnu baaki chha
        </Text>
      </View>

      <View style={styles.statsGrid}>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            NPR {report.collectedThisWeek}
          </Text>
          <Text style={styles.statLabel}>Is hapta aako</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {report.totalCustomers}
          </Text>
          <Text style={styles.statLabel}>Jamma customers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[
            styles.statValue,
            report.lowStockCount > 0 && styles.statWarning
          ]}>
            {report.lowStockCount}
          </Text>
          <Text style={styles.statLabel}>Low stock items</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {report.debtorsCount}
          </Text>
          <Text style={styles.statLabel}>Udhar baaki</Text>
        </View>

      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>WhatsApp Report</Text>
        <Text style={styles.messageText}>
          📊 *{report.shopName} — Hapta Report*{'\n\n'}
          💰 Total udhar baaki: NPR {report.totalUdhar}{'\n'}
          👥 Udhar customers: {report.debtorsCount}{'\n'}
          ✅ Is hapta aako: NPR {report.collectedThisWeek}{'\n'}
          📦 Low stock items: {report.lowStockCount}{'\n\n'}
          Subha din hos! 🙏
        </Text>
      </View>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
      >
        <Text style={styles.shareButtonText}>
          WhatsApp ma Share Garnus
        </Text>
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
    marginBottom: 24,
  },
  back: { color: '#3ddc84', fontSize: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#e2eaf5' },
  weekBadge: {
    backgroundColor: '#1a2920',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3ddc84',
  },
  weekText: { color: '#3ddc84', fontSize: 13 },
  mainCard: {
    backgroundColor: '#141f18',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    borderLeftWidth: 4,
    borderLeftColor: '#3ddc84',
  },
  mainLabel: {
    fontSize: 13,
    color: '#9bbfaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  mainAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3ddc84',
    marginBottom: 6,
  },
  mainSub: { fontSize: 14, color: '#3d5870' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2eaf5',
    marginBottom: 4,
  },
  statWarning: { color: '#f59e0b' },
  statLabel: { fontSize: 12, color: '#3d5870' },
  messageCard: {
    backgroundColor: '#141f18',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  messageTitle: {
    fontSize: 13,
    color: '#9bbfaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#e2eaf5',
    lineHeight: 22,
  },
  shareButton: {
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});