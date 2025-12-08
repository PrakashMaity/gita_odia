import { LoadingState, PageHeader } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useTranslationStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { AudioModal } from './components/AudioModal';
import { ErrorState } from './components/ErrorState';
import { TranslationMessage } from './components/TranslationMessage';
import { styles } from './TranslationDetailScreen.styles';

export const TranslationDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTranslationById, isLoading } = useTranslationStore();
  const { theme } = useTheme();
  const [isFullChapterAudioModalVisible, setIsFullChapterAudioModalVisible] = useState(false);
  
  const translationData = id ? getTranslationById(id) : null;

  // Prepare full chapter verses for audio with speaker-specific voices
  const fullChapterVerses = useMemo(() => {
    if (!translationData?.verses) return [];
    
    return translationData.verses.map((verse) => ({
      text: verse.translation,
      speakerEnglish: verse.speaker_english,
    }));
  }, [translationData?.verses]);

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  if (!translationData) {
    return <ErrorState />;
  }

  const { chapter, verses } = translationData;

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title={`${chapter.title} || ${chapter.subtitle}`}
          rightAction={
            <TouchableOpacity
              onPress={() => setIsFullChapterAudioModalVisible(true)}
              style={[
                styles.headerAudioButton,
                { backgroundColor: theme.background.quaternary },
              ]}
            >
              <MaterialIcons
                name="volume-down"
                size={SIZES.icon.md}
                color={theme.icon.tertiary}
              />
            </TouchableOpacity>
          }
        />

        <ScrollView 
          style={styles.chatContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        >
          {verses?.map((verse, index) => (
            <TranslationMessage
              key={verse.id}
              verse={verse}
              index={index}
              shouldShowBanner={(index + 1) % 4 === 0}
              chapterId={chapter.id}
              chapterNumber={chapter.number}
            />
          ))}
        </ScrollView>

        {/* Full Chapter Audio Modal */}
        <AudioModal
          visible={isFullChapterAudioModalVisible}
          onClose={() => setIsFullChapterAudioModalVisible(false)}
          verses={fullChapterVerses}
          title={`${chapter.title} || ${chapter.subtitle}`}
          chapterNumber={chapter.number}
        />
      </ThemedView>
    </ImageBackground>
  );
};
