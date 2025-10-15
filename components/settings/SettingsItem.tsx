import { SIZES } from '@/constants/sizes';
import { TYPOGRAPHY } from '@/constants/typography';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const { theme } = useTheme();

  const content = (
    <ThemedView style={[styles.container]}>
      <View style={styles.leftContent}>
        {icon && (
          <View style={styles.iconContainer}>
            {typeof icon === 'string' ? (
              <ThemedLanguageText style={[styles.icon, { color: theme.icon.primary }]}>
                {icon}
              </ThemedLanguageText>
            ) : (
              icon
            )}
          </View>
        )}
        <View style={styles.textContent}>
          <ThemedLanguageText 
            variant='primary'
            size='large' 
            fontFamily='regional_secondary' 
            style={[styles.title, { color: theme.text.primary }]}
          >
            {title}
          </ThemedLanguageText>
          {subtitle && (
            <ThemedLanguageText 
              variant='secondary'
              size='medium'
              fontFamily='regional_secondary' 
              style={[styles.subtitle, { color: theme.text.secondary }]}
            >
              {subtitle}
            </ThemedLanguageText>
          )}
        </View>
      </View>
      
      <View style={styles.rightContent}>
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
          <ThemedLanguageText 
            variant='secondary'
            size='large'
            fontFamily='regional_secondary'
            style={[styles.chevron, { color: theme.text.secondary }]}
          >
            ›
          </ThemedLanguageText>
        )}
      </View>
    </ThemedView>
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
    paddingVertical: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.xl,
    marginVertical: SIZES.spacing.xs,
    minHeight: SIZES.button.lg,
    borderRadius: SIZES.radius.md,
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
    width: SIZES.icon.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: SIZES.icon.lg,
    textAlign: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
  
  },
  subtitle: {
 
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginRight: SIZES.spacing.md,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    opacity: 0.8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  chevron: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.light,
    opacity: 0.6,
  },
});
