import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function DhyanaScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const dhyanaText = `ধ্যানং পরমং ব্রহ্মণি সচ্চিদানন্দরূপিণি।
তস্মিন্ ধ্যাতৃধ্যেয়ভাবেন ভেদো নাস্তি কদাচন॥

ধ্যানং মনসি সংস্থাপ্য পরমাত্মনি চেতসা।
সর্বভূতেষু চৈতন্যং সমং পশ্যতি যোগী॥

ধ্যানযোগেন মনসি পশ্যন্তি তে যুগানুযুগং।
তস্মিন্ ধ্যাতৃধ্যেয়ভাবেন ভেদো নাস্তি কদাচন॥`;

  const meaningText = `ଧ୍ୟାନ ହେଉଛି ପରମାତ୍ମାଙ୍କ ପ୍ରତି ମନୋନିବେଶ। ଯେତେବେଳେ ଆମେ ଧ୍ୟାନରେ ବସୁ, ସେତେବେଳେ ଆମର ମନ ଶାନ୍ତ ହୁଏ ଏବଂ ଆମେ ଈଶ୍ୱରଙ୍କ ସହିତ ଏକାତ୍ମତା ଅନୁଭବ କରୁ।`;

  const benefits = [
    'ମନ ଶାନ୍ତ ଓ ସ୍ଥିର ହୁଏ',
    'ଚିନ୍ତାର ଗତି କମେ',
    'ଆତ୍ମବିଶ୍ୱାସ ବୃଦ୍ଧି ପାଏ',
    'ସ୍ଟ୍ରେସ୍ ଓ ଉଦ୍ବେଗ କମେ',
    'ସୃଜନଶୀଳତା ବୃଦ୍ଧି ପାଏ',
    'ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତି ଘଟେ'
  ];

  const steps = [
    'ଶାନ୍ତ ଓ ନିର୍ଜନ ସ୍ଥାନ ନିର୍ବାଚନ କରନ୍ତୁ',
    'ସୁସ୍ଥଭାବରେ ବସନ୍ତୁ (ପଦ୍ମାସନ ବା ସୁଖାସନ)',
    'ଚକ୍ଷୁ ବନ୍ଦ କରି ଗଭୀର ଶ୍ୱାସ ନିଅନ୍ତୁ',
    'ମନକୁ ଶ୍ୱାସର ଉପରେ କେନ୍ଦ୍ରୀଭୂତ କରନ୍ତୁ',
    'ଯେତେବେଳେ ମନ ଭ୍ରମଣ କରେ, ପୁନର୍ବାର ଶ୍ୱାସରେ ଫେରନ୍ତୁ',
    'ପ୍ରତିଦିନ ୧୦-୧୫ ମିନିଟ୍ ଧ୍ୟାନ କରନ୍ତୁ'
  ];

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
          ধ্যান
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
            variant="primary" 
            size="large" 
            fontFamily="regional_primary"
            style={styles.introTitle}
          >
            ধ্যান ও চিন্তন
          </ThemedLanguageText>
          <ThemedLanguageText 
            variant="secondary" 
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.introText}
          >
            ধ্যান হল আধ্যাত্মিক উন্নতির একটি গুরুত্বপূর্ণ মাধ্যম। এটি আমাদের মনকে শান্ত করে এবং আত্মার সাথে সংযোগ স্থাপন করতে সাহায্য করে।
          </ThemedLanguageText>
        </ThemedCard>

        {/* Dhyana Text Card */}
        <ThemedCard style={styles.dhyanaCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              ধ্যান সম্পর্কিত শ্লোক
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_tertiary"
            style={styles.dhyanaText}
          >
            {dhyanaText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Meaning Card */}
        <ThemedCard style={styles.meaningCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              ধ্যানের অর্থ
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

        {/* Benefits Card */}
        <ThemedCard style={styles.benefitsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              ধ্যানের উপকারিতা
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <ThemedView key={index} style={styles.benefitItem}>
                <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.benefitText}
                >
                  {benefit}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>

        {/* Steps Card */}
        <ThemedCard style={styles.stepsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              ধ্যানের পদ্ধতি
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.stepsList}>
            {steps.map((step, index) => (
              <ThemedView key={index} style={styles.stepItem}>
                <ThemedView style={[styles.stepNumber, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText 
                    variant="primary"
                    size="small"
                    fontFamily="regional_primary"
                    style={styles.stepNumberText}
                  >
                    {index + 1}
                  </ThemedLanguageText>
                </ThemedView>
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.stepText}
                >
                  {step}
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
  dhyanaCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  benefitsCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  stepsCard: {
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
  dhyanaText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
    fontStyle: 'italic',
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  benefitsList: {
    gap: SIZES.spacing.md,
  },
  benefitItem: {
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
  benefitText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
  stepsList: {
    gap: SIZES.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xs,
  },
  stepNumberText: {
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});
