import { PageHeader } from '@/components/shared/PageHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import { LayoutImages } from '@/lib/utils/assets';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImageBackground, ScrollView, View } from 'react-native';
import { styles } from './SubscriptionScreen.styles';

export const SubscriptionScreen: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title="Subscription"
          subtitle="Upgrade to Pro and unlock all premium features"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Coming Soon Badge */}
          <View style={styles.comingSoonContainer}>
            <View style={[styles.comingSoonBadge, { backgroundColor: theme.background.quaternary }]}>
              <MaterialIcons
                name="schedule"
                size={20}
                color={theme.icon.primary}
                style={styles.comingSoonIcon}
              />
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.comingSoonText}
              >
                Coming Soon
              </ThemedLanguageText>
            </View>
          </View>

          {/* Premium Features Preview */}
          <ThemedView variant="card" style={styles.featuresCard}>
            <View style={styles.premiumIconContainer}>
              <MaterialIcons
                name="workspace-premium"
                size={48}
                color="#FFD700"
              />
            </View>

            <ThemedLanguageText
              variant="primary"
              size="xl"
              fontFamily="regional_secondary"
              style={styles.premiumTitle}
            >
              Unlock Premium Features
            </ThemedLanguageText>

            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.premiumDescription}
            >
              Get access to exclusive content and enhanced features
            </ThemedLanguageText>

            {/* Feature List */}
            <View style={styles.featuresList}>
              {[
                'Ad-free experience',
                'Unlimited access to all content',
                'Premium translations',
                'Offline reading mode',
                'Advanced search features',
                'Priority support'
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={theme.icon.success || '#4CAF50'}
                  />
                  <ThemedLanguageText
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.featureText}
                  >
                    {feature}
                  </ThemedLanguageText>
                </View>
              ))}
            </View>
          </ThemedView>

          {/* Subscription Plans Preview (Design Only) */}
          <View style={styles.plansContainer}>
            <ThemedView variant="card" style={styles.planCard}>
              <View style={styles.planHeader}>
                <ThemedLanguageText
                  variant="primary"
                  size="large"
                  fontFamily="regional_secondary"
                  style={styles.planTitle}
                >
                  Monthly Plan
                </ThemedLanguageText>
                <View style={[styles.planBadge, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.planBadgeText}
                  >
                    Coming Soon
                  </ThemedLanguageText>
                </View>
              </View>
              <ThemedLanguageText
                variant="primary"
                size="xl"
                fontFamily="regional_secondary"
                style={styles.planPrice}
              >
                ₹99/month
              </ThemedLanguageText>
            </ThemedView>

            <ThemedView variant="card" style={[styles.planCard, styles.planCardFeatured]}>
              <View style={styles.planHeader}>
                <ThemedLanguageText
                  variant="primary"
                  size="large"
                  fontFamily="regional_secondary"
                  style={styles.planTitle}
                >
                  Yearly Plan
                </ThemedLanguageText>
                <View style={[styles.planBadge, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.planBadgeText}
                  >
                    Coming Soon
                  </ThemedLanguageText>
                </View>
              </View>
              <ThemedLanguageText
                variant="primary"
                size="xl"
                fontFamily="regional_secondary"
                style={styles.planPrice}
              >
                ₹999/year
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="regional_secondary"
                style={styles.planSavings}
              >
                Save 16% compared to monthly
              </ThemedLanguageText>
            </ThemedView>
          </View>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
