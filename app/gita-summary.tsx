import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function GitaSummaryScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const summaryData = [
    {
      chapter: '୧ମ ଅଧ୍ୟାୟ',
      title: 'ଅର୍ଜୁନବିଷାଦଯୋଗ',
      summary: 'କୁରୁକ୍ଷେତ୍ର ଯୁଦ୍ଧର ପ୍ରାକ୍କାଳେ ଅର୍ଜୁନର ମନୋବେଦନା ଓ କୃଷ୍ଣର ଉପଦେଶର ସୂଚନା।'
    },
    {
      chapter: '୨ୟ ଅଧ୍ୟାୟ',
      title: 'ସାଂଖ୍ୟଯୋଗ',
      summary: 'କର୍ମଯୋଗ, ଜ୍ଞାନଯୋଗ ଓ ଆତ୍ମାର ଅମରତ୍ୱ ସମ୍ପର୍କରେ ମୌଳିକ ଶିକ୍ଷା।'
    },
    {
      chapter: '৩য় ଅଧ୍ୟାୟ',
      title: 'କର୍ମଯୋଗ',
      summary: 'ନିଷ୍କାମ କର୍ମର ମାଧ୍ୟମରେ ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତିର ପଥ।'
    },
    {
      chapter: '৪র্থ ଅଧ୍ୟାୟ',
      title: 'ଜ୍ଞାନକର୍ମସନ୍ନ୍ୟାସଯୋଗ',
      summary: 'ଜ୍ଞାନ ଓ କର୍ମର ସମନ୍ୱୟ ଏବଂ ଯୋଗର ବିଭିନ୍ନ ପଦ୍ଧତି।'
    },
    {
      chapter: '৫ম ଅଧ୍ୟାୟ',
      title: 'କର୍ମସନ୍ନ୍ୟାସଯୋଗ',
      summary: 'କର୍ମତ୍ୟାଗ ଓ କର୍ମଯୋଗର ମଧ୍ୟରେ ପାର୍ଥକ୍ୟ ଏବଂ ସମନ୍ୱୟ।'
    },
    {
      chapter: '৬ষ্ঠ ଅଧ୍ୟାୟ',
      title: 'ଧ୍ୟାନଯୋଗ',
      summary: 'ଧ୍ୟାନ ও ଯୋଗের মাধ্যমে আত্মসংযমের শিক্ষা।'
    },
    {
      chapter: '৭ম ଅଧ୍ୟାୟ',
      title: 'ଜ୍ଞାନবিଜ୍ଞାନଯୋଗ',
      summary: 'ঈশ্বরের প্রকৃতি ও ଭକ୍ତির মাধ্যমে ঈশ্বরলাভের পথ।'
    },
    {
      chapter: '৮ম ଅଧ୍ୟାୟ',
      title: 'অক্ষরব্রহ্মଯୋଗ',
      summary: 'পরমাত্মার ଧ୍ୟାନ ও মৃত্যুকালে ঈশ্বরের স্মরণ।'
    },
    {
      chapter: '৯ম ଅଧ୍ୟାୟ',
      title: 'রাজবিদ্যারাজগুহ্যଯୋଗ',
      summary: 'ঈশ্বরের সর্বব্যাপীতা ও ଭକ୍ତির মহিমা।'
    },
    {
      chapter: '১০ম ଅଧ୍ୟାୟ',
      title: 'বিভূতিଯୋଗ',
      summary: 'ঈশ্বরের ঐশ্বর্য ও মহিমার বর্ণনা।'
    },
    {
      chapter: '১১শ ଅଧ୍ୟାୟ',
      title: 'বিশ্বরূপদর্শনଯୋଗ',
      summary: 'কৃষ্ণের বিশ্বরূপ দর্শন ও অর্জুনের ভয়ভীতি।'
    },
    {
      chapter: '১২শ ଅଧ୍ୟାୟ',
      title: 'ଭକ୍ତিଯୋଗ',
      summary: 'ଭକ୍ତিଯୋଗের শ্রেষ্ঠত্ব ও ଭକ୍ତের গুণাবলী।'
    },
    {
      chapter: '১৩শ ଅଧ୍ୟାୟ',
      title: 'ক্ষেত্রক্ষেত্রজ্ঞবিভাগଯୋଗ',
      summary: 'ক্ষেত্র ও ক্ষেত্রজ্ঞের পার্থক্য এবং প্রকৃতির গুণ।'
    },
    {
      chapter: '১৪শ ଅଧ୍ୟାୟ',
      title: 'গুণত্রয়বিভাগଯୋଗ',
      summary: 'সত্ত্ব, রজঃ ও তমঃ গুণের বর্ণনা ও মুক্তির পথ।'
    },
    {
      chapter: '১৫শ ଅଧ୍ୟାୟ',
      title: 'পুরুষোত্তমଯୋଗ',
      summary: 'অশ্বত্থ বৃক্ষের রূপক ও পরমাত্মার স্বরূপ।'
    },
    {
      chapter: '১৬শ ଅଧ୍ୟାୟ',
      title: 'দৈবাসুরসম্পদবিভাগଯୋଗ',
      summary: 'দৈবী ও আসুরী প্রকৃতির পার্থক্য।'
    },
    {
      chapter: '১৭শ ଅଧ୍ୟାୟ',
      title: 'শ্রদ্ধাত্রয়বিভাগଯୋଗ',
      summary: 'তিন প্রকার শ্রদ্ধা ও তপস্যার বর্ণনা।'
    },
    {
      chapter: '১৮শ ଅଧ୍ୟାୟ',
      title: 'মোক্ষসন্ন্যাসଯୋଗ',
      summary: 'গীতার সারসংক্ষেপ ও মোক্ষলাভের উপায়।'
    }
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
          গীতার সারাংশ
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
            গীতা হল ১৮টি ଅଧ୍ୟାୟে বিଭକ୍ତ একটি পবিত্র গ্রন্থ। প্রতিটি ଅଧ୍ୟାୟে রয়েছে জীবনের বিভিন্ন দিক সম্পর্কে গভীর শিক্ষা। এখানে প্রতিটি ଅଧ୍ୟାୟের মূল বিষয়বস্তুর সংক্ষিপ্ত বিবরণ দেওয়া হয়েছে।
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
              গীতার মূল শিক্ষা
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.teachingsList}>
            <ThemedView style={styles.teachingItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.teachingText}
              >
                নিষ্কাম କର୍ମের মাধ্যমে আধ্যাত্মিক উন্নতি
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedView style={styles.teachingItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.teachingText}
              >
                ଭକ୍ତিଯୋଗের মাধ্যমে ঈশ্বরলাভ
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedView style={styles.teachingItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.teachingText}
              >
                আত্মার অমরত্ব ও ঈশ্বরের সর্বব্যাপীতা
              </ThemedLanguageText>
            </ThemedView>
            
            <ThemedView style={styles.teachingItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.teachingText}
              >
                জীবনের সকল পরিস্থিতিতে ধর্ম পালন
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
