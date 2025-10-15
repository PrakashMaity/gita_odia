import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, Switch, View } from 'react-native';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';
import { ThemedView } from '../ui/ThemedView/ThemedView';

interface SettingsToggleProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: string | React.ReactNode;
  disabled?: boolean;
  showDivider?: boolean;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  icon,
  disabled = false,
  showDivider = false,
}) => {
  const { theme } = useTheme();

  return (
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
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.background.card,
          true: theme.button.primary.background,
        }}
        thumbColor={value ? theme.text.primary : theme.text.secondary}
        ios_backgroundColor={theme.background.card}
      />
      
      {showDivider && (
        <ThemedView style={[styles.divider, { backgroundColor: theme.border.tertiary }]} />
      )}
    </ThemedView>
  );
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
  divider: {
    position: 'absolute',
    bottom: 0,
    left: SIZES.spacing.xl,
    right: SIZES.spacing.xl,
    height: SIZES.borderSize.xs,
  },
});
