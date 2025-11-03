import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import i18n from '@/i18n';
import { Dimensions, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { DhyanaSectionCard } from './components/DhyanaSectionCard';
import { styles } from './DhyanaScreen.styles';

export const DhyanaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const dhyanaText = i18n.t('dhyana.slokaText');
  const meaningText = i18n.t('dhyana.meaningText');
  const benefits = i18n.t('dhyana.benefits') as string[];
  const steps = i18n.t('dhyana.steps') as string[];

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />
      
      <PageHeader title={i18n.t('dhyana.title')} showBackButton={true} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DhyanaSectionCard
          titleKey="dhyana.introTitle"
          content={i18n.t('dhyana.introText')}
          variant="intro"
        />

        <DhyanaSectionCard
          titleKey="dhyana.slokaTitle"
          content={dhyanaText}
        />

        <DhyanaSectionCard
          titleKey="dhyana.meaningTitle"
          content={meaningText}
        />

        <DhyanaSectionCard
          titleKey="dhyana.benefitsTitle"
          content={benefits}
          isList
          listType="bullet"
        />

        <DhyanaSectionCard
          titleKey="dhyana.stepsTitle"
          content={steps}
          isList
          listType="numbered"
        />
      </ScrollView>
    </ThemedView>
  );
};
