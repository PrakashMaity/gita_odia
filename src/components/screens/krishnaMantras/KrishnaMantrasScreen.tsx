import { PageHeader } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { LayoutImages } from '@/utils/assets';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { MangalacharanSectionCard } from '../mangalacharan/components/MangalacharanSectionCard';
import { styles } from './KrishnaMantrasScreen.styles';

export const KrishnaMantrasScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mantras = i18n.t('krishnaMantras.mantras') as any;

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('krishnaMantras.title')} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MangalacharanSectionCard
            content={i18n.t('krishnaMantras.intro')}
            variant="intro"
          />

          {/* Render each mantra with its details */}
          {Object.keys(mantras).map((mantraKey) => {
            const mantra = mantras[mantraKey];
            return (
              <ThemedView key={mantraKey}>
                <MangalacharanSectionCard
                  titleKey={`krishnaMantras.mantras.${mantraKey}.name`}
                  content={mantra.mantraText}
                  textStyle="center"
                />

                <MangalacharanSectionCard
                  titleKey="krishnaMantras.meaningTitle"
                  content={mantra.meaning}
                />

                <MangalacharanSectionCard
                  titleKey="krishnaMantras.niyomTitle"
                  content={mantra.niyom}
                  isList
                />

                <MangalacharanSectionCard
                  titleKey="krishnaMantras.podhotiTitle"
                  content={mantra.podhoti}
                  isList
                />

                {mantra.benefits && (
                  <MangalacharanSectionCard
                    titleKey="krishnaMantras.benefitsTitle"
                    content={mantra.benefits}
                    isList
                  />
                )}
              </ThemedView>
            );
          })}
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
