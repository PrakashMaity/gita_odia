import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet, View } from 'react-native';
import { ThemedCard } from '../ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';
import { ThemedView } from '../ui/ThemedView/ThemedView';

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
  const theme = useThemeColors();

  return (
    <ThemedCard 
      variant="card" 
      style={styles.container}
      pattern='mandala' 
      patternOpacity={0.08}
      borderVariant="primary"
    >
      <View style={styles.header}>
        <ThemedView style={[styles.indicator, { backgroundColor: theme.status.success + '40' }]} />
        <ThemedLanguageText 
          variant='primary'
          size='medium' 
          fontFamily='none' 
          style={[styles.title, { color: theme.text.primary }]}
        >
          {title}
        </ThemedLanguageText>
      </View>
      {description && (
        <ThemedLanguageText 
          variant='secondary'
          size='small'
          fontFamily='none' 
          style={[styles.description, { color: theme.text.secondary }]}
        >
          {description}
        </ThemedLanguageText>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SIZES.spacing.xs,
    marginHorizontal: 0,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SIZES.spacing.xs,
  },
  indicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.xs,
  },
  title: {
    flex: 1,
    fontWeight: '700',
    textTransform: 'none',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  description: {
    paddingBottom: SIZES.spacing.xs,
    paddingTop: SIZES.spacing.xs / 2,
    textTransform: 'none',
    lineHeight: 20,
    letterSpacing: 0.2,
    fontSize: 13,
    fontWeight: '400',
  },
  content: {
    paddingTop: SIZES.spacing.xs / 2,
  },
});
