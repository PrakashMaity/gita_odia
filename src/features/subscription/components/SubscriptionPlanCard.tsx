import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { styles } from './SubscriptionPlanCard.styles';

interface SubscriptionPlanCardProps {
  title: string;
  price: string;
  period: string;
  onPurchase: () => Promise<void>;
  isPurchasing: boolean;
  showBestValue?: boolean;
  features?: string[];
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  price,
  period,
  onPurchase,
  isPurchasing,
  showBestValue = false,
  features = [],
}) => {
  const theme = useThemeColors();

  const handlePress = async () => {
    await onPurchase();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isPurchasing}
      activeOpacity={0.9}
    >
      <ThemedCard
        variant={showBestValue ? 'primary' : 'card'}
        style={[
          styles.card,
          ...(showBestValue ? [styles.featuredCard] : []),
        ]}
        pattern={showBestValue ? 'sacredGeometry' : 'mandala'}
        patternOpacity={showBestValue ? 0.15 : 0.08}
      >
        {showBestValue && (
          <View style={[styles.bestValueBadge, { backgroundColor: theme.button.primary.background }]}>
            <MaterialIcons name="star" size={SIZES.icon.sm} color={theme.button.primary.text} />
            <ThemedLanguageText
              variant="primary"
              size="small"
              fontFamily="regional_secondary"
              style={[styles.bestValueText, { color: theme.button.primary.text }]}
            >
              {i18n.t('subscription.bestValue')}
            </ThemedLanguageText>
          </View>
        )}

        <View style={styles.cardContent}>
          {/* Plan Title */}
          <ThemedLanguageText
            variant="primary"
            size="xl"
            fontFamily="regional_secondary"
            style={styles.title}
          >
            {title}
          </ThemedLanguageText>

          {/* Price Display */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <ThemedLanguageText
                variant="primary"
                size="xxl"
                fontFamily="regional_secondary"
                style={[styles.price, showBestValue && styles.featuredPrice]}
              >
                {price}
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.period}
              >
                {period}
              </ThemedLanguageText>
            </View>
          </View>

          {/* Features List */}
          {features.length > 0 && (
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialIcons 
                    name="check-circle" 
                    size={SIZES.icon.md} 
                    color={showBestValue ? theme.button.primary.background : theme.icon.primary}
                    style={styles.checkIcon}
                  />
                  <ThemedLanguageText
                    variant="secondary"
                    size="medium"
                    fontFamily="regional_secondary"
                    style={styles.featureText}
                  >
                    {feature}
                  </ThemedLanguageText>
                </View>
              ))}
            </View>
          )}

          {/* Subscribe Button */}
          <ThemedButton
            title={
              isPurchasing
                ? i18n.t('subscription.subscribing')
                : i18n.t('subscription.subscribe')
            }
            onPress={handlePress}
            variant={showBestValue ? 'primary' : 'secondary'}
            disabled={isPurchasing}
            icon={isPurchasing ? <ActivityIndicator size="small" color="#fff" /> : undefined}
            style={styles.subscribeButton}
            fullWidth
          />
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};
