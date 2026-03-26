import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator
} from 'react-native';
import { getReport } from '../api';

export default function PaisaReportScreen({ onBack, shopId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const result = await getReport(shopId);
      if (result.success) {
        setReport(result);
      }
    } catch (err) {
      console.log('Report error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!report) return;
    await Share.share({ message: report.whatsappMessage });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#3ddc84" size="large" />
        <Text style={styles.loadingText}>Report load gardai chha...</Text>
      </View>
    );
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
        <Text style={styles.mainAmount}>
          NPR {report?.summary.totalUdhar}
        </Text>
        <Text style={styles.mainSub}>
          {report?.summary.debtorsCount} customer le tirnu baaki chha
        </Text>
      </View>

      <View style={styles.statsGrid}>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            NPR {report?.summary.collectedThisWeek}
          </Text>
          <Text style={styles.statLabel}>Is hapta aako</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {report?.summary.totalCustomers}
          </Text>
          <Text style={styles.statLabel}>Jamma customers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[
            styles.statValue,
            report?.summary.lowStockCount > 0 && styles.statWarning
          ]}>
            {report?.summary.lowStockCount}
          </Text>
          <Text style={styles.statLabel}>Low stock items</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {report?.summary.debtorsCount}
          </Text>
          <Text style={styles.statLabel}>Udhar baaki</Text>
        </View>

      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>WhatsApp Report</Text>
        <Text style={styles.messageText}>
          {report?.whatsappMessage}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0f0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9bbfaa',
    marginTop: 16,
    fontSize: 15,
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