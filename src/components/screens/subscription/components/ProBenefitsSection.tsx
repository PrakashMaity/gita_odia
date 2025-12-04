import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

const PRO_BENEFITS = [
  'subscription.features.adFree',
  'subscription.features.allFeatures',
  'subscription.features.prioritySupport',
  'subscription.features.unlimitedAccess',
];

export const ProBenefitsSection: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ThemedCard
      variant="primary"
      style={styles.container}
      pattern="sacredGeometry"
      patternOpacity={0.12}
    >
      <ThemedView style={styles.header}>
        <MaterialIcons 
          name="workspace-premium" 
          size={SIZES.icon.xl} 
          color={theme.icon.primary}
        />
        <ThemedLanguageText
          variant="primary"
          size="xl"
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('subscription.features.title')}
        </ThemedLanguageText>
      </ThemedView>

      <View style={styles.benefitsList}>
        {PRO_BENEFITS.map((benefitKey, index) => (
          <View key={index} style={styles.benefitItem}>
            <MaterialIcons 
              name="check-circle" 
              size={SIZES.icon.lg} 
              color={theme.button.primary.background}
              style={styles.checkIcon}
            />
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.benefitText}
            >
              {i18n.t(benefitKey)}
            </ThemedLanguageText>
          </View>
        ))}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitsList: {
    gap: SIZES.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
  },
  checkIcon: {
    marginRight: SIZES.spacing.md,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});

