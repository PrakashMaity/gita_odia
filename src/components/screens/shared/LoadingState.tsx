import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { WavePattern } from '@/illustration/cardBackground';
import { LoadingStateProps } from '@/interface/screen.interface';
import { styles } from './LoadingState.styles';

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <ThemedView style={styles.container}>
      <WavePattern width={200} height={200} opacity={0.1} />
      {message && (
        <ThemedLanguageText
          variant="secondary"
          size="large"
          fontFamily="regional_secondary"
          style={styles.text}
        >
          {message}
        </ThemedLanguageText>
      )}
    </ThemedView>
  );
};
