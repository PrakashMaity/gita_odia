import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Dimensions, View, Image, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { fetchPromotions, type Promotion } from '@/services/promotionService';
import { styles } from './PromotionalModal.styles';

interface PromotionalModalProps {
  visible: boolean;
  onClose: () => void;
}

const getItemIcon = (type: Promotion['type']) => {
  switch (type) {
    case 'promotion':
      return 'gift';
    case 'update':
      return 'notifications';
    default:
      return 'information-circle';
  }
};

const getItemColor = (type: Promotion['type'], theme: ReturnType<typeof useThemeColors>) => {
  switch (type) {
    case 'promotion':
      return theme.icon.secondary;
    case 'update':
      return theme.icon.primary;
    default:
      return theme.icon.primary;
  }
};

/**
 * Handle navigation based on navigation URL
 */
const handleNavigation = (navigationUrl?: string) => {
  if (!navigationUrl) return;
  
  try {
    // Remove leading slash if present
    const path = navigationUrl.startsWith('/') ? navigationUrl.slice(1) : navigationUrl;
    const normalizedPath = `/${path}`;

    // Handle different navigation patterns
    if (path.startsWith('chapter/')) {
      // Extract chapter number from path like "chapter/1" or "chapter/1?verse=5"
      router.push(normalizedPath as never);
    } else if (path.startsWith('translation/')) {
      router.push(normalizedPath as never);
    } else if (path.startsWith('(tabs)/')) {
      // Handle tab routes
      router.push(normalizedPath as never);
    } else {
      // Generic route
      router.push(normalizedPath as never);
    }
  } catch (error) {
    console.error('Error navigating:', error);
  }
};

export const PromotionalModal: React.FC<PromotionalModalProps> = ({ visible, onClose }) => {
  const theme = useThemeColors();
  const screenData = Dimensions.get('screen');
  const { width, height } = screenData;
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPromotions();
    }
  }, [visible]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const fetchedPromotions = await fetchPromotions();
      setPromotions(fetchedPromotions);
      
      // If no promotions found after loading, close the modal
      if (fetchedPromotions.length === 0) {
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error('[PromotionalModal] Error loading promotions:', error);
      setPromotions([]);
      // Close modal on error
      setTimeout(() => {
        onClose();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  const handleItemPress = (promotion: Promotion) => {
    if (promotion.navigationUrl) {
      handleNavigation(promotion.navigationUrl);
      onClose(); // Close modal after navigation
    }
  };

  const renderItem = (item: Promotion) => {
    const isPromotion = item.type === 'promotion';
    const iconName = getItemIcon(item.type);
    const iconColor = getItemColor(item.type, theme);
    const hasNavigation = !!item.navigationUrl;
    
    const ItemWrapper = hasNavigation ? TouchableOpacity : ThemedView;
    const wrapperProps = hasNavigation 
      ? { onPress: () => handleItemPress(item), activeOpacity: 0.7 }
      : {};
    
    return (
      <ItemWrapper
        key={item.id}
        {...wrapperProps}
      >
        <ThemedView
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
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.promotionImage}
              resizeMode="cover"
            />
          )}
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
                  size="large"
                  fontFamily="regional_secondary"
                  style={[styles.itemTitle, { fontWeight: 'bold' }]}
                >
                  {item.title}
                </ThemedLanguageText>
              </ThemedView>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
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
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.badgeText}
                  >
                    {isPromotion ? 'Promotion' : 'Update'}
                  </ThemedLanguageText>
                </ThemedView>
                {hasNavigation && (
                  <Ionicons
                    name="arrow-forward"
                    size={SIZES.icon.sm}
                    color={theme.icon.primary}
                    style={styles.navigationIcon}
                  />
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ItemWrapper>
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
                {loading ? (
                  <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.icon.primary} />
                    <ThemedLanguageText
                      variant="secondary"
                      size="medium"
                      fontFamily="regional_secondary"
                      style={styles.loadingText}
                    >
                      Loading promotions...
                    </ThemedLanguageText>
                  </ThemedView>
                ) : promotions.length === 0 ? (
                  <ThemedView style={styles.emptyContainer}>
                    <Ionicons
                      name="notifications-outline"
                      size={SIZES.icon.xl}
                      color={theme.icon.secondary}
                    />
                    <ThemedLanguageText
                      variant="secondary"
                      size="large"
                      fontFamily="regional_secondary"
                      style={styles.emptyText}
                    >
                      No promotions available
                    </ThemedLanguageText>
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.itemsList}>
                    {promotions.map(renderItem)}
                  </ThemedView>
                )}
              </ScrollView>
            </ThemedView>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

