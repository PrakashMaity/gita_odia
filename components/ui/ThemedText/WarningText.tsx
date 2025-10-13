import React from 'react';
import { ThemedText, ThemedTextProps } from './ThemedText';

export const WarningText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="warning" {...props} />
);
