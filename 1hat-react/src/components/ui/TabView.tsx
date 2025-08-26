import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
  Animated,
  useWindowDimensions,
} from 'react-native';

interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
  badge?: number | string;
}

interface TabViewProps {
  tabs: TabItem[];
  initialTabIndex?: number;
  onTabChange?: (index: number) => void;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  activeTabTextStyle?: TextStyle;
  contentContainerStyle?: ViewStyle;
  scrollable?: boolean;
  tabBarPosition?: 'top' | 'bottom';
}

const TabView: React.FC<TabViewProps> = ({
  tabs,
  initialTabIndex = 0,
  onTabChange,
  tabBarStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  contentContainerStyle,
  scrollable = true,
  tabBarPosition = 'top',
}) => {
  const [activeIndex, setActiveIndex] = useState(initialTabIndex);
  const { width } = useWindowDimensions();
  const [translateX] = useState(new Animated.Value(0));

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    
    if (onTabChange) {
      onTabChange(index);
    }
    
    // Animate the indicator
    Animated.spring(translateX, {
      toValue: index * (width / tabs.length),
      useNativeDriver: true,
    }).start();
  };

  const renderTabBar = () => {
    const TabBarContainer = scrollable ? ScrollView : View;
    
    return (
      <View style={[styles.tabBarContainer, tabBarStyle]}>
        <TabBarContainer 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={scrollable ? { flexGrow: 1 } : undefined}
        >
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  { width: scrollable ? undefined : width / tabs.length },
                  tabStyle,
                  activeIndex === index && styles.activeTab,
                  activeIndex === index && activeTabStyle,
                ]}
                onPress={() => handleTabPress(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    tabTextStyle,
                    activeIndex === index && styles.activeTabText,
                    activeIndex === index && activeTabTextStyle,
                  ]}
                  numberOfLines={1}
                >
                  {tab.title}
                </Text>
                {tab.badge !== undefined && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {!scrollable && (
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: width / tabs.length,
                  transform: [{ translateX }],
                },
              ]}
            />
          )}
        </TabBarContainer>
      </View>
    );
  };

  const content = tabs[activeIndex]?.content;

  return (
    <View style={styles.container}>
      {tabBarPosition === 'top' && renderTabBar()}
      
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {content}
      </View>
      
      {tabBarPosition === 'bottom' && renderTabBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1c2f7f',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#1c2f7f',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#1c2f7f',
  },
  contentContainer: {
    flex: 1,
  },
});

export default TabView;
