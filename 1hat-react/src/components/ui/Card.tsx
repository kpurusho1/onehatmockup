import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacity
} from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  footerStyle?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  style,
  titleStyle,
  contentStyle,
  footerStyle,
  onPress,
  disabled = false,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      style={[styles.card, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {title && (
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>
        </View>
      )}
      <View style={[styles.cardContent, contentStyle]}>
        {children}
      </View>
      {footer && (
        <View style={[styles.cardFooter, footerStyle]}>
          {footer}
        </View>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Card;
