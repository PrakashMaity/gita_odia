import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedCard } from '../ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';
import { ThemedView } from '../ui/ThemedView/ThemedView';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: string | React.ReactNode;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  value,
  icon,
  onPress,
  rightElement,
  disabled = false,
}) => {
  const theme = useThemeColors();

  const content = (
    <ThemedCard
      variant="primary"
      style={styles.container}
      pattern="mandala"
      patternOpacity={0.08}
      borderVariant="primary"
    >
      <ThemedView style={styles.leftContent}>
        {icon && (
          <ThemedView style={[styles.iconContainer, { backgroundColor: theme.background.tertiary }]}>
            {typeof icon === 'string' ? (
              <ThemedLanguageText style={[styles.icon, { color: theme.icon.primary }]}>
                {icon}
              </ThemedLanguageText>
            ) : (
              icon
            )}
          </ThemedView>
        )}
        <ThemedView style={styles.textContent}>
          <ThemedLanguageText 
            variant='primary'
            size='medium' 
            fontFamily='regional_secondary' 
            style={[styles.title, { color: theme.text.primary }]}
          >
            {title}
          </ThemedLanguageText>
          {subtitle && (
            <ThemedLanguageText 
              variant='secondary'
              size='small'
              fontFamily='regional_secondary' 
              style={[styles.subtitle, { color: theme.text.secondary }]}
            >
              {subtitle}
            </ThemedLanguageText>
          )}
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.rightContent}>
        {value && (
          <ThemedLanguageText 
            variant='secondary'
            size='small'
            fontFamily='regional_secondary'
            style={[styles.value, { color: theme.text.secondary }]}
          >
            {value}
          </ThemedLanguageText>
        )}
        {rightElement}
        {onPress && (
          <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
            <MaterialIcons
              name="arrow-forward-ios"
              size={SIZES.icon.xs}
              color={theme.icon.quaternary}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ThemedCard>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.spacing.sm,
    marginVertical: SIZES.spacing.xs / 2,
    minHeight: 80,
    borderRadius: SIZES.radius.xl,
    borderWidth: 1,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: SIZES.spacing.lg,
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    fontSize: SIZES.icon.md,
    textAlign: 'center',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 3,
    textTransform: 'none',
   
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  subtitle: {
    textTransform: 'none',
    lineHeight: 18,
    letterSpacing: 0.2,
    fontSize: 13,
   
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginRight: SIZES.spacing.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textTransform: 'none',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.xs,
  },
});
