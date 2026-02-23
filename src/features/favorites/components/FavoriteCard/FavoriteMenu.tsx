import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

interface FavoriteMenuProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  isHeaderMenu?: boolean;
}

export const FavoriteMenu: React.FC<FavoriteMenuProps> = ({
  visible,
  onClose,
  onDelete,
  isHeaderMenu = false,
}) => {
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
        <Box className="flex-1 justify-center items-center bg-black/60">
          <TouchableWithoutFeedback>
            <Box className="rounded-2xl p-2 min-w-[180px] bg-neutral-900 border border-neutral-800">
              <TouchableOpacity
                className="flex-row items-center p-4 rounded-xl"
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#ef4444"
                  className="mr-4"
                />
                <Text
                  className="flex-1 text-white text-base font-regional_secondary ml-4"
                >
                  {isHeaderMenu ? i18n.t('favorite.clearAll') : i18n.t('favorite.remove')}
                </Text>
              </TouchableOpacity>
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
