import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';
import { ThemedCard } from '../ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  description,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedCard  style={styles.container} pattern='mandala' patternOpacity={0.05}>
      <View style={[styles.header, { borderBottomColor: theme.border.tertiary }]}>
        <ThemedLanguageText 
          variant='primary'
          size='large' 
          fontFamily='regional_secondary' 
          style={{...styles.title, color: theme.text.primary }}
        >
          {title}
        </ThemedLanguageText>
        {description && (
          <ThemedLanguageText 
            variant='secondary'
            size='medium'
            fontFamily='regional_secondary' 
            style={{...styles.description, color: theme.text.secondary }}
          >
            {description}
          </ThemedLanguageText>
        )}
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.spacing.sm,
    marginHorizontal: SIZES.spacing.lg,
    padding: 0,
  },
  header: {
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
    borderBottomWidth: SIZES.borderSize.xs,
  },
  title: {
   
  },
  description: {
    
  },
  content: {
    paddingTop: SIZES.spacing.xs,
    paddingBottom: SIZES.spacing.sm,
  },
});
