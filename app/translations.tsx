import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { TranslationData, useTranslationStore } from '@/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TranslationsScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  const handleTranslationPress = (chapterId: string) => {
    router.push(`/translation/${chapterId}`);
  };

  const renderTranslationCard = (translation: TranslationData) => {
    const { chapter } = translation;

    return (
      <TouchableOpacity
        key={chapter.id}
        onPress={() => handleTranslationPress(chapter.id)}
        style={styles.translationCardContainer}
      >
        <ThemedCard style={[styles.translationCard]} pattern='hexagon' patternOpacity={0.05}>
          <ThemedView style={{flexDirection: 'row'}} >
            <ThemedView style={[styles.iconContainer, {
              backgroundColor: theme.background.tertiary,
            }]}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={styles.chapterNumber}
              >
                {chapter.number}
              </ThemedLanguageText>
            </ThemedView>

            {/* Text Content */}
            <ThemedView style={styles.textContainer}>
              {chapter.subtitle && chapter.subtitle !== chapter.title && (
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.chapterSubtitle}
                  numberOfLines={1}
                >
                  {chapter.subtitle}
                </ThemedLanguageText>
              )}

              <ThemedView style={styles.chapterInfo}>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={styles.verseCount}
                >
                  {chapter.totalVerses} ଶ୍ଲୋକର ଅନୁବାଦ
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>

            {/* Arrow Container */}
            <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={SIZES.icon.xs}
                color={theme.icon.quaternary}
              />
            </ThemedView>
          </ThemedView>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ThemedSafeAreaView>
        <View style={styles.loadingContainer}>
          <WavePattern width={200} height={200} opacity={0.1} />
          <ThemedLanguageText
            variant="secondary"
            size="large"
            fontFamily="regional_primary"
            style={styles.loadingText}
          >
            ଅନୁବାଦ ଲୋଡ଼ ହେଉଛି...
          </ThemedLanguageText>
        </View>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern
        width={width}
        height={height}
      />

      {/* Header Card */}
      <ThemedCard variant='transparent' style={styles.headerCard}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
        </TouchableOpacity>

        <ThemedLanguageText
          variant="primary"
          size="title"
          fontFamily="regional_secondary"
          style={styles.title}
        >
          ଓଡ଼ିଆ ଅନୁବାଦ
        </ThemedLanguageText>
        <ThemedView style={styles.headerActions}>
          <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
            <MaterialIcons
              name="translate"
              size={SIZES.icon.md}
              color={theme.icon.primary}
            />
          </ThemedView>
        </ThemedView>
      </ThemedCard>

      {/* Translations List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText
              variant="primary"
              size="xxl"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              ଭଗବଦ୍ଗୀତା ଅନୁବାଦସମୂହ
            </ThemedLanguageText>
          </ThemedView>
          <ThemedView style={styles.translationsContainer}>
            {translations.map(renderTranslationCard)}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.spacing.lg,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  backButton: {
    marginRight: SIZES.spacing.lg,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
  },
  actionButton: {
    borderWidth: SIZES.borderSize.sm,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  translationsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
   
  },
  translationCardContainer: {
    // marginBottom: SIZES.spacing.sm,
  },
  translationCard: {
    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    // marginBottom: SIZES.spacing.md,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
  },
  chapterNumber: {
    // Font styling handled by ThemedLanguageText component
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.2,
    shadowRadius: SIZES.shadow.md,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterSubtitle: {
    marginBottom: SIZES.spacing.sm,
  
   
  },
  verseCount: {
    
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  arrowContainer: {
    width: SIZES.avatar.sm,
    height: SIZES.avatar.sm,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
});
