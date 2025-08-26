import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import vhrApi from '../services/vhrApi';
import { Patient as ApiPatient } from '../types/api';

// Extended patient interface with UI-specific fields
interface UIPatient extends ApiPatient {
  status: 'active' | 'scheduled' | 'discharged' | 'pending';
  condition?: string;
  lastVisit?: string;
  profileImage?: string;
  gender?: string;
}

const mockPatients: UIPatient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 42,
    gender: 'Female',
    condition: 'Hypertension',
    lastVisit: '2 days ago',
    status: 'active',
    phone: '555-123-4567',
  },
  {
    id: '2',
    name: 'Michael Lee',
    age: 35,
    gender: 'Male',
    condition: 'Diabetes Type 2',
    lastVisit: '1 week ago',
    status: 'scheduled',
    phone: '555-234-5678',
  },
  {
    id: '3',
    name: 'Emma Davis',
    age: 28,
    gender: 'Female',
    condition: 'Pregnancy',
    lastVisit: '3 days ago',
    status: 'active',
    phone: '555-345-6789',
  },
  {
    id: '4',
    name: 'Robert Brown',
    age: 65,
    gender: 'Male',
    condition: 'Arthritis',
    lastVisit: '2 weeks ago',
    status: 'discharged',
    phone: '555-456-7890',
  },
  {
    id: '5',
    name: 'Jennifer Clark',
    age: 52,
    gender: 'Female',
    condition: 'Migraine',
    lastVisit: '4 days ago',
    status: 'active',
    phone: '555-567-8901',
  },
  {
    id: '6',
    name: 'Thomas Wilson',
    age: 48,
    gender: 'Male',
    condition: 'High Cholesterol',
    lastVisit: '1 month ago',
    status: 'scheduled',
    phone: '555-678-9012',
  },
  {
    id: '7',
    name: 'Lisa Martinez',
    age: 33,
    gender: 'Female',
    condition: 'Asthma',
    lastVisit: '5 days ago',
    status: 'active',
    phone: '555-789-0123',
  },
  {
    id: '8',
    name: 'James Miller',
    age: 57,
    gender: 'Male',
    condition: 'Post-Surgery Recovery',
    lastVisit: '1 day ago',
    status: 'active',
    phone: '555-890-1234',
  },
  {
    id: '9',
    name: 'Patricia Taylor',
    age: 71,
    gender: 'Female',
    condition: 'Osteoporosis',
    lastVisit: '3 weeks ago',
    status: 'discharged',
    phone: '555-901-2345',
  },
  {
    id: '10',
    name: 'David Anderson',
    age: 39,
    gender: 'Male',
    condition: 'Anxiety',
    lastVisit: '6 days ago',
    status: 'pending',
    phone: '555-012-3456',
  },
];

interface PatientListScreenProps {
  navigation?: any;
}

