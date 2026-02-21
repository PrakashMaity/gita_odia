import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { getCombinedShareStatistics, ShareStatistics } from '@/services/shareAnalyticsService';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

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
  const highlightStyle: ViewStyle = highlight ? styles.highlightCard : {};

  return (
    <ThemedCard variant="primary" style={[styles.statsCard, highlightStyle]}>
      {icon && (
        <ThemedView style={styles.iconWrapper}>
          <Feather name={icon as any} size={SIZES.icon.lg} color={theme.icon.primary} />
        </ThemedView>
      )}
      <ThemedLanguageText
        variant="primary"
        size="xxl"
        fontFamily="regional_secondary"
        style={[styles.statsValue, { color: highlight ? theme.icon.primary : theme.text.primary }]}
      >
        {value}
      </ThemedLanguageText>
      <ThemedLanguageText
        variant="secondary"
        size="small"
        fontFamily="regional_secondary"
        style={[styles.statsLabel, { color: theme.text.secondary }]}
      >
        {label}
      </ThemedLanguageText>
    </ThemedCard>
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
  return (
    <ThemedCard variant="primary" style={styles.accordionCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        <ThemedView style={styles.categoryHeader}>
          <ThemedView style={styles.categoryHeaderLeft}>
            <Feather name={icon as any} size={SIZES.icon.md} color={theme.icon.primary} />
            <ThemedLanguageText
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={[styles.categoryTitle, { color: theme.text.primary }]}
            >
              {title}
            </ThemedLanguageText>
          </ThemedView>
          <ThemedView style={styles.categoryHeaderRight}>
            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="regional_secondary"
              style={[styles.totalLabel, { color: theme.text.secondary }]}
            >
              {i18n.t('profile.total')}: {stats.total}
            </ThemedLanguageText>
            <Feather 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={SIZES.icon.md} 
              color={theme.icon.secondary}
              style={styles.chevronIcon}
            />
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
      
      {isExpanded && (
        <ThemedView style={styles.statsRow}>
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
        </ThemedView>
      )}
    </ThemedCard>
  );
};

export const ShareStats: React.FC<ShareStatsProps> = ({ style }) => {
  const theme = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verseStats, setVerseStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [appStats, setAppStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [totalStats, setTotalStats] = useState<ShareStatistics>({ today: 0, week: 0, month: 0, total: 0 });
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    summary: false, // First part also collapsed by default
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
      <ThemedView style={[styles.container, style, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.icon.primary} />
        <ThemedLanguageText
          variant="secondary"
          size="medium"
          fontFamily="regional_secondary"
          style={[styles.loadingText, { color: theme.text.secondary }]}
        >
          {i18n.t('profile.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  const hasNoShares = totalStats.total === 0 && verseStats.total === 0 && appStats.total === 0;

  return (
    <ThemedView style={[styles.container, style]}>
      {/* Summary Section - Now also accordion */}
      <ThemedCard variant="primary" style={styles.accordionCard}>
        <TouchableOpacity 
          onPress={() => toggleSection('summary')} 
          activeOpacity={0.7}
        >
          <ThemedView style={styles.summaryHeader}>
            <ThemedView style={styles.summaryHeaderLeft}>
              <Feather name="share-2" size={SIZES.icon.lg} color={theme.icon.primary} />
              <ThemedView style={styles.summaryTitleContainer}>
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={[styles.summaryTitle, { color: theme.text.primary }]}
                >
                  {i18n.t('profile.shareStats')}
                </ThemedLanguageText>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={[styles.summarySubtitle, { color: theme.text.secondary }]}
                >
                  {i18n.t('profile.allTime')}: {totalStats.total} {i18n.t('profile.totalShares')}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.summaryHeaderRight}>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={refreshing}
                style={styles.refreshButton}
              >
                <Feather 
                  name="refresh-cw" 
                  size={SIZES.icon.sm} 
                  color={refreshing ? theme.icon.disabled : theme.icon.secondary}
                />
              </TouchableOpacity>
              <Feather 
                name={expandedSections.summary ? "chevron-up" : "chevron-down"} 
                size={SIZES.icon.md} 
                color={theme.icon.secondary}
                style={styles.chevronIcon}
              />
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
        
        {refreshing && (
          <ThemedView style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={theme.icon.primary} />
          </ThemedView>
        )}

        {expandedSections.summary && (
          <>
            {hasNoShares ? (
              <ThemedView style={styles.emptyState}>
                <Feather name="share-2" size={SIZES.icon.xxl} color={theme.icon.secondary} />
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={[styles.emptyStateText, { color: theme.text.secondary }]}
                >
                  {i18n.t('profile.noShares')}
                </ThemedLanguageText>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={[styles.emptyStateSubtext, { color: theme.text.tertiary }]}
                >
                  {i18n.t('profile.shareAppDesc')}
                </ThemedLanguageText>
              </ThemedView>
            ) : (
              <>
                {/* Total Highlights */}
                <ThemedView style={styles.highlightsRow}>
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
                </ThemedView>
              </>
            )}
          </>
        )}
      </ThemedCard>

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
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: SIZES.spacing.md,
    textAlign: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
  },
  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xs,
  },
  summaryTitleContainer: {
    marginLeft: SIZES.spacing.sm,
    flex: 1,
  },
  summaryTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  summarySubtitle: {
    opacity: 0.7,
  },
  refreshButton: {
    padding: SIZES.spacing.xs,
  },
  refreshingIndicator: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
    marginTop: SIZES.spacing.md,
    paddingTop: SIZES.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  accordionCard: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.sm,
  },
  categoryTitle: {
    marginLeft: SIZES.spacing.sm,
    fontWeight: '600',
  },
  totalLabel: {
    opacity: 0.8,
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: SIZES.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
    marginTop: SIZES.spacing.md,
    paddingTop: SIZES.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statsCard: {
    flex: 1,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  highlightCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconWrapper: {
    marginBottom: SIZES.spacing.xs,
    opacity: 0.8,
  },
  statsValue: {
    fontWeight: 'bold',
    marginVertical: SIZES.spacing.xs,
    textAlign: 'center',
  },
  statsLabel: {
    marginTop: SIZES.spacing.xs,
    textAlign: 'center',
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacing.xl,
    paddingHorizontal: SIZES.spacing.lg,
  },
  emptyStateText: {
    marginTop: SIZES.spacing.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyStateSubtext: {
    marginTop: SIZES.spacing.sm,
    textAlign: 'center',
    opacity: 0.7,
  },
});
