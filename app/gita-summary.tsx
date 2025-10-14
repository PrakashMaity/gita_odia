import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function GitaSummaryScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const getSummaryData = () => {
    const chapters = i18n.t('gitaSummary.chapters');
    return Object.keys(chapters).map((key, index) => ({
      chapter: `${index + 1}${i18n.t('verse.chapter')}`,
      title: chapters[key].title,
      summary: chapters[key].summary
    }));
  };

  const summaryData = getSummaryData();

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern 
        width={width} 
        height={height} 
      />
      
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.lg} color={theme.icon.primary} />
        </TouchableOpacity>
        <ThemedLanguageText 
          variant="primary" 
          size="title" 
          fontFamily="regional_primary"
          style={styles.title}
        >
          {i18n.t('gitaSummary.title')}
        </ThemedLanguageText>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction Card */}
        <ThemedCard style={styles.introCard}>
         
          <ThemedLanguageText
            variant="secondary"
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.introText}
          >
            {i18n.t('gitaSummary.intro')}
          </ThemedLanguageText>
        </ThemedCard>


        {/* Summary Cards */}
        {summaryData.map((item, index) => (
          <ThemedCard key={index} style={styles.summaryCard}>
            <ThemedView style={styles.cardHeader}>
              <ThemedView style={[styles.chapterIndicator, { backgroundColor: theme.background.quaternary }]}>
                <ThemedLanguageText 
                  variant="primary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={styles.chapterNumber}
                >
                  {item.chapter}
                </ThemedLanguageText>
              </ThemedView>
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_primary"
                style={styles.chapterTitle}
              >
                {item.title}
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedLanguageText 
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
             
            >
              {item.summary}
            </ThemedLanguageText>
          </ThemedCard>
        ))}

        {/* Conclusion Card */}
        <ThemedCard style={styles.conclusionCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              {i18n.t('gitaSummary.teachingsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.teachingsList}>
            {i18n.t('gitaSummary.teachings').map((teaching: string, index: number) => (
              <ThemedView key={index} style={styles.teachingItem}>
                <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.teachingText}
                >
                  {teaching}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  backButton: {
    padding: SIZES.spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  introTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
  },
  introText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
  summaryCard: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
    gap: SIZES.spacing.md,
  },
  chapterIndicator: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.sm,
  },
  chapterNumber: {
    color: '#FFFFFF',
  },
  chapterTitle: {
    flex: 1,
  },
  conclusionCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  teachingsList: {
    gap: SIZES.spacing.md,
  },
  teachingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.round,
    marginTop: SIZES.spacing.sm,
  },
  teachingText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});
