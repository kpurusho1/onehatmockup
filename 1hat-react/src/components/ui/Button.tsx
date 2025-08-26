import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`${variant}Button`],
      ...styles[`${size}Button`],
      ...(fullWidth && styles.fullWidth),
      ...(disabled && styles.disabledButton),
    };
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.buttonText,
      ...styles[`${variant}Text`],
      ...styles[`${size}Text`],
      ...(disabled && styles.disabledText),
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'link' ? '#1c2f7f' : 'white'} 
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primaryButton: {
    backgroundColor: '#1c2f7f',
  },
  primaryText: {
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
  },
  secondaryText: {
    color: '#1e293b',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1c2f7f',
  },
  outlineText: {
    color: '#1c2f7f',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  dangerText: {
    color: 'white',
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  successText: {
    color: 'white',
  },
  linkButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  linkText: {
    color: '#1c2f7f',
    textDecorationLine: 'underline',
  },
  // Sizes
  smallButton: {
    paddingVertical: 6,
  },
  smallText: {
    fontSize: 14,
  },
  mediumButton: {
    paddingVertical: 10,
  },
  mediumText: {
    fontSize: 16,
  },
  largeButton: {
    paddingVertical: 14,
  },
  largeText: {
    fontSize: 18,
  },
  // States
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;
