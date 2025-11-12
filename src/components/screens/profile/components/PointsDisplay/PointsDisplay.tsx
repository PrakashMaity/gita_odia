import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { getPointsData, PointsData } from '@/services/shareAnalyticsService';
import { SIZES } from '@/rootconstants/sizes';
import Feather from '@expo/vector-icons/Feather';

interface PointsDisplayProps {
  style?: any;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ style }) => {
  const theme = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);

  const loadPoints = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const points = await getPointsData();
      setPointsData(points);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  const handleRefresh = () => {
    loadPoints(true);
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, style]}>
        <ActivityIndicator size="small" color={theme.icon.primary} />
        <ThemedLanguageText
          variant="secondary"
          size="small"
          fontFamily="regional_secondary"
          style={[styles.loadingText, { color: theme.text.secondary }]}
        >
          {i18n.t('profile.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  if (!pointsData) {
    return null;
  }

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedCard variant="card" style={styles.pointsCard}>
        {/* Header with Current Points */}
        <View style={styles.pointsHeader}>
          <View style={styles.pointsHeaderLeft}>
            <View style={styles.pointsIconContainer}>
              <Feather name="award" size={SIZES.icon.lg} color={theme.icon.primary} />
            </View>
            <View style={styles.pointsTitleContainer}>
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={[styles.pointsTitle, { color: theme.text.primary }]}
              >
                {i18n.t('profile.currentPoints')}
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="xs"
                fontFamily="regional_secondary"
                style={[styles.pointsSubtitle, { color: theme.text.secondary }]}
              >
                {i18n.t('profile.pointsWindow')}
              </ThemedLanguageText>
            </View>
          </View>
          <View style={styles.pointsValueContainer}>
            <ThemedLanguageText
              variant="primary"
              size="xxl"
              fontFamily="regional_secondary"
              style={[styles.pointsMainValue, { color: theme.icon.primary }]}
            >
              {pointsData.currentPoints}
            </ThemedLanguageText>
            <TouchableOpacity 
              onPress={handleRefresh} 
              disabled={refreshing}
              style={styles.refreshButton}
            >
              <Feather 
                name="refresh-cw" 
                size={SIZES.icon.sm} 
                color={refreshing ? theme.icon.disabled : theme.icon.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {refreshing && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={theme.icon.primary} />
          </View>
        )}

        {/* Points Details Row */}
        <View style={styles.pointsDetailsRow}>
          <View style={styles.pointsDetailCard}>
            <ThemedLanguageText
              variant="secondary"
              size="xs"
              fontFamily="regional_secondary"
              style={[styles.pointsDetailLabel, { color: theme.text.secondary }]}
            >
              {i18n.t('profile.expiredPoints')}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={[styles.pointsDetailValue, { color: theme.text.error || theme.text.secondary }]}
            >
              {pointsData.expiredPoints}
            </ThemedLanguageText>
          </View>
          <View style={styles.pointsDetailCard}>
            <ThemedLanguageText
              variant="secondary"
              size="xs"
              fontFamily="regional_secondary"
              style={[styles.pointsDetailLabel, { color: theme.text.secondary }]}
            >
              {i18n.t('profile.totalPointsEarned')}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={[styles.pointsDetailValue, { color: theme.text.primary }]}
            >
              {pointsData.totalEarned}
            </ThemedLanguageText>
          </View>
        </View>

        {/* Points Breakdown - Compact */}
        <View style={styles.pointsBreakdown}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <Feather name="file-text" size={SIZES.icon.xs} color={theme.icon.secondary} />
              <ThemedLanguageText
                variant="secondary"
                size="xs"
                fontFamily="regional_secondary"
                style={[styles.breakdownText, { color: theme.text.secondary }]}
              >
                {pointsData.pointsBreakdown.verseShares} {i18n.t('profile.points')}
              </ThemedLanguageText>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Feather name="users" size={SIZES.icon.xs} color={theme.icon.secondary} />
              <ThemedLanguageText
                variant="secondary"
                size="xs"
                fontFamily="regional_secondary"
                style={[styles.breakdownText, { color: theme.text.secondary }]}
              >
                {pointsData.pointsBreakdown.appShares} {i18n.t('profile.points')}
              </ThemedLanguageText>
            </View>
          </View>
        </View>
      </ThemedCard>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
  },
  loadingText: {
    marginTop: SIZES.spacing.sm,
    textAlign: 'center',
  },
  pointsCard: {
    padding: SIZES.spacing.md,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  pointsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pointsIconContainer: {
    marginRight: SIZES.spacing.sm,
  },
  pointsTitleContainer: {
    flex: 1,
  },
  pointsTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  pointsSubtitle: {
    opacity: 0.7,
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xs,
  },
  pointsMainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
  },
  refreshButton: {
    padding: SIZES.spacing.xs,
  },
  refreshingIndicator: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  pointsDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
    paddingTop: SIZES.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pointsDetailCard: {
    flex: 1,
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
  },
  pointsDetailLabel: {
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
  pointsDetailValue: {
    fontWeight: '600',
    textAlign: 'center',
  },
  pointsBreakdown: {
    paddingTop: SIZES.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xs,
  },
  breakdownDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  breakdownText: {
    opacity: 0.7,
  },
});

