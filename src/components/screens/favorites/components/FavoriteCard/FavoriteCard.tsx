import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { FavoriteVerse } from '@/store';
import { formatFullDate } from '@/utils/dateUtils';
import { getSpeakerAvatar } from '@/utils/speakerUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { styles } from './FavoriteCard.styles';

interface FavoriteCardProps {
  favorite: FavoriteVerse;
  index: number;
  onPress: (chapterId: string, verseNumber: string) => void;
  onDelete: (verseId: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  index,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      key={`${favorite.verseId}-${index}`}
      onPress={() => onPress(favorite.chapterId, favorite.verseNumber)}
      style={styles.container}
      activeOpacity={0.8}
    >
      <ThemedCard style={styles.card}>
        <ThemedView style={styles.messageHeader}>
          <ThemedView style={styles.speakerInfo}>
            <Image 
              source={getSpeakerAvatar(favorite.chapterNumber)} 
              style={styles.speakerAvatar}
              resizeMode="cover"
            />
            <ThemedView style={styles.speakerDetails}>
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.speakerName}
              >
                {i18n.t('chapter.chapter')} {favorite.chapterNumber} • {i18n.t('verse.verse')} {favorite.verseNumber}
              </ThemedLanguageText>
              <ThemedLanguageText 
                variant="secondary" 
                size="small" 
                fontFamily="regional_secondary"
                style={styles.favoriteDate}
              >
                {formatFullDate(favorite.timestamp)}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>
          
          <TouchableOpacity
            onPress={() => onDelete(favorite.verseId)}
            style={styles.removeButton}
          >
            <Ionicons name="heart-dislike-outline" size={SIZES.icon.md} color={theme.icon.error} />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.messageContent}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.translationText}
          >
            {favorite.verseText}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );
};

