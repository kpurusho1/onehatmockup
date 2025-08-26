import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

// Types
type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  avatar?: string;
};

type Record = {
  id: string;
  date: string;
  segments: number;
  sent: number;
  edited: number;
  status: 'sent' | 'draft';
  diagnosis?: string;
  prescriptions?: Array<{
    medicine: string;
    morning: number;
    noon: number;
    evening: number;
    night: number;
    duration: string;
    timeToTake: string;
    remarks: string;
  }>;
};

// Mock data
const mockRecords: Record[] = [
  {
    id: "1",
    date: "22 Aug 2025",
    segments: 16,
    sent: 4,
    edited: 0,
    status: 'sent',
    diagnosis: "Kidney stone",
    prescriptions: [{
      medicine: "Cefixime",
      morning: 1,
      noon: 0,
      evening: 1,
      night: 0,
      duration: "7 days",
      timeToTake: "N/A",
      remarks: "Oral antibiotic, 200 BD, morning one, evening one, for seven days, finish a course."
    }]
  },
  {
    id: "2",
    date: "22 Aug 2025",
    segments: 14,
    sent: 3,
    edited: 0,
    status: 'sent'
  },
  {
    id: "3",
    date: "14 Aug 2025",
    segments: 15,
    sent: 7,
    edited: 0,
    status: 'sent'
  }
];

interface PatientDetailsScreenProps {
  route?: {
    params?: {
      patient: Patient;
    };
  };
  navigation?: any;
}

const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({ route, navigation }) => {
  const patient = route?.params?.patient || {
    id: "1",
    name: "Arjun Sharma",
    phone: "+91 98765 43210",
    age: 32
  };

  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      if (aiQuery.toLowerCase().includes("any new trends") || aiQuery.toLowerCase().includes("trends")) {
        setAiResponse("Based on recent patient data, there have been 4 new cases of fever with headache symptoms in the past week, which is trending upward. This pattern suggests a possible flu outbreak in the community.");
      } else {
        setAiResponse(`Based on ${patient.name}'s medical history, I can provide insights about their recent consultations and treatment patterns. What specific aspect would you like me to analyze?`);
      }
      setIsAiLoading(false);
    }, 2000);
  };

  const handleBackPress = () => {
    if (selectedRecord) {
      setSelectedRecord(null);
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const renderRecordDetails = () => {
    if (!selectedRecord) return null;

    return (
      <View style={styles.recordDetailsContainer}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordDate}>{selectedRecord.date}</Text>
          <View style={[
            styles.statusBadge, 
            selectedRecord.status === 'sent' ? styles.sentBadge : styles.draftBadge
          ]}>
            <Text style={styles.statusText}>
              {selectedRecord.status === 'sent' ? '✓ Sent' : '⏱ Draft'}
            </Text>
          </View>
        </View>

        <View style={styles.recordInfo}>
          <Text style={styles.recordInfoText}>
            {selectedRecord.segments} segments • {selectedRecord.sent} sent • {selectedRecord.edited} edited
          </Text>
          {selectedRecord.diagnosis && (
            <Text style={styles.diagnosisText}>Diagnosis: {selectedRecord.diagnosis}</Text>
          )}
        </View>

        {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
          <View style={styles.prescriptionsContainer}>
            <Text style={styles.sectionTitle}>Prescriptions</Text>
            {selectedRecord.prescriptions.map((prescription, index) => (
              <View key={index} style={styles.prescriptionItem}>
                <Text style={styles.medicineName}>{prescription.medicine}</Text>
                <View style={styles.dosageContainer}>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Morning</Text>
                    <Text style={styles.dosageValue}>{prescription.morning}</Text>
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Noon</Text>
                    <Text style={styles.dosageValue}>{prescription.noon}</Text>
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Evening</Text>
                    <Text style={styles.dosageValue}>{prescription.evening}</Text>
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Night</Text>
                    <Text style={styles.dosageValue}>{prescription.night}</Text>
                  </View>
                </View>
                <Text style={styles.durationText}>Duration: {prescription.duration}</Text>
                <Text style={styles.remarksText}>{prescription.remarks}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedRecord ? 'Record Details' : `${patient.name}'s Records`}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {!selectedRecord ? (
          <>
            {/* Patient Info Card */}
            <View style={styles.patientCard}>
              <View style={styles.patientAvatarContainer}>
                <Text style={styles.patientAvatarText}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientInfo}>{patient.age} years • {patient.phone}</Text>
              </View>
            </View>

            {/* AI Query Section */}
            <View style={styles.aiQueryContainer}>
              <View style={styles.aiHeaderContainer}>
                <View style={styles.aiIconContainer}>
                  <Text style={styles.aiIconText}>AI</Text>
                </View>
                <Text style={styles.aiTitle}>Ask 1hat AI about {patient.name}'s history</Text>
              </View>
              
              <View style={styles.aiInputContainer}>
                <TextInput
                  style={styles.aiInput}
                  placeholder="Ask about diagnosis, medications, symptoms..."
                  value={aiQuery}
                  onChangeText={setAiQuery}
                  onSubmitEditing={handleAiQuery}
                />
                <TouchableOpacity 
                  style={[
                    styles.aiSendButton,
                    (!aiQuery.trim() || isAiLoading) && styles.aiSendButtonDisabled
                  ]}
                  onPress={handleAiQuery}
                  disabled={!aiQuery.trim() || isAiLoading}
                >
                  {isAiLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.aiSendButtonText}>→</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {aiResponse ? (
                <View style={styles.aiResponseContainer}>
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                </View>
              ) : null}
            </View>

            {/* Records List */}
            <View style={styles.recordsContainer}>
              <Text style={styles.recordsTitle}>Health Records</Text>
              {mockRecords.map((record) => (
                <TouchableOpacity 
                  key={record.id} 
                  style={styles.recordCard}
                  onPress={() => setSelectedRecord(record)}
                >
                  <View style={styles.recordCardContent}>
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordDate}>{record.date}</Text>
                      <View style={[
                        styles.statusBadge, 
                        record.status === 'sent' ? styles.sentBadge : styles.draftBadge
                      ]}>
                        <Text style={styles.statusText}>
                          {record.status === 'sent' ? '✓ Sent' : '⏱ Draft'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.recordInfo}>
                      <Text style={styles.recordInfoText}>
                        {record.segments} segments • {record.sent} sent • {record.edited} edited
                      </Text>
                      {record.diagnosis && (
                        <Text style={styles.diagnosisText}>Diagnosis: {record.diagnosis}</Text>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => setSelectedRecord(record)}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          renderRecordDetails()
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
  header: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  patientCard: {
    backgroundColor: '#1c2f7f',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  patientInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiQueryContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiIconText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  aiInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  aiInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  aiSendButton: {
    backgroundColor: '#4f46e5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSendButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  aiSendButtonText: {
    color: 'white',
    fontSize: 18,
  },
  aiResponseContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
  },
  aiResponseText: {
    fontSize: 14,
    color: '#334155',
  },
  recordsContainer: {
    padding: 16,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordCardContent: {
    padding: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentBadge: {
    backgroundColor: '#10b981',
  },
  draftBadge: {
    backgroundColor: '#6b7280',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  recordInfo: {
    marginBottom: 12,
  },
  recordInfoText: {
    fontSize: 14,
    color: '#64748b',
  },
  diagnosisText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  viewButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#1c2f7f',
  },
  recordDetailsContainer: {
    padding: 16,
  },
  prescriptionsContainer: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  prescriptionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dosageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dosageItem: {
    alignItems: 'center',
  },
  dosageLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  dosageValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});

export default PatientDetailsScreen;
