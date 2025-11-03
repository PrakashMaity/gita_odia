import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useTheme } from '@/hooks/useTheme';
import { EmptyStateProps } from '@/interface/screen.interface';
import { styles } from './EmptyState.styles';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      {icon}
      <ThemedLanguageText 
        variant="primary" 
        size="xl" 
        fontFamily="regional_secondary"
        style={styles.title}
      >
        {title}
      </ThemedLanguageText>
      {subtitle && (
        <ThemedLanguageText 
          variant="secondary" 
          size="medium" 
          fontFamily="regional_secondary"
          style={styles.subtitle}
        >
          {subtitle}
        </ThemedLanguageText>
      )}
    </ThemedView>
  );
};
