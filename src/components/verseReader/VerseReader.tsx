import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { getSpeakerImage } from '@/utils/speakerUtils';
import { Image, StyleSheet, View } from 'react-native';
import { FavoriteButton } from '@/components/screens/favorites/components';
import { ShareButton } from '@/components/screens/chapterDetail/components';
import React, { useRef } from 'react';

interface Verse {
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  speaker_english: string;
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
  const verseCardRef = useRef<View | null>(null);
  const [hideShareButton, setHideShareButton] = React.useState(false);

  return (
    <ThemedView style={styles.container}>
      {/* Verse Display */}
      <View ref={verseCardRef} collapsable={false}>
      <ThemedCard variant="primary" style={styles.verseCard}>
        <ThemedView style={styles.verseHeader}>
         

          <ThemedView style={styles.speakerContainer}>
            <ThemedView style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image source={getSpeakerImage(verse.speaker_english)} style={{width: 80, height: 80, borderRadius: 40,borderWidth: 3,borderColor: theme.border.primary}} />
            </ThemedView>
            <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium" style={styles.speaker}>
              {verse.speaker}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={[styles.verseNumberContainer, ]}>
            <ThemedLanguageText fontFamily='regional_secondary' size="xl">
            {i18n.t('verse.verse')} - {verse.verseNumber}
            </ThemedLanguageText>
          
          </ThemedView>

           {/* Action Buttons Container */}
           {chapterId && chapterNumber && (
                <ThemedView style={styles.actionsContainer}>
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
                  {!hideShareButton && (
                    <ThemedView style={styles.shareContainer}>
                      <ShareButton
                        verseId={verse.id}
                        chapterId={chapterId}
                        chapterNumber={chapterNumber}
                        verseNumber={verse.verseNumber}
                        verseText={verse.Language}
                        translation={verse.translation}
                        speaker={verse.speaker}
                        onAlert={onAlert}
                        verseViewRef={verseCardRef}
                        onCaptureStart={() => setHideShareButton(true)}
                        onCaptureEnd={() => setHideShareButton(false)}
                      />
                    </ThemedView>
                  )}
                </ThemedView>
              )}
        </ThemedView>

        {showLanguage && (
          <ThemedView style={styles.verseSection}>
            <ThemedView style={styles.LanguageContainer}>
              <ThemedLanguageText 
              fontFamily='regional_secondary' 
              variant="primary" 
              size="xxl" 
              style={styles.LanguageText}
            >
                {verse.Language}
              </ThemedLanguageText>

             
            </ThemedView>


          </ThemedView>
        )}

        {showTranslation && (
          <ThemedView style={styles.verseSection}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedLanguageText variant="primary" size="title" fontFamily='regional_secondary' style={styles.sectionTitle}>
                {i18n.t('verse.translation')}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText 
              fontFamily='regional_secondary' 
              variant="primary" 
              size="large" 
              style={styles.translationText}
            >
              {verse.translation}
            </ThemedLanguageText>
          </ThemedView>
        )}
      </ThemedCard>
      </View>
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
  },
  favoriteContainer: {
    // Container for favorite button
  },
  shareContainer: {
    // Container for share button
  },
  translationText: {
    textAlign: 'center',
    lineHeight: 28,
    marginTop: SIZES.spacing.sm,
  },
  
});
