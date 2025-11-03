import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
  },
  title: {
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
});

