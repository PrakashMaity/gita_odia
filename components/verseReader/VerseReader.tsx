import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { Image, StyleSheet } from 'react-native';
import { FavoriteButton } from '../favorite';

interface Verse {
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  id: string;
}

interface VerseReaderProps {
  verse: Verse;
  showLanguage: boolean;
  showTranslation: boolean;
  onToggleLanguage: () => void;
  onToggleTranslation: () => void;
  chapterId?: string;
  chapterNumber?: string;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export default function VerseReader({
  verse,
  showLanguage,
  showTranslation,
  onToggleLanguage,
  onToggleTranslation,
  chapterId,
  chapterNumber,
  onAlert,
}: VerseReaderProps) {
  const { theme } = useTheme();
  const speakerImageMapper = (speaker: string) => {
    switch (speaker) {
      case 'ଧୃତରାଷ୍ଟ୍ର': return require('@/assets/images/speaker/dhritarystra.png');
      case 'ସଞ୍ଜୟ': return require('@/assets/images/speaker/sanjay.png');
      case 'ଅର୍ଜୁନ': return require('@/assets/images/speaker/arjuna.png');
      case 'ପରମେଶ୍ୱର':
      case 'ଶ୍ରୀଭଗବାନ': return require('@/assets/images/speaker/shreekrishna.png');
      case 'ଦୁର୍ଯ୍ୟୋଧନ': return require('@/assets/images/speaker/duryadhona.png');
    }
  }

  return (
    <ThemedView style={styles.container}>
      {/* Verse Display */}
      <ThemedCard variant="primary" style={styles.verseCard}>
        <ThemedView style={styles.verseHeader}>
         

          <ThemedView style={styles.speakerContainer}>
            <ThemedView style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image source={speakerImageMapper(verse.speaker)} style={{width: 80, height: 80, borderRadius: 40,borderWidth: 3,borderColor: theme.border.primary}} />
            </ThemedView>
            <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium" style={styles.speaker}>
              {verse.speaker}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={[styles.verseNumberContainer, ]}>
            <ThemedLanguageText fontFamily='regional_secondary' size="xl">
            ଶ୍ଲୋକ - {verse.verseNumber}
            </ThemedLanguageText>
          
          </ThemedView>

           {/* Favorite Button for Language verse */}
           {chapterId && chapterNumber && (
                <ThemedView style={styles.favoriteContainer}>
                  <FavoriteButton
                    verseId={verse.id}
                    chapterId={chapterId}
                    chapterNumber={chapterNumber}
                    verseNumber={verse.verseNumber}
                    verseText={verse.Language}
                    onAlert={onAlert}
                  />
                </ThemedView>
              )}
        </ThemedView>

        {showLanguage && (
          <ThemedView style={styles.verseSection}>
            <ThemedView style={styles.LanguageContainer}>
              <ThemedLanguageText fontFamily='regional_tertiary' variant="primary" size="xxl" style={styles.LanguageText}>
                {verse.Language}
              </ThemedLanguageText>

             
            </ThemedView>

            {/* Audio Button */}

          </ThemedView>
        )}

        {showTranslation && (
          <ThemedView style={styles.verseSection}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedLanguageText variant="primary" size="title" fontFamily='regional_secondary' style={styles.sectionTitle}>
                ଅନୁବାଦ
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText fontFamily='regional_tertiary' variant="primary" size="large" style={styles.translationText}>
              {verse.translation}
            </ThemedLanguageText>
          </ThemedView>
        )}
      </ThemedCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verseCard: {
    marginBottom: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.xl,
  },
  verseNumberContainer: {
   
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  verseNumber: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  speakerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  speaker: {
    marginLeft: SIZES.spacing.sm,
    opacity: 0.9,
  },
  verseSection: {
    marginBottom: SIZES.spacing.xl,
  },
  sectionHeader: {
    marginBottom: SIZES.spacing.md,
  },
  sectionTitle: {
    textAlign: 'center',
  },
  LanguageContainer: {
    alignItems: 'center',
  },
  LanguageText: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    lineHeight: 36,
    alignItems: 'center',
    alignSelf: 'center',
  },
  favoriteContainer: {
    marginTop: SIZES.spacing.sm,
  },
  translationText: {
    textAlign: 'center',
    lineHeight: 28,
    marginTop: SIZES.spacing.sm,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.lg,
    borderRadius: SIZES.radius.md,
    alignSelf: 'flex-start',
  },
});
