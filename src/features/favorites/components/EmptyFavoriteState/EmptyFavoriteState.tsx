import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './EmptyFavoriteState.styles';

export const EmptyFavoriteState: React.FC = () => {
  const { theme } = useTheme();

  const handleBrowseChapters = () => {
    router.push('/(tabs)/chapters');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        {/* Decorative Icon Container */}
        <ThemedView style={styles.iconContainer}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: theme.background.quaternary + '40' }]}>
            <Ionicons name="heart-outline" size={80/2} color={theme.icon.tertiary} />
          </ThemedView>
          <ThemedView style={[styles.iconCircleSmall, styles.iconCircleTop, { backgroundColor: theme.background.quaternary + '30' }]}>
            <Ionicons name="star-outline" size={32/2} color={theme.icon.secondary} />
          </ThemedView>
          <ThemedView style={[styles.iconCircleSmall, styles.iconCircleBottom, { backgroundColor: theme.background.quaternary + '30' }]}>
            <MaterialIcons name="favorite-outline" size={32/2} color={theme.icon.secondary} />
          </ThemedView>
        </ThemedView>

        {/* Main Title */}
        <ThemedLanguageText
          variant="primary"
          size="xxl"
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('favorite.emptyState.title')}
        </ThemedLanguageText>

        {/* Subtitle */}
        <ThemedLanguageText
          variant="secondary"
          size="large"
          fontFamily="regional_secondary"
          style={styles.subtitle}
        >
          {i18n.t('favorite.emptyState.subtitle')}
        </ThemedLanguageText>

        {/* Tips Card */}
        <ThemedCard style={styles.tipsCard}>
          <ThemedView style={styles.tipsHeader}>
            <ThemedView style={[styles.tipsIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.tipsTitle}
            >
              {i18n.t('favorite.emptyState.tipsTitle')}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={styles.tipsList}>
            {[
              i18n.t('favorite.emptyState.tip1'),
              i18n.t('favorite.emptyState.tip2'),
              i18n.t('favorite.emptyState.tip3'),
            ].map((tip, index) => (
              <ThemedView key={index} style={styles.tipItem}>
                <ThemedView style={[styles.tipIcon, { backgroundColor: theme.background.quaternary }]}>
                  <Ionicons name="heart" size={20} color={theme.icon.primary} />
                </ThemedView>
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.tipText}
                >
                  {tip}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>

        {/* Call to Action Button */}
        <TouchableOpacity
          style={[styles.browseButton, { backgroundColor: theme.background.quaternary }]}
          onPress={handleBrowseChapters}
          activeOpacity={0.7}
        >
          <Ionicons name="book-outline" size={SIZES.icon.md} color={theme.icon.primary} />
          <ThemedLanguageText
            variant="primary"
            size="large"
            fontFamily="regional_secondary"
            style={styles.browseButtonText}
          >
            {i18n.t('favorite.emptyState.browseButton')}
          </ThemedLanguageText>
          <Ionicons name="arrow-forward" size={SIZES.icon.sm} color={theme.icon.primary} />
        </TouchableOpacity>

        {/* Inspiration Quote */}
        <ThemedCard style={styles.quoteCard}>
          <ThemedView style={styles.quoteContainer}>
            <MaterialIcons name="format-quote" size={32} color={theme.icon.tertiary} style={styles.quoteIcon} />
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.quoteText}
            >
              {i18n.t('favorite.emptyState.quote')}
            </ThemedLanguageText>
          </ThemedView>
        </ThemedCard>
      </ThemedView>
    </ScrollView>
  );
};

