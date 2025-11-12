import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Dimensions, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PromotionalModal.styles';

interface PromotionalModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PromotionalItem {
  id: string;
  title: string;
  description: string;
  type: 'promotion' | 'update';
}

// Static promotional content
const promotionalItems: PromotionalItem[] = [
  {
    id: '1',
    title: 'New Feature: Daily Reading',
    description: 'Start your day with a verse from the Bhagavad Gita. Set daily reading reminders and track your progress.',
    type: 'update',
  },
  {
    id: '2',
    title: 'Special Offer: Premium Access',
    description: 'Unlock all translations, audio features, and exclusive content. Limited time offer - 50% off!',
    type: 'promotion',
  },
  {
    id: '3',
    title: 'New Translation Added',
    description: 'We have added a new translation in your preferred language. Check it out in the Translations section.',
    type: 'update',
  },
];

const getItemIcon = (type: PromotionalItem['type']) => {
  switch (type) {
    case 'promotion':
      return 'gift';
    case 'update':
      return 'notifications';
    default:
      return 'information-circle';
  }
};

const getItemColor = (type: PromotionalItem['type'], theme: ReturnType<typeof useThemeColors>) => {
  switch (type) {
    case 'promotion':
      return theme.icon.secondary;
    case 'update':
      return theme.icon.primary;
    default:
      return theme.icon.primary;
  }
};

export const PromotionalModal: React.FC<PromotionalModalProps> = ({ visible, onClose }) => {
  const theme = useThemeColors();
  const screenData = Dimensions.get('screen');
  const { width, height } = screenData;

  const handleBackdropPress = () => {
    onClose();
  };

  const renderItem = (item: PromotionalItem) => {
    const isPromotion = item.type === 'promotion';
    const iconName = getItemIcon(item.type);
    const iconColor = getItemColor(item.type, theme);
    
    return (
      <ThemedView
        key={item.id}
        variant="card"
        style={[
          styles.itemContainer,
          {
            backgroundColor: isPromotion 
              ? theme.background.quaternary 
              : theme.background.card,
            borderColor: isPromotion 
              ? theme.border.primary 
              : theme.border.secondary,
            borderLeftWidth: isPromotion ? 4 : 1,
          },
        ]}
      >
        <ThemedView style={styles.itemHeader}>
          <ThemedView
            style={[
              styles.iconContainer,
              {
                backgroundColor: isPromotion 
                  ? theme.background.tertiary 
                  : theme.background.secondary,
              },
            ]}
          >
            <Ionicons
              name={iconName}
              size={SIZES.icon.lg}
              color={iconColor}
            />
          </ThemedView>
          <ThemedView style={styles.contentContainer}>
            <ThemedView style={styles.titleRow}>
              <ThemedLanguageText
                variant="primary"
                size="lg"
                fontFamily="regional_secondary"
                style={[styles.itemTitle, { fontWeight: 'bold' }]}
              >
                {item.title}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText
              variant="secondary"
              size="md"
              fontFamily="regional_secondary"
              style={styles.itemDescription}
            >
              {item.description}
            </ThemedLanguageText>
            <ThemedView style={styles.badgeContainer}>
              <ThemedView
                style={[
                  styles.badge,
                  {
                    backgroundColor: isPromotion 
                      ? theme.background.tertiary 
                      : theme.background.secondary,
                  },
                ]}
              >
                <ThemedLanguageText
                  variant={isPromotion ? 'primary' : 'secondary'}
                  size="sm"
                  fontFamily="regional_secondary"
                  style={styles.badgeText}
                >
                  {isPromotion ? 'Promotion' : 'Update'}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { width, height }]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <BlurView
            intensity={80}
            tint="dark"
            style={[styles.backdropTouchable, { width, height }]}
          >
            <View style={[styles.blurOverlay, { width, height, backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} />
          </BlurView>
        </TouchableWithoutFeedback>
        
        <TouchableWithoutFeedback>
          <ThemedView
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.background.secondary,
                maxWidth: width * 0.92,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: SIZES.shadow.xl,
                },
                shadowOpacity: 0.3,
                shadowRadius: SIZES.shadow.lg,
                elevation: 15,
                zIndex: 1000,
                position: 'relative',
              },
            ]}
          >
              <ThemedView 
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.border.secondary },
                ]}
              >
                <ThemedView style={styles.headerTitleContainer}>
                  <ThemedView
                    style={[
                      styles.headerIconContainer,
                      { backgroundColor: theme.background.tertiary },
                    ]}
                  >
                    <Ionicons
                      name="notifications"
                      size={SIZES.icon.lg}
                      color={theme.icon.primary}
                    />
                  </ThemedView>
                  <ThemedLanguageText
                    variant="primary"
                    size="title"
                    fontFamily="regional_secondary"
                    style={styles.modalTitle}
                  >
                    Updates & Promotions
                  </ThemedLanguageText>
                </ThemedView>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.background.tertiary },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={SIZES.icon.md}
                    color={theme.icon.primary}
                  />
                </TouchableOpacity>
              </ThemedView>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <ThemedView style={styles.itemsList}>
                  {promotionalItems.map(renderItem)}
                </ThemedView>
              </ScrollView>
            </ThemedView>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

