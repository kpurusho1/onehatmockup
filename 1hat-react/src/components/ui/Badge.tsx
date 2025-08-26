import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label?: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  dot = false,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    return {
      ...styles.badge,
      ...styles[`${variant}Badge`],
      ...styles[`${size}Badge`],
      ...(dot && styles.dotBadge),
    };
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.badgeText,
      ...styles[`${size}Text`],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {!dot && label !== undefined && (
        <Text style={[getTextStyle(), textStyle]}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
  },
  dotBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    padding: 0,
  },
  // Variants
  primaryBadge: {
    backgroundColor: '#1c2f7f',
  },
  secondaryBadge: {
    backgroundColor: '#64748b',
  },
  successBadge: {
    backgroundColor: '#10b981',
  },
  dangerBadge: {
    backgroundColor: '#ef4444',
  },
  warningBadge: {
    backgroundColor: '#f59e0b',
  },
  infoBadge: {
    backgroundColor: '#3b82f6',
  },
  // Sizes
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  smallText: {
    fontSize: 10,
  },
  mediumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  mediumText: {
    fontSize: 12,
  },
  largeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  largeText: {
    fontSize: 14,
  },
});

export default Badge;
