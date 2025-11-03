import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { commonStyles } from '@/constants';
import i18n from '@/i18n';
import { Dimensions, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { MahatmyaSectionCard } from './components/MahatmyaSectionCard';

export const GitaMahatmyaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mahatmyaText = i18n.t('gitaMahatmya.mahatmyaText');
  const benefits = i18n.t('gitaMahatmya.benefits') as string[];

  return (
    <ThemedView variant="primary" style={commonStyles.screen.container}>
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
          textStyle="center"
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.mahatmyaTitle"
          content={mahatmyaText}
          textStyle="center"
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.benefitsTitle"
          content={benefits}
          isList
        />
      </ScrollView>
    </ThemedView>
  );
};
