import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getAdFreeStatus } from '@/services/adFreeService';
import { canExtendProWithPoints, extendProWithPoints } from '@/services/proService';
import { getPointsData, PointsData, REDEEM_THRESHOLD, redeemPoints } from '@/services/shareAnalyticsService';
import { getLanguageFonts } from '@/types/font.interface';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';

interface PointsDisplayProps {
  style?: any;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ style }) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const adFreeBackgroundColor = theme.status.success ? theme.status.success + '20' : 'rgba(34, 197, 94, 0.15)';
  const adFreeTextColor = theme.status.success ?? '#22c55e';
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
  const [extendingPro, setExtendingPro] = useState(false);
  const [canExtendPro, setCanExtendPro] = useState(false);
  const { refreshStatus } = useProStatus();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [points, adFree, proExtension] = await Promise.all([
        getPointsData(),
        getAdFreeStatus(),
        canExtendProWithPoints(),
      ]);
      setPointsData(points);
      setAdFreeStatus(adFree);
      setCanExtendPro(proExtension.canExtend);
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

  const handleExtendPro = async () => {
    if (!canExtendPro) {
      showAlert(createErrorAlert(
        i18n.t('profile.proExtendError', { defaultValue: 'Cannot Extend Pro' }),
        i18n.t('profile.proExtendErrorMsg', { defaultValue: 'You need 2000 points to extend Pro, or you have already extended Pro using points.' })
      ));
      return;
    }

    showAlert(createConfirmAlert(
      i18n.t('profile.proExtend', { defaultValue: 'Extend Pro' }),
      i18n.t('profile.proExtendConfirm', { defaultValue: 'Extend Pro for 1 day using 2000 points?' }),
      async () => {
        setExtendingPro(true);
        try {
          const result = await extendProWithPoints();
          if (result.success) {
            showAlert(createSuccessAlert(
              i18n.t('profile.proExtendSuccess', { defaultValue: 'Pro Extended!' }),
              result.message
            ));
            await refreshStatus();
            await loadData();
          } else {
            showAlert(createErrorAlert(
              i18n.t('profile.proExtendError', { defaultValue: 'Cannot Extend Pro' }),
              result.message
            ));
          }
        } catch (error) {
          console.error('Error extending Pro:', error);
          showAlert(createErrorAlert(
            i18n.t('profile.proExtendError', { defaultValue: 'Cannot Extend Pro' }),
            i18n.t('profile.proExtendErrorMsg', { defaultValue: 'An error occurred while extending Pro.' })
          ));
        } finally {
          setExtendingPro(false);
        }
      }
    ));
  };

  if (loading) {
    return (
      <Box className="items-center justify-center p-4 min-h-[120px]" style={style}>
        <ActivityIndicator size="small" color={theme.status.success} />
        <Text
          className="mt-2 text-[14px] font-medium text-neutral-500 text-center"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t('profile.loading')}
        </Text>
      </Box>
    );
  }

  if (!pointsData) {
    return null;
  }

  return (
    <Box className="w-full mb-2" style={style}>
      {AlertComponent}
      <Box
        className="w-full bg-white rounded-[20px] shadow-sm border border-primary-100/50 p-5 overflow-hidden relative"
        style={{ backgroundColor: theme.background.primary }}
      >
        {/* Background icon */}
        <Box className="absolute -right-6 -bottom-6 opacity-[0.03]" pointerEvents="none">
          <Feather name="award" size={120} color="#000" />
        </Box>

        {/* Header with Current Points */}
        <HStack className="items-start justify-between mb-6 relative z-10">
          <HStack className="items-center flex-1">
            <Box
              className="w-12 h-12 rounded-[16px] items-center justify-center mr-4"
              style={{ backgroundColor: theme.status.warning + '15' }}
            >
              <Feather name="award" size={24} color={theme.status.warning} />
            </Box>
            <VStack className="flex-1">
              <Text
                className="text-[16px] font-bold tracking-tight text-neutral-800"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('profile.currentPoints')}
              </Text>
              <Text
                className="text-[13px] font-medium text-neutral-500"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('profile.pointsWindow')}
              </Text>
            </VStack>
          </HStack>
          <HStack className="items-center">
            <Text
              className="text-[32px] font-black tracking-tight"
              style={{ fontFamily: fonts.regional_primary, color: theme.status.warning }}
            >
              {pointsData.currentPoints}
            </Text>
            <VStack space="xs" className="ml-3">
              <Pressable
                onPress={() => setInfoModalVisible(true)}
                className="w-8 h-8 rounded-full items-center justify-center active:opacity-70"
                style={{ backgroundColor: theme.background.secondary }}
              >
                <Feather
                  name="info"
                  size={14}
                  color={theme.icon.secondary}
                />
              </Pressable>
              <Pressable
                onPress={handleRefresh}
                disabled={refreshing}
                className="w-8 h-8 rounded-full items-center justify-center active:opacity-70"
                style={{ backgroundColor: theme.background.secondary }}
              >
                <Feather
                  name="refresh-cw"
                  size={14}
                  color={refreshing ? theme.icon.disabled : theme.icon.secondary}
                />
              </Pressable>
            </VStack>
          </HStack>
        </HStack>

        {refreshing && (
          <Box className="items-center py-2 mb-2">
            <ActivityIndicator size="small" color={theme.status.success} />
          </Box>
        )}

        {/* Ad-Free Status */}
        {adFreeStatus?.isActive && (
          <HStack
            className="items-center p-3 rounded-[12px] mb-4"
            style={{ backgroundColor: adFreeBackgroundColor }}
          >
            <Feather name="shield" size={16} color={adFreeTextColor} style={{ marginRight: 8 }} />
            <Text
              className="text-[13px] font-bold flex-1"
              style={{ fontFamily: fonts.regional_secondary, color: adFreeTextColor }}
            >
              {i18n.t('profile.adFreeActive')} • {adFreeStatus.remainingDays} {i18n.t('profile.adFreeDays')} {adFreeStatus.remainingHours} {i18n.t('profile.adFreeHours')}
            </Text>
          </HStack>
        )}

        {/* Extend Pro Button */}
        {canExtendPro && (
          <Pressable
            className="flex-row items-center justify-center p-4 rounded-[16px] mb-3 active:opacity-80"
            style={{ backgroundColor: theme.status.warning }}
            onPress={handleExtendPro}
            disabled={extendingPro}
          >
            {extendingPro ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <HStack space="sm" className="items-center">
                <Feather name="star" size={18} color="#fff" />
                <Text
                  className="text-[16px] font-bold tracking-tight text-white"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.extendPro', { defaultValue: 'Extend Pro (2000 points)' })}
                </Text>
              </HStack>
            )}
          </Pressable>
        )}

        {/* Redeem Button */}
        {pointsData.canRedeem && (
          <Pressable
            className="flex-row items-center justify-center p-4 rounded-[16px] mb-4 active:opacity-80 border border-primary-900/10"
            style={{ backgroundColor: theme.background.secondary }}
            onPress={handleRedeem}
            disabled={redeeming}
          >
            {redeeming ? (
              <ActivityIndicator size="small" color={theme.text.primary} />
            ) : (
              <HStack space="sm" className="items-center">
                <Feather name="gift" size={18} color={theme.icon.primary} />
                <Text
                  className="text-[16px] font-bold tracking-tight text-neutral-800"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.redeemButton')}
                </Text>
              </HStack>
            )}
          </Pressable>
        )}

        {/* Points Details Row */}
        <HStack space="md" className="pt-4 border-t border-primary-900/5 mb-4">
          <Box
            className="flex-1 p-3 rounded-[12px] items-center"
            style={{ backgroundColor: theme.background.secondary }}
          >
            <Text
              className="text-[12px] font-medium text-neutral-500 mb-1 text-center"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('profile.expiredPoints')}
            </Text>
            <Text
              className="text-[18px] font-bold text-neutral-800 text-center"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {pointsData.expiredPoints}
            </Text>
          </Box>
          <Box
            className="flex-1 p-3 rounded-[12px] items-center"
            style={{ backgroundColor: theme.background.secondary }}
          >
            <Text
              className="text-[12px] font-medium text-neutral-500 mb-1 text-center"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('profile.totalPointsEarned')}
            </Text>
            <Text
              className="text-[18px] font-bold text-neutral-800 text-center"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {pointsData.totalEarned}
            </Text>
          </Box>
        </HStack>

        {/* Points Breakdown - Compact */}
        <Box className="pt-4 border-t border-primary-900/5">
          <HStack className="items-center justify-center space-x-4">
            <HStack space="xs" className="items-center">
              <Feather name="file-text" size={14} color={theme.icon.secondary} />
              <Text
                className="text-[12px] font-medium text-neutral-500"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {pointsData.pointsBreakdown.verseShares} {i18n.t('profile.points')}
              </Text>
            </HStack>
            <Box className="w-[1px] h-4 mx-4" style={{ backgroundColor: theme.border.primary }} />
            <HStack space="xs" className="items-center">
              <Feather name="users" size={14} color={theme.icon.secondary} />
              <Text
                className="text-[12px] font-medium text-neutral-500"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {pointsData.pointsBreakdown.appShares} {i18n.t('profile.points')}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>

      {/* Info Modal */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center p-6"
          activeOpacity={1}
          onPress={() => setInfoModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-[500px] max-h-[85%] rounded-[24px] p-6 shadow-md border border-primary-100/50"
            style={{ backgroundColor: theme.background.primary }}
          >
            <HStack className="justify-between items-center mb-6">
              <Text
                className="text-[20px] font-black tracking-tight flex-1 text-neutral-800"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('profile.redeemInfo')}
              </Text>
              <Pressable
                onPress={() => setInfoModalVisible(false)}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.background.secondary }}
              >
                <Feather name="x" size={20} color={theme.icon.primary} />
              </Pressable>
            </HStack>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {/* Sharing Points Info */}
              <Box
                className="mb-4 rounded-[16px] p-4 border border-primary-900/5"
                style={{ backgroundColor: theme.background.secondary }}
              >
                <HStack className="items-center mb-4 space-x-3">
                  <Box
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.status.warning + '15' }}
                  >
                    <Feather name="share-2" size={20} color={theme.status.warning} />
                  </Box>
                  <Text
                    className="text-[16px] font-bold text-neutral-800 flex-1 ml-3"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('profile.sharingPointsInfo')}
                  </Text>
                </HStack>
                <VStack space="sm">
                  {i18n.t('profile.sharingPointsDesc')
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => {
                      const icons = ['file-text', 'users', 'clock', 'alert-circle'];
                      const cleanText = line.replace(/^•\s*/, '').trim();
                      return (
                        <HStack key={index} className="items-start space-x-3 py-1">
                          <Feather
                            name={icons[index] as any}
                            size={16}
                            color={theme.icon.secondary}
                            style={{ marginTop: 2 }}
                          />
                          <Text
                            className="text-[13px] leading-5 text-neutral-600 flex-1 ml-3"
                            style={{ fontFamily: fonts.regional_secondary }}
                          >
                            {cleanText}
                          </Text>
                        </HStack>
                      );
                    })}
                </VStack>
              </Box>

              {/* Redeem Conditions */}
              <Box
                className="rounded-[16px] p-4 border border-primary-900/5"
                style={{ backgroundColor: theme.background.secondary }}
              >
                <HStack className="items-center mb-4 space-x-3">
                  <Box
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.status.success + '15' }}
                  >
                    <Feather name="gift" size={20} color={theme.status.success} />
                  </Box>
                  <Text
                    className="text-[16px] font-bold text-neutral-800 flex-1 ml-3"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('profile.redeemConditions')}
                  </Text>
                </HStack>
                <VStack space="sm">
                  {i18n.t('profile.redeemConditionsDesc')
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, index) => {
                      const icons = ['target', 'calendar', 'clock', 'alert-circle'];
                      const cleanText = line.replace(/^•\s*/, '').trim();
                      return (
                        <HStack key={index} className="items-start space-x-3 py-1">
                          <Feather
                            name={icons[index] as any}
                            size={16}
                            color={theme.icon.secondary}
                            style={{ marginTop: 2 }}
                          />
                          <Text
                            className="text-[13px] leading-5 text-neutral-600 flex-1 ml-3"
                            style={{ fontFamily: fonts.regional_secondary }}
                          >
                            {cleanText}
                          </Text>
                        </HStack>
                      );
                    })}
                </VStack>
              </Box>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Box>
  );
};
