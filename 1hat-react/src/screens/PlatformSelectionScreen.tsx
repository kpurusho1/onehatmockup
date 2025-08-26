import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';

interface PlatformSelectionScreenProps {
  onSelectMobile: () => void;
}

const PlatformSelectionScreen = ({ onSelectMobile }: PlatformSelectionScreenProps) => {
  // const navigation = useNavigation<any>();

  const handleMobileSelect = () => {
    // navigation.navigate('Login', { platform: 'mobile' });
    onSelectMobile && onSelectMobile();
  };

  // Desktop option removed as requested
  // const handleDesktopSelect = () => {
  //   navigation.navigate('Login', { platform: 'desktop' });
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to 1HAT</Text>
          <Text style={styles.subtitle}>Mobile Healthcare Platform</Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Mobile Interface Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={handleMobileSelect}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📱</Text>
            </View>
            <Text style={styles.cardTitle}>Mobile Interface</Text>
            <Text style={styles.cardDescription}>
              Optimized for smartphones and tablets. Perfect for on-the-go patient care.
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• Voice-powered health records</Text>
              <Text style={styles.feature}>• Quick patient management</Text>
              <Text style={styles.feature}>• Streamlined prescriptions</Text>
              <Text style={styles.feature}>• Touch-friendly interface</Text>
            </View>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Choose Mobile</Text>
            </View>
          </TouchableOpacity>

          {/* Desktop Interface Card - Removed as requested */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e293b',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  featureList: {
    marginBottom: 24,
  },
  feature: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#1c2f7f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlatformSelectionScreen;
