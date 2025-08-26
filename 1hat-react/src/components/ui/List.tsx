import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle,
  TextStyle,
  FlatList,
  FlatListProps
} from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  onPress,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.listItem, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {leftComponent && (
        <View style={styles.leftComponent}>
          {leftComponent}
        </View>
      )}
      
      <View style={styles.itemContentContainer}>
        <Text 
          style={[styles.title, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
    </Container>
  );
};

interface ListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

function List<T>({
  data,
  renderItem,
  keyExtractor,
  style,
  contentContainerStyle,
  ...rest
}: ListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={keyExtractor || ((_, index) => index.toString())}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items to display</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={[styles.list, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  leftComponent: {
    marginRight: 16,
  },
  itemContentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  rightComponent: {
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default List;
