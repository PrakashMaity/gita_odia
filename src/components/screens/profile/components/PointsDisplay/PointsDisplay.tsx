import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { getPointsData, PointsData, redeemPoints, REDEEM_THRESHOLD } from '@/services/shareAnalyticsService';
import { getAdFreeStatus } from '@/services/adFreeService';
import { SIZES } from '@/rootconstants/sizes';
import Feather from '@expo/vector-icons/Feather';
import { createSuccessAlert, createErrorAlert, createConfirmAlert, useCustomAlert } from '@/hooks/useCustomAlert';

interface PointsDisplayProps {
  style?: any;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ style }) => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [adFreeStatus, setAdFreeStatus] = useState<{
    isActive: boolean;
    remainingDays: number;
    remainingHours: number;
  } | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [points, adFree] = await Promise.all([
        getPointsData(),
        getAdFreeStatus(),
      ]);
      setPointsData(points);
      setAdFreeStatus(adFree);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  const handleRedeem = async () => {
    if (!pointsData || pointsData.currentPoints < REDEEM_THRESHOLD) {
      showAlert(createErrorAlert(
        i18n.t('profile.redeemError'),
        `You need at least ${REDEEM_THRESHOLD} points to redeem.`
      ));
      return;
    }

    showAlert(createConfirmAlert(
      i18n.t('profile.redeem'),
      `Redeem ${REDEEM_THRESHOLD} points for ${REDEEM_THRESHOLD / 100} day(s) of ad-free experience?`,
      async () => {
        setRedeeming(true);
        try {
          const result = await redeemPoints(REDEEM_THRESHOLD);
          if (result.success) {
            showAlert(createSuccessAlert(
              i18n.t('profile.redeemSuccess'),
              result.message
            ));
            await loadData();
          } else {
            showAlert(createErrorAlert(
              i18n.t('profile.redeemError'),
              result.message
            ));
          }
        } catch (error) {
          console.error('Error redeeming points:', error);
          showAlert(createErrorAlert(
            i18n.t('profile.redeemError'),
            'An error occurred while redeeming points.'
          ));
        } finally {
          setRedeeming(false);
        }
      }
    ));
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
      {AlertComponent}
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
              onPress={() => setInfoModalVisible(true)}
              style={styles.infoButton}
            >
              <Feather 
                name="info" 
                size={SIZES.icon.sm} 
                color={theme.icon.secondary}
              />
            </TouchableOpacity>
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

        {/* Ad-Free Status */}
        {adFreeStatus?.isActive && (
          <View style={[styles.adFreeBanner, { backgroundColor: theme.background.success || 'rgba(34, 197, 94, 0.15)' }]}>
            <Feather name="shield" size={SIZES.icon.sm} color={theme.icon.success || '#22c55e'} />
            <ThemedLanguageText
              variant="primary"
              size="small"
              fontFamily="regional_secondary"
              style={[styles.adFreeText, { color: theme.text.success || '#22c55e' }]}
            >
              {i18n.t('profile.adFreeActive')} • {adFreeStatus.remainingDays} {i18n.t('profile.adFreeDays')} {adFreeStatus.remainingHours} {i18n.t('profile.adFreeHours')}
            </ThemedLanguageText>
          </View>
        )}

        {/* Redeem Button */}
        {pointsData.canRedeem && (
          <TouchableOpacity
            style={[styles.redeemButton, { backgroundColor: theme.background.primary }]}
            onPress={handleRedeem}
            disabled={redeeming}
          >
            {redeeming ? (
              <ActivityIndicator size="small" color={theme.text.primary} />
            ) : (
              <>
                <Feather name="gift" size={SIZES.icon.sm} color={theme.icon.primary} />
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={[styles.redeemButtonText, { color: theme.text.primary }]}
                >
                  {i18n.t('profile.redeemButton')}
                </ThemedLanguageText>
              </>
            )}
          </TouchableOpacity>
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

      {/* Info Modal */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setInfoModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalContent, { backgroundColor: theme.background.card }]}
          >
            <View style={styles.modalHeader}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={[styles.modalTitle, { color: theme.text.primary }]}
              >
                {i18n.t('profile.redeemInfo')}
              </ThemedLanguageText>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={SIZES.icon.md} color={theme.icon.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Sharing Points Info */}
              <ThemedCard variant="card" style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <View style={[styles.infoIconContainer, { backgroundColor: theme.background.primary + '20' }]}>
                    <Feather name="share-2" size={SIZES.icon.lg} color={theme.icon.primary} />
                  </View>
                  <ThemedLanguageText
                    variant="primary"
                    size="large"
                    fontFamily="regional_secondary"
                    style={[styles.infoCardTitle, { color: theme.text.primary }]}
                  >
                    {i18n.t('profile.sharingPointsInfo')}
                  </ThemedLanguageText>
                </View>
                <View style={styles.infoCardContent}>
                  {i18n.t('profile.sharingPointsDesc')
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => {
                      const icons = ['file-text', 'users', 'clock', 'alert-circle'];
                      const cleanText = line.replace(/^•\s*/, '').trim();
                      return (
                        <View key={index} style={styles.infoItem}>
                          <Feather 
                            name={icons[index] as any} 
                            size={SIZES.icon.sm} 
                            color={theme.icon.secondary} 
                            style={styles.infoItemIcon}
                          />
                          <ThemedLanguageText
                            variant="secondary"
                            size="small"
                            fontFamily="regional_secondary"
                            style={[styles.infoItemText, { color: theme.text.secondary }]}
                          >
                            {cleanText}
                          </ThemedLanguageText>
                        </View>
                      );
                    })}
                </View>
              </ThemedCard>

              {/* Redeem Conditions */}
              <ThemedCard variant="card" style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <View style={[styles.infoIconContainer, { backgroundColor: theme.background.primary + '20' }]}>
                    <Feather name="gift" size={SIZES.icon.lg} color={theme.icon.primary} />
                  </View>
                  <ThemedLanguageText
                    variant="primary"
                    size="large"
                    fontFamily="regional_secondary"
                    style={[styles.infoCardTitle, { color: theme.text.primary }]}
                  >
                    {i18n.t('profile.redeemConditions')}
                  </ThemedLanguageText>
                </View>
                <View style={styles.infoCardContent}>
                  {i18n.t('profile.redeemConditionsDesc')
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => {
                      const icons = ['target', 'calendar', 'clock', 'alert-circle'];
                      const cleanText = line.replace(/^•\s*/, '').trim();
                      return (
                        <View key={index} style={styles.infoItem}>
                          <Feather 
                            name={icons[index] as any} 
                            size={SIZES.icon.sm} 
                            color={theme.icon.secondary} 
                            style={styles.infoItemIcon}
                          />
                          <ThemedLanguageText
                            variant="secondary"
                            size="small"
                            fontFamily="regional_secondary"
                            style={[styles.infoItemText, { color: theme.text.secondary }]}
                          >
                            {cleanText}
                          </ThemedLanguageText>
                        </View>
                      );
                    })}
                </View>
              </ThemedCard>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  infoButton: {
    padding: SIZES.spacing.xs,
  },
  refreshButton: {
    padding: SIZES.spacing.xs,
  },
  refreshingIndicator: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  adFreeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.sm,
    marginBottom: SIZES.spacing.sm,
    gap: SIZES.spacing.xs,
  },
  adFreeText: {
    fontWeight: '600',
    flex: 1,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.sm,
    gap: SIZES.spacing.xs,
  },
  redeemButtonText: {
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.spacing.lg,
  },
  modalContent: {
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  modalTitle: {
    fontWeight: '700',
    flex: 1,
  },
  modalCloseButton: {
    padding: SIZES.spacing.xs,
  },
  modalScrollView: {
    maxHeight: 500,
  },
  modalScrollContent: {
    paddingBottom: SIZES.spacing.md,
  },
  infoCard: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.md,
    overflow: 'hidden',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
    gap: SIZES.spacing.sm,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontWeight: '700',
    flex: 1,
  },
  infoCardContent: {
    gap: SIZES.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    paddingHorizontal: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  infoItemIcon: {
    marginTop: 2,
  },
  infoItemText: {
    flex: 1,
    lineHeight: 20,
  },
});
