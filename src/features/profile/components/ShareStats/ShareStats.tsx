import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getCombinedShareStatistics, ShareStatistics } from '@/services/shareAnalyticsService';
import { getLanguageFonts } from '@/types/font.interface';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

interface ShareStatsProps {
  style?: any;
}

interface StatsCardProps {
  label: string;
  value: number;
  theme: any;
  icon?: string;
  highlight?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, theme, icon, highlight = false }) => {
  const fonts = getLanguageFonts();
  return (
    <Box
      className={`flex-1 p-3 rounded-[16px] items-center justify-center min-h-[90px] border ${highlight ? 'border-primary-500/30' : 'border-primary-900/5'}`}
      style={{ backgroundColor: highlight ? theme.status.success + '10' : theme.background.secondary }}
    >
      <VStack space="sm" className="items-center">
        {icon && (
          <Feather name={icon as any} size={16} color={highlight ? theme.status.success : theme.icon.secondary} />
        )}
        <Text
          className={`text-[24px] font-normal tracking-tight ${highlight ? 'text-primary-600' : 'text-neutral-800'}`}
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {value}
        </Text>
        <Text
          className="text-[12px] font-normal text-neutral-500 text-center"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

interface CategorySectionProps {
  title: string;
  icon: string;
  stats: ShareStatistics;
  theme: any;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, icon, stats, theme, isExpanded, onToggle }) => {
  const fonts = getLanguageFonts();
  return (
    <Box
      className="mb-4 bg-white rounded-[20px] shadow-sm border border-primary-100/50 overflow-hidden"
      style={{ backgroundColor: theme.background.primary }}
    >
      <Pressable onPress={onToggle} className="p-4 active:opacity-70">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1">
            <Box
              className="w-10 h-10 rounded-[12px] items-center justify-center mr-3"
              style={{ backgroundColor: theme.status.success + '15' }}
            >
              <Feather name={icon as any} size={20} color={theme.status.success} />
            </Box>
            <Text
              className="text-[16px] font-normal text-neutral-800"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {title}
            </Text>
          </HStack>
          <HStack className="items-center" space="md">
            <Text
              className="text-[13px] font-medium text-neutral-500"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('profile.total')}: <Text style={{ fontFamily: fonts.regional_primary, fontWeight: 'normal' }}>{stats.total}</Text>
            </Text>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.icon.secondary}
            />
          </HStack>
        </HStack>
      </Pressable>

      {isExpanded && (
        <Box className="px-4 pb-4 pt-2 border-t border-primary-900/5">
          <HStack space="sm" className="justify-between w-full">
            <StatsCard
              label={i18n.t('profile.today')}
              value={stats.today}
              theme={theme}
              icon="sun"
            />
            <StatsCard
              label={i18n.t('profile.thisWeek')}
              value={stats.week}
              theme={theme}
              icon="calendar"
            />
            <StatsCard
              label={i18n.t('profile.thisMonth')}
              value={stats.month}
              theme={theme}
              icon="trending-up"
            />
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export const ShareStats: React.FC<ShareStatsProps> = ({ style }) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verseStats, setVerseStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [appStats, setAppStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [totalStats, setTotalStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    summary: false,
    verseShares: false,
    appShares: false,
  });

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const stats = await getCombinedShareStatistics();
      setVerseStats(stats.verseShares);
      setAppStats(stats.appShares);
      setTotalStats(stats.total);
    } catch (error) {
      console.error('Error loading share stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = () => {
    loadStats(true);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <Box className="items-center justify-center min-h-[200px]" style={style}>
        <ActivityIndicator size="large" color={theme.status.success} />
        <Text
          className="mt-4 text-[14px] font-medium text-neutral-500 text-center"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t('profile.loading')}
        </Text>
      </Box>
    );
  }

  const hasNoShares = totalStats.total === 0 && verseStats.total === 0 && appStats.total === 0;

  return (
    <Box className="w-full flex-1 mb-2" style={style}>
      {/* Summary Section */}
      <Box
        className="mb-4 bg-white rounded-[20px] shadow-sm border border-primary-100/50 overflow-hidden"
        style={{ backgroundColor: theme.background.primary }}
      >
        <Pressable
          onPress={() => toggleSection('summary')}
          className="p-4 active:opacity-70"
        >
          <HStack className="items-center justify-between">
            <HStack className="items-center flex-1">
              <Box
                className="w-10 h-10 rounded-[12px] items-center justify-center mr-3"
                style={{ backgroundColor: theme.status.success + '15' }}
              >
                <Feather name="share-2" size={20} color={theme.status.success} />
              </Box>
              <VStack className="flex-1 justify-center">
                <Text
                  className="text-[16px] font-normal text-neutral-800"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.shareStats')}
                </Text>
                <Text
                  className="text-[12px] font-medium text-neutral-500"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.allTime')}: <Text style={{ fontFamily: fonts.regional_primary, fontWeight: 'normal' }}>{totalStats.total}</Text> {i18n.t('profile.totalShares')}
                </Text>
              </VStack>
            </HStack>
            <HStack className="items-center" space="sm">
              <Pressable
                onPress={(e: any) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={refreshing}
                className="p-2 active:opacity-70"
              >
                <Feather
                  name="refresh-cw"
                  size={16}
                  color={refreshing ? theme.icon.disabled : theme.icon.secondary}
                />
              </Pressable>
              <Feather
                name={expandedSections.summary ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.icon.secondary}
              />
            </HStack>
          </HStack>
        </Pressable>

        {refreshing && (
          <Box className="py-2 items-center">
            <ActivityIndicator size="small" color={theme.status.success} />
          </Box>
        )}

        {expandedSections.summary && (
          <Box className="px-4 pb-4 pt-2 border-t border-primary-900/5">
            {hasNoShares ? (
              <VStack space="md" className="items-center justify-center py-6 px-4">
                <Box
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: theme.background.secondary }}
                >
                  <Feather name="share-2" size={24} color={theme.icon.secondary} />
                </Box>
                <Text
                  className="text-[16px] font-medium text-neutral-600 text-center"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.noShares')}
                </Text>
                <Text
                  className="text-[13px] text-neutral-400 text-center leading-5"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('profile.shareAppDesc')}
                </Text>
              </VStack>
            ) : (
              <HStack space="sm" className="justify-between w-full">
                <StatsCard
                  label={i18n.t('profile.today')}
                  value={totalStats.today}
                  theme={theme}
                  icon="zap"
                  highlight={totalStats.today > 0}
                />
                <StatsCard
                  label={i18n.t('profile.thisWeek')}
                  value={totalStats.week}
                  theme={theme}
                  icon="clock"
                  highlight={totalStats.week > 0}
                />
                <StatsCard
                  label={i18n.t('profile.thisMonth')}
                  value={totalStats.month}
                  theme={theme}
                  icon="activity"
                  highlight={totalStats.month > 0}
                />
              </HStack>
            )}
          </Box>
        )}
      </Box>

      {/* Verse Shares Section */}
      <CategorySection
        title={i18n.t('profile.verseShares')}
        icon="file-text"
        stats={verseStats}
        theme={theme}
        isExpanded={expandedSections.verseShares}
        onToggle={() => toggleSection('verseShares')}
      />

      {/* App Shares Section */}
      <CategorySection
        title={i18n.t('profile.appShares')}
        icon="users"
        stats={appStats}
        theme={theme}
        isExpanded={expandedSections.appShares}
        onToggle={() => toggleSection('appShares')}
      />
    </Box>
  );
};
