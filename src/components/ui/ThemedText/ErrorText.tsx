import React from 'react';
import { ThemedText, ThemedTextProps } from './ThemedText';

export const ErrorText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="error" {...props} />
);
