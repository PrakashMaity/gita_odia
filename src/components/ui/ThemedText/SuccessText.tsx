import React from 'react';
import { ThemedText, ThemedTextProps } from './ThemedText';

export const SuccessText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="success" {...props} />
);