const PatientListScreen: React.FC<PatientListScreenProps> = ({ navigation }) => {
  const [patients, setPatients] = useState<UIPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients from API
  const fetchPatients = useCallback(async (pageNum = 1, search = '', refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (!refresh && pageNum === 1) {
        setIsLoading(true);
      }
      
      setError(null);
      const response = await vhrApi.getPatients(pageNum, 10, search);
      
      if (response.success) {
        // Map API patients to our UI model
        const mappedPatients = response.patients.map(patient => ({
          ...patient,
          // Add UI-specific fields with default values
          status: patient.recent_visits && patient.recent_visits.length > 0 ? 'active' as const : 'pending' as const,
          condition: patient.medical_history ? patient.medical_history[0] : 'General checkup',
          lastVisit: patient.recent_visits && patient.recent_visits.length > 0 ? 
            patient.recent_visits[0].date : 'No recent visits',
          gender: 'Not specified' // Add default gender since it's used in the UI
        }));
        
        if (pageNum === 1 || refresh) {
          setPatients(mappedPatients);
        } else {
          setPatients(prev => [...prev, ...mappedPatients]);
        }
        
        setHasMoreData(mappedPatients.length > 0 && response.total > (pageNum * 10));
        setPage(pageNum);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error loading patients. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  // Initial data load
  useEffect(() => {
    fetchPatients(1, searchQuery);
  }, [fetchPatients]);
  
  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(1, searchQuery, true);
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPatients]);
  
  // Handle refresh
  const handleRefresh = () => {
    fetchPatients(1, searchQuery, true);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (!isLoading && hasMoreData) {
      fetchPatients(page + 1, searchQuery);
    }
  };
  
  const handlePatientPress = (patient: UIPatient) => {
    // Navigate to patient details screen
    if (navigation) {
      navigation.navigate('PatientDetails', { patientId: patient.id, patient });
    }
  };

  const handleRecordPress = (patient: UIPatient) => {
    // Navigate to HomeScreen with selected patient
    if (navigation) {
      navigation.navigate('See Patient', { selectedPatient: patient });
    }
  };

  const handleAddPatient = () => {
    Alert.alert(
      'Add New Patient',
      'This feature would open a form to add a new patient.',
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'scheduled':
        return '#3b82f6'; // blue
      case 'discharged':
        return '#6b7280'; // gray
      case 'pending':
        return '#f59e0b'; // amber
      default:
        return '#6b7280';
    }
  };

  // Apply only status filter locally (search is handled by API)
  const filteredPatients: UIPatient[] = patients.filter(patient => {
    // Apply status filter
    if (statusFilter) {
      return patient.status === statusFilter;
    }
    return true;
  });

  const renderPatientItem = ({ item }: { item: UIPatient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => handlePatientPress(item)}
    >
      <View style={styles.patientHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetails}>
            {item.age} years • {item.gender}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.patientBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Condition:</Text>
          <Text style={styles.infoValue}>{item.condition}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Visit:</Text>
          <Text style={styles.infoValue}>{item.lastVisit}</Text>
        </View>
      </View>
      
      <View style={styles.patientActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handlePatientPress(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.recordButton]}
          onPress={() => handleRecordPress(item)}
        >
          <Text style={styles.recordButtonText}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.scheduleButton]}
          onPress={() => Alert.alert('Schedule', `Schedule appointment for ${item.name}`)}
        >
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patients</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPatient}
        >
          <Text style={styles.addButtonText}>+ Add Patient</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name or condition"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollableFilter 
          options={[
            { label: 'All', value: null },
            { label: 'Active', value: 'active' },
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Discharged', value: 'discharged' },
            { label: 'Pending', value: 'pending' },
          ]}
          selectedValue={statusFilter}
          onSelect={setStatusFilter}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchPatients(1, searchQuery, true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.patientList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#1c2f7f']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => isLoading && !isRefreshing ? (
          <ActivityIndicator size="large" color="#1c2f7f" style={styles.loadingIndicator} />
        ) : null}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👨‍⚕️</Text>
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your search or filters to find patients.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

interface FilterOption {
  label: string;
  value: string | null;
}

interface ScrollableFilterProps {
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

const ScrollableFilter: React.FC<ScrollableFilterProps> = ({ 
  options, 
  selectedValue, 
  onSelect 
}) => {
  return (
    <View style={styles.scrollableFilter}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.filterOption,
            selectedValue === option.value && styles.selectedFilterOption
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[
            styles.filterOptionText,
            selectedValue === option.value && styles.selectedFilterOptionText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#64748b',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  scrollableFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#1c2f7f',
  },
  filterOptionText: {
    color: '#64748b',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  patientList: {
    padding: 16,
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1c2f7f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  patientBody: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  patientActions: {
    flexDirection: 'row',
    padding: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#f1f5f9',
  },
  viewButtonText: {
    color: '#1c2f7f',
    fontWeight: '500',
  },
  recordButton: {
    backgroundColor: '#26bc9f',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  scheduleButton: {
    backgroundColor: '#1c2f7f',
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingIndicator: {
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default PatientListScreen;
