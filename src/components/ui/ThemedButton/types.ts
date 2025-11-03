import { TextStyle, ViewStyle } from 'react-native';

export interface ThemedButtonVariant {
  primary: 'primary';
  secondary: 'secondary';
  outline: 'outline';
}

export interface ThemedButtonSize {
  sm: 'sm';
  md: 'md';
  lg: 'lg';
}

export interface ThemedButtonStyle {
  button: ViewStyle;
  text: TextStyle;
}
