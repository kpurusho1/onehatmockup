import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

interface HealthRecord {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'review';
  diagnosis: string;
  summary: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
}

interface RecordsScreenProps {
  navigation?: any;
  route?: {
    params?: {
      consultationId?: string;
    };
  };
}

const RecordsScreen: React.FC<RecordsScreenProps> = ({ navigation, route }) => {
  // Get consultationId from route params if available
  const consultationId = route?.params?.consultationId;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Mock patients data
  const mockPatients: Patient[] = [
    {
      id: "1",
      name: "Arjun Sharma",
      phone: "+91 98765 43210",
      age: 32
    },
    {
      id: "2",
      name: "Priya Patel",
      phone: "+91 87654 32109",
      age: 28
    },
    {
      id: "3",
      name: "Rajesh Kumar",
      phone: "+91 76543 21098",
      age: 45
    },
    {
      id: "4",
      name: "Anita Singh",
      phone: "+91 65432 10987",
      age: 36
    },
  ];

  const mockRecords: HealthRecord[] = [
    {
      id: '1',
      patientName: 'Arjun Sharma',
      date: '2024-08-25',
      time: '10:30 AM',
      status: 'review',
      diagnosis: 'Hypertension',
      summary: 'Patient reports chest discomfort and elevated blood pressure readings...',
    },
    {
      id: '2',
      patientName: 'Priya Patel',
      date: '2024-08-25',
      time: '09:15 AM',
      status: 'review',
      diagnosis: 'Diabetes Type 2',
      summary: 'Follow-up consultation for diabetes management and medication adjustment...',
    },
    {
      id: '3',
      patientName: 'Rajesh Kumar',
      date: '2024-08-24',
      time: '02:45 PM',
      status: 'completed',
      diagnosis: 'Common Cold',
      summary: 'Patient presented with cold symptoms, prescribed symptomatic treatment...',
    },
    {
      id: '4',
      patientName: 'Anita Singh',
      date: '2024-08-24',
      time: '11:20 AM',
      status: 'completed',
      diagnosis: 'Migraine',
      summary: 'Chronic migraine patient, adjusted medication dosage...',
    },
  ];

  const filteredRecords = mockRecords.filter(record => {
    // If consultationId is provided, only show that record
    if (consultationId && record.id === consultationId) {
      return true;
    }
    
    // Otherwise apply normal filters
    if (!consultationId) {
      const matchesSearch = record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || record.status === selectedFilter;
      return matchesSearch && matchesFilter;
    }
    
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'review': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'review': return 'Ready for Review';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Records</Text>
        <Text style={styles.headerSubtitle}>View and manage patient records</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name or diagnosis..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'completed' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterText, selectedFilter === 'completed' && styles.filterTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Records List */}
      <ScrollView style={styles.recordsList}>
        {filteredRecords.map((record) => (
          <TouchableOpacity 
            key={record.id} 
            style={[styles.recordCard, consultationId && record.id === consultationId && styles.highlightedRecord]}
            onPress={() => {
              // Find the corresponding patient
              const patientName = record.patientName;
              const patient = mockPatients.find(p => p.name === patientName);
              
              if (patient && navigation) {
                navigation.navigate('PatientDetails', { patient });
              }
            }}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordInfo}>
                <Text style={styles.patientName}>{record.patientName}</Text>
                <Text style={styles.recordDate}>{record.date} • {record.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                <Text style={styles.statusText}>{getStatusText(record.status)}</Text>
              </View>
            </View>
            
            <View style={styles.recordContent}>
              <Text style={styles.diagnosis}>Diagnosis: {record.diagnosis}</Text>
              <Text style={styles.summary} numberOfLines={2}>
                {record.summary}
              </Text>
            </View>
            
            <View style={styles.recordActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  const patientName = record.patientName;
                  const patient = mockPatients.find(p => p.name === patientName);
                  
                  if (patient && navigation) {
                    navigation.navigate('PatientDetails', { patient });
                  }
                }}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              {record.status === 'review' && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.reviewButton]}
                  onPress={() => {
                    const patientName = record.patientName;
                    const patient = mockPatients.find(p => p.name === patientName);
                    
                    if (patient && navigation) {
                      navigation.navigate('Prescription', { patient });
                    }
                  }}
                >
                  <Text style={[styles.actionButtonText, styles.reviewButtonText]}>Review</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        {filteredRecords.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>No Records Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No health records available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  highlightedRecord: {
    borderWidth: 2,
    borderColor: '#1c2f7f',
    backgroundColor: '#f0f9ff',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#1c2f7f',
    borderColor: '#1c2f7f',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  recordsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  recordContent: {
    marginBottom: 12,
  },
  diagnosis: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  reviewButton: {
    backgroundColor: '#1c2f7f',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  reviewButtonText: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 200,
  },
});

export default RecordsScreen;
