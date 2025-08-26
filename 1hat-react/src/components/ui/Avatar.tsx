import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'square';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  variant = 'circle',
  backgroundColor = '#1c2f7f',
  textColor = 'white',
  style,
  textStyle,
}) => {
  const getInitials = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      ...styles.container,
      ...styles[`${size}Container`],
      ...(variant === 'square' ? styles.squareContainer : {}),
      backgroundColor,
    };
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...styles[`${size}Text`],
      color: textColor,
    };
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {source ? (
        <Image 
          source={source} 
          style={[
            styles.image, 
            variant === 'square' ? styles.squareImage : styles.circleImage
          ]} 
        />
      ) : name ? (
        <Text style={[getTextStyle(), textStyle]}>
          {getInitials(name)}
        </Text>
      ) : (
        <Text style={[getTextStyle(), textStyle]}>?</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  squareContainer: {
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  circleImage: {
    borderRadius: 999,
  },
  squareImage: {
    borderRadius: 8,
  },
  text: {
    fontWeight: 'bold',
  },
  // Size variants
  xsContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  xsText: {
    fontSize: 10,
  },
  smContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  smText: {
    fontSize: 12,
  },
  mdContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  mdText: {
    fontSize: 16,
  },
  lgContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  lgText: {
    fontSize: 24,
  },
  xlContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  xlText: {
    fontSize: 32,
  },
});

export default Avatar;
