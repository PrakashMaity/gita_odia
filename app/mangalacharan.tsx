import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function MangalacharanScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const mangalacharanText = `ওঁ পূর্ণমদঃ পূর্ণমিদং পূর্ণাৎ পূর্ণমুদচ্যতে।
পূর্ণস্য পূর্ণমাদায় পূর্ণমেবাবশিষ্যতে॥

ওঁ শান্তিঃ শান্তিঃ শান্তিঃ॥

ওঁ নারায়ণং নমস্কৃত্য নরং চৈব নরোত্তমম্।
দেবীং সরস্বতীং ব্যাসং ততো জয়মুদীরয়েৎ॥

ওঁ ভদ্রং কর্ণেভিঃ শৃণুয়াম দেবাঃ।
ভদ্রং পশ্যেমাক্ষভির্যজত্রাঃ।
স্থিরৈরঙ্গৈস্তুষ্টুবাংসস্তনূভিঃ।
ব্যশেম দেবহিতং যদায়ুঃ॥

ওঁ শান্তিঃ শান্তিঃ শান্তিঃ॥`;

  const meaningText = `ଏହି ମଙ୍ଗଳାଚରଣରେ ଆମେ ଈଶ୍ୱରଙ୍କ ନିକଟରେ ପ୍ରାର୍ଥନା କରୁ ଯେ, ଆମର ଜ୍ଞାନ, ବୁଦ୍ଧି ଓ ଶକ୍ତି ବୃଦ୍ଧି ପାଉ ଏବଂ ଆମେ ସତ୍ୟର ପଥରେ ଚଳିପାରୁ।`;

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
          মঙ্গলাচরণ
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
            মঙ্গলাচরণ হল গীতা পাঠের পূর্বে উচ্চারিত পবিত্র মন্ত্রসমূহ। এটি আমাদের মনকে শান্ত করে এবং জ্ঞানের জন্য প্রস্তুত করে।
          </ThemedLanguageText>
        </ThemedCard>

        {/* Prayer Text Card */}
        <ThemedCard style={styles.prayerCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_primary"
              style={styles.sectionTitle}
            >
              মঙ্গলাচরণ মন্ত্র
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_secondary"
            style={styles.prayerText}
          >
            {mangalacharanText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Meaning Card */}
        <ThemedCard style={styles.meaningCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_primary"
              style={styles.sectionTitle}
            >
              অর্থ
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="secondary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.meaningText}
          >
            {meaningText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Instructions Card */}
        <ThemedCard style={styles.instructionsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_primary"
              style={styles.sectionTitle}
            >
              পাঠের নির্দেশনা
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.instructionList}>
            <ThemedView style={styles.instructionItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.instructionText}
              >
                শান্ত পরিবেশে বসে মঙ্গলাচরণ পাঠ করুন
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedView style={styles.instructionItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.instructionText}
              >
                প্রতিটি মন্ত্র মনোযোগ সহকারে উচ্চারণ করুন
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedView style={styles.instructionItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.instructionText}
              >
                মঙ্গলাচরণের পর গীতা পাঠ শুরু করুন
              </ThemedLanguageText>
            </ThemedView>
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
  prayerCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  instructionsCard: {
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
  prayerText: {
    textAlign: 'center',
 
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  instructionList: {
    gap: SIZES.spacing.md,
  },
  instructionItem: {
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
  instructionText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});
