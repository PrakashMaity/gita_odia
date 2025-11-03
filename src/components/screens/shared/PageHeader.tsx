import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { PageHeaderProps } from '@/interface/screen.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './PageHeader.styles';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  onBack,
}) => {
  const { theme } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.lg} color={theme.icon.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <ThemedView style={styles.headerContent}>
        <ThemedLanguageText 
          variant="primary" 
          size="title" 
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {title}
        </ThemedLanguageText>
        {subtitle && (
          <ThemedLanguageText 
            variant="secondary" 
            size="large" 
            fontFamily="regional_secondary"
            style={styles.subtitle}
          >
            {subtitle}
          </ThemedLanguageText>
        )}
      </ThemedView>

      {rightAction ? rightAction : <View style={styles.placeholder} />}
    </ThemedView>
  );
};
