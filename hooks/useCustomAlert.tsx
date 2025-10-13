import { AlertButton, CustomAlert } from '@/components/ui/CustomAlert';
import React, { useCallback, useState } from 'react';

export interface UseCustomAlertReturn {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
  AlertComponent: React.ReactNode;
}

export interface AlertOptions {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
}

export const useCustomAlert = (): UseCustomAlertReturn => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({});

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertOptions(options);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  const AlertComponent = (
    <CustomAlert
      visible={alertVisible}
      title={alertOptions.title}
      message={alertOptions.message}
      buttons={alertOptions.buttons}
      onDismiss={hideAlert}
      type={alertOptions.type}
      showCloseButton={alertOptions.showCloseButton}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

// Convenience functions for common alert types
export const createSuccessAlert = (title: string, message: string, onOk?: () => void) => ({
  title,
  message,
  type: 'success' as const,
  buttons: [
    {
      text: 'ଠିକ୍ ଅଛି',
      onPress: onOk,
      style: 'default' as const,
    },
  ],
});

export const createErrorAlert = (title: string, message: string, onOk?: () => void) => ({
  title,
  message,
  type: 'error' as const,
  buttons: [
    {
      text: 'ଠିକ୍ ଅଛି',
      onPress: onOk,
      style: 'default' as const,
    },
  ],
});

export const createWarningAlert = (title: string, message: string, onOk?: () => void) => ({
  title,
  message,
  type: 'warning' as const,
  buttons: [
    {
      text: 'ଠିକ୍ ଅଛି',
      onPress: onOk,
      style: 'default' as const,
    },
  ],
});

export const createConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => ({
  title,
  message,
  type: 'warning' as const,
  buttons: [
    {
      text: 'ବାତିଲ',
      onPress: onCancel,
      style: 'cancel' as const,
    },
    {
      text: 'ନିଶ୍ଚିତ',
      onPress: onConfirm,
      style: 'destructive' as const,
    },
  ],
});

export const createInfoAlert = (title: string, message: string, onOk?: () => void) => ({
  title,
  message,
  type: 'info' as const,
  buttons: [
    {
      text: 'ଠିକ୍ ଅଛି',
      onPress: onOk,
      style: 'default' as const,
    },
  ],
});
