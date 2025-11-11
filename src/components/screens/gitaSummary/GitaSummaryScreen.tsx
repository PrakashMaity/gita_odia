import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import i18n from '@/i18n';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { ConclusionCard } from './components/ConclusionCard';
import { SummaryCard } from './components/SummaryCard';
import { useGitaSummaryData } from './hooks/useGitaSummaryData';
import { styles } from './GitaSummaryScreen.styles';
import { LayoutImages } from '@/utils/assets';

export const GitaSummaryScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const { summaryData, teachings } = useGitaSummaryData();

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('gitaSummary.title')} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedCard style={styles.introCard}>
            <ThemedLanguageText
              variant="secondary"
              size="medium" 
              fontFamily="regional_secondary"
              style={styles.introText}
            >
              {i18n.t('gitaSummary.intro')}
            </ThemedLanguageText>
          </ThemedCard>

          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              chapter={item.chapter}
              title={item.title}
              summary={item.summary}
            />
          ))}

          <ConclusionCard
            titleKey="gitaSummary.teachingsTitle"
            teachings={teachings}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
