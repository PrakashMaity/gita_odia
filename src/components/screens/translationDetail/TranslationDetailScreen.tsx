import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { useTranslationStore } from '@/store';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { PageHeader, LoadingState } from '@/components/shared';
import { ErrorState } from './components/ErrorState';
import { TranslationMessage } from './components/TranslationMessage';
import { styles } from './TranslationDetailScreen.styles';

export const TranslationDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTranslationById, isLoading } = useTranslationStore();
  
  const translationData = id ? getTranslationById(id) : null;

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  if (!translationData) {
    return <ErrorState />;
  }

  const { chapter, verses } = translationData;

  return (
    <ThemedView variant="primary" style={styles.container}>
      <PageHeader title={`${chapter.title} || ${chapter.subtitle}`} />

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
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
};
