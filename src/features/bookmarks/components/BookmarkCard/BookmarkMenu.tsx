import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { styles } from './BookmarkMenu.styles';

interface BookmarkMenuProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  isHeaderMenu?: boolean;
}

export const BookmarkMenu: React.FC<BookmarkMenuProps> = ({
  visible,
  onClose,
  onDelete,
  isHeaderMenu = false,
}) => {
  const theme = useThemeColors();

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <ThemedView style={styles.overlay}>
          <TouchableWithoutFeedback>
            <ThemedView 
              style={[styles.menuContainer, { backgroundColor: theme.background.card }]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={SIZES.icon.md} 
                  color={theme.icon.error} 
                  style={styles.menuIcon}
                />
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.menuText}
                >
                  {isHeaderMenu ? i18n.t('bookmark.clearAll') : i18n.t('bookmark.remove')}
                </ThemedLanguageText>
              </TouchableOpacity>
            </ThemedView>
          </TouchableWithoutFeedback>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
