import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';
import { MaterialIcons } from '@expo/vector-icons';
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
  const theme = useThemeColors();

  const content = (
    <ThemedView style={[styles.container]}>
      <View style={styles.leftContent}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: theme.background.quaternary }]}>
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
            size='medium' 
            fontFamily='none' 
            style={[styles.title, { color: theme.text.primary }]}
          >
            {title}
          </ThemedLanguageText>
          {subtitle && (
            <ThemedLanguageText 
              variant='secondary'
              size='small'
              fontFamily='none' 
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
            fontFamily='none'
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
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
    marginVertical: SIZES.spacing.xs / 2,
    minHeight: 56,
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
    marginRight: SIZES.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: SIZES.icon.md,
    textAlign: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    marginBottom: 3,
    textTransform: 'none',
    fontWeight: '700',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  subtitle: {
    textTransform: 'none',
    lineHeight: 18,
    letterSpacing: 0.2,
    fontSize: 13,
    fontWeight: '400',
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
