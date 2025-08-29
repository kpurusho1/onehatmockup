import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Header,
  Input,
  List,
  ListItem,
  Modal,
  TabView,
  Toast
} from '../components/ui';

interface ComponentDemoScreenProps {
  navigation?: NavigationProp<ParamListBase>;
}

const ComponentDemoScreen: React.FC<ComponentDemoScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('This is a success toast message');
  
  const demoListData = [
    { id: '1', title: 'First Item', subtitle: 'This is the first item description' },
    { id: '2', title: 'Second Item', subtitle: 'This is the second item description' },
    { id: '3', title: 'Third Item', subtitle: 'This is the third item description' },
  ];

  const demoTabs = [
    {
      key: 'buttons',
      title: 'Buttons',
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Button Variants</Text>
          <Button title="Primary Button" variant="primary" onPress={() => Alert.alert('Primary Button Pressed')} />
          <View style={styles.spacer} />
          <Button title="Secondary Button" variant="secondary" onPress={() => Alert.alert('Secondary Button Pressed')} />
          <View style={styles.spacer} />
          <Button title="Outline Button" variant="outline" onPress={() => Alert.alert('Outline Button Pressed')} />
          <View style={styles.spacer} />
          <Button title="Danger Button" variant="danger" onPress={() => Alert.alert('Danger Button Pressed')} />
          <View style={styles.spacer} />
          <Button title="Success Button" variant="success" onPress={() => Alert.alert('Success Button Pressed')} />
          <View style={styles.spacer} />
          <Button title="Link Button" variant="link" onPress={() => Alert.alert('Link Button Pressed')} />
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Button Sizes</Text>
          <Button title="Small Button" size="small" onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title="Medium Button" size="medium" onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title="Large Button" size="large" onPress={() => {}} />
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Button States</Text>
          <Button title="Loading Button" loading onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title="Disabled Button" disabled onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title="Full Width Button" fullWidth onPress={() => {}} />
        </View>
      ),
    },
    {
      key: 'inputs',
      title: 'Inputs',
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Input Fields</Text>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
          />
          <Input
            label="With Error"
            placeholder="This input has an error"
            error="This field is required"
          />
          <Input
            label="With Helper"
            placeholder="This input has helper text"
            helper="This is some helper text"
          />
        </View>
      ),
    },
    {
      key: 'cards',
      title: 'Cards',
      badge: 3,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Cards</Text>
          
          <Card title="Simple Card">
            <Text>This is a simple card with just content.</Text>
          </Card>
          
          <Card 
            title="Card with Footer"
            footer={
              <View style={{ flexDirection: 'row' }}>
                <Button 
                  title="Cancel" 
                  variant="secondary" 
                  size="small" 
                  style={{ marginRight: 8 }} 
                  onPress={() => {}}
                />
                <Button 
                  title="Save" 
                  size="small" 
                  onPress={() => {}}
                />
              </View>
            }
          >
            <Text>This card has a footer with action buttons.</Text>
          </Card>
          
          <Card
            title="Clickable Card"
            onPress={() => Alert.alert('Card Pressed', 'You clicked on the card!')}
          >
            <Text>This entire card is clickable. Try it!</Text>
          </Card>
        </View>
      ),
    },
    {
      key: 'other',
      title: 'Other',
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Avatars</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}>
            <Avatar name="John Doe" size="sm" />
            <Avatar name="Jane Smith" size="md" backgroundColor="#10b981" />
            <Avatar name="Robert Brown" size="lg" backgroundColor="#3b82f6" />
          </View>
          
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}>
            <Badge label="Primary" variant="primary" />
            <Badge label="Success" variant="success" />
            <Badge label="Danger" variant="danger" />
            <Badge label="Warning" variant="warning" />
          </View>
          
          <Text style={styles.sectionTitle}>List</Text>
          <View style={{ height: 200, backgroundColor: 'white', borderRadius: 8 }}>
            <List
              data={demoListData}
              renderItem={(item) => (
                <ListItem
                  title={item.title}
                  subtitle={item.subtitle}
                  leftComponent={<Avatar name={item.title} size="sm" />}
                  rightComponent={<Badge label="New" variant="primary" size="small" />}
                  onPress={() => Alert.alert(item.title, item.subtitle)}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Modal</Text>
          <Button 
            title="Open Modal" 
            onPress={() => setIsModalVisible(true)} 
          />
          
          <Modal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title="Example Modal"
            footer={
              <Button 
                title="Close" 
                variant="secondary" 
                onPress={() => setIsModalVisible(false)} 
              />
            }
          >
            <Text style={{ marginBottom: 16 }}>
              This is an example modal dialog. You can put any content here.
            </Text>
            <Input
              label="Sample Input"
              placeholder="Try typing something"
            />
          </Modal>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Toast Notifications</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Button 
              title="Success Toast" 
              variant="success"
              size="small"
              style={{ marginBottom: 8, width: '48%' }}
              onPress={() => {
                setToastType('success');
                setToastMessage('Operation completed successfully!');
                setToastVisible(true);
              }} 
            />
            <Button 
              title="Error Toast" 
              variant="danger"
              size="small"
              style={{ marginBottom: 8, width: '48%' }}
              onPress={() => {
                setToastType('error');
                setToastMessage('An error occurred. Please try again.');
                setToastVisible(true);
              }} 
            />
            <Button 
              title="Info Toast" 
              variant="primary"
              size="small"
              style={{ marginBottom: 8, width: '48%' }}
              onPress={() => {
                setToastType('info');
                setToastMessage('Here is some useful information for you.');
                setToastVisible(true);
              }} 
            />
            <Button 
              title="Warning Toast" 
              variant="secondary"
              size="small"
              style={{ marginBottom: 8, width: '48%' }}
              onPress={() => {
                setToastType('warning');
                setToastMessage('Please be careful with this action.');
                setToastVisible(true);
              }} 
            />
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="UI Components"
        leftIcon="←"
        onLeftPress={() => navigation?.goBack()}
      />
      
      <TabView tabs={demoTabs} />
      
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
        position="bottom"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  spacer: {
    height: 12,
  },
});

export default ComponentDemoScreen;
