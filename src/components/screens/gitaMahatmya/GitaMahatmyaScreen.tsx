import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { commonStyles } from '@/constants';
import i18n from '@/i18n';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { MahatmyaSectionCard } from './components/MahatmyaSectionCard';
import { LayoutImages } from '@/utils/assets';

export const GitaMahatmyaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mahatmyaText = i18n.t('gitaMahatmya.mahatmyaText');
  const benefits = i18n.t('gitaMahatmya.benefits') as string[];

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={commonStyles.screen.container}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={commonStyles.screen.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('gitaMahatmya.title')} />

        <ScrollView 
          style={commonStyles.screen.scrollView} 
          contentContainerStyle={commonStyles.screen.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <MahatmyaSectionCard
            content={i18n.t('gitaMahatmya.intro')}
            variant="intro"
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.significanceTitle"
            content={i18n.t('gitaMahatmya.significanceText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.mahatmyaTitle"
            content={mahatmyaText}
            textStyle="center"
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.mahatmyaMeaningTitle"
            content={i18n.t('gitaMahatmya.mahatmyaMeaningText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.benefitsTitle"
            content={benefits}
            isList
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.readingBenefitsTitle"
            content={i18n.t('gitaMahatmya.readingBenefitsText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.historicalContextTitle"
            content={i18n.t('gitaMahatmya.historicalContextText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.spiritualSignificanceTitle"
            content={i18n.t('gitaMahatmya.spiritualSignificanceText')}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
