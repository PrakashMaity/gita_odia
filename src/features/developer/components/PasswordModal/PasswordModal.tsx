import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, TextInput, View } from 'react-native';

const DEVELOPER_PASSWORD = '9434341997';

interface PasswordModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === DEVELOPER_PASSWORD) {
      setPassword('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError(false);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        <Box className="w-full max-w-[400px] p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <View className="items-center mb-6">
            <MaterialIcons
              name="lock"
              size={32}
              color="white"
            />
            <Text className="text-xl font-bold mt-4 mb-2 text-center text-white font-regional_secondary">
              Developer Access
            </Text>
            <Text className="text-sm text-center text-neutral-400">
              Enter password to access developer panel
            </Text>
          </View>

          <View className="mb-6">
            <TextInput
              className={`h-[50px] rounded-xl px-4 border text-base text-white ${error ? 'border-red-500 bg-red-500/10' : 'border-neutral-700 bg-black'
                }`}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(false);
              }}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af" // neutral-400
              secureTextEntry
              autoFocus
              onSubmitEditing={handleSubmit}
            />
            {error && (
              <Text className="text-sm mt-2 text-center text-red-500">
                Incorrect password
              </Text>
            )}
          </View>

          <View className="flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-neutral-700"
              onPress={handleCancel}
            >
              <ButtonText className="text-white font-medium">Cancel</ButtonText>
            </Button>
            <Button
              className="flex-1 rounded-xl bg-white"
              onPress={handleSubmit}
            >
              <ButtonText className="text-black font-medium">Submit</ButtonText>
            </Button>
          </View>
        </Box>
      </View>
    </Modal>
  );
};
