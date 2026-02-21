import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';

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
  const theme = useThemeColors();
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
      <ThemedView style={styles.overlay}>
        <ThemedCard variant="card" style={styles.modalContainer} borderVariant="primary">
          <View style={styles.header}>
            <MaterialIcons 
              name="lock" 
              size={SIZES.icon.lg} 
              color={theme.icon.primary} 
            />
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              Developer Access
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="none"
              style={styles.subtitle}
            >
              Enter password to access developer panel
            </ThemedLanguageText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background.tertiary,
                  color: theme.text.primary,
                  borderColor: error ? theme.status.error : theme.border.primary,
                },
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(false);
              }}
              placeholder="Enter password"
              placeholderTextColor={theme.text.secondary}
              secureTextEntry
              autoFocus
              onSubmitEditing={handleSubmit}
            />
            {error && (
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="none"
                style={[styles.errorText, { color: theme.status.error }]}
              >
                Incorrect password
              </ThemedLanguageText>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <ThemedButton
              title="Submit"
              onPress={handleSubmit}
              variant="primary"
              style={styles.submitButton}
            />
          </View>
        </ThemedCard>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    padding: SIZES.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  title: {
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SIZES.spacing.lg,
  },
  input: {
    height: 50,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.spacing.md,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    marginTop: SIZES.spacing.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});
