import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import i18n from '@/i18n';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { MangalacharanSectionCard } from './components/MangalacharanSectionCard';
import { styles } from './MangalacharanScreen.styles';
import { LayoutImages } from '@/utils/assets';

export const MangalacharanScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mangalacharanText = i18n.t('mangalacharan.mantraText');
  const meaningText = i18n.t('mangalacharan.meaningText');
  const instructions = i18n.t('mangalacharan.instructions') as string[];

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('mangalacharan.title')} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MangalacharanSectionCard
            content={i18n.t('mangalacharan.intro')}
            variant="intro"
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.mantraTitle"
            content={mangalacharanText}
            textStyle="center"
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.meaningTitle"
            content={meaningText}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.instructionsTitle"
            content={instructions}
            isList
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
