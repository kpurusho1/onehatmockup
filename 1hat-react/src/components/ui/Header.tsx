import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';

interface HeaderProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  onLeftPress,
  onRightPress,
  leftIcon = '←',
  rightIcon,
  backgroundColor = '#1c2f7f',
  textColor = 'white',
  style,
  titleStyle,
}) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      <View style={[
        styles.header, 
        { backgroundColor },
        Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight },
        style
      ]}>
        <View style={styles.leftContainer}>
          {leftComponent || (onLeftPress && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onLeftPress}
            >
              <Text style={[styles.iconText, { color: textColor }]}>{leftIcon}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.titleContainer}>
          <Text 
            style={[styles.title, { color: textColor }, titleStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent || (rightIcon && onRightPress && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onRightPress}
            >
              <Text style={[styles.iconText, { color: textColor }]}>{rightIcon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    fontSize: 20,
  },
});

export default Header;
