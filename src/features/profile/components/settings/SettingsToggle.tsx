import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet, Switch, View } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';

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
  const theme = useThemeColors();

  return (
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
            fontFamily='regional_secondary' 
            style={styles.title}
          >
            {title}
          </ThemedLanguageText>
          {subtitle && (
            <ThemedLanguageText 
              variant='secondary'
              size='small'
              fontFamily='regional_secondary' 
              style={styles.subtitle}
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
    </ThemedView>
  );
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
    marginBottom: 2,
  },
  subtitle: {
    opacity: 0.8,
  },
});
