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
  Switch,
} from 'react-native';

// Types
type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  avatar?: string;
};

type Prescription = {
  medicine: string;
  morning: number;
  noon: number;
  evening: number;
  night: number;
  duration: string;
  timeToTake?: string;
  remarks: string;
};

type Record = {
  id: string;
  date: string;
  segments: number;
  sent: number;
  edited: number;
  status: 'sent' | 'draft';
  keyFacts?: string;
  diagnosis?: string;
  prescriptions?: Array<Prescription>;
  nextSteps?: string;
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
    keyFacts: "Patient presented with severe flank pain and hematuria for 2 days.",
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
    }],
    nextSteps: "Follow-up in 1 week. Increase fluid intake. CT scan if symptoms persist."
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
  const [editMode, setEditMode] = useState(false);
  const [editedRecord, setEditedRecord] = useState<Record | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState({
    keyFacts: false,
    diagnosis: false,
    prescriptions: false,
    nextSteps: false,
  });
  
  // State initialization complete

  // Function declarations moved below
  
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
    if (editMode) {
      // Exit edit mode without saving changes
      setEditMode(false);
      setEditedRecord(null);
      resetSelectedBlocks();
    } else if (selectedRecord) {
      setSelectedRecord(null);
    } else if (navigation) {
      navigation.goBack();
    }
  };
  
  const resetSelectedBlocks = () => {
    setSelectedBlocks({
      keyFacts: false,
      diagnosis: false,
      prescriptions: false,
      nextSteps: false
    });
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      // Exit edit mode
      setEditMode(false);
      setEditedRecord(null);
      resetSelectedBlocks();
    } else {
      // Enter edit mode
      setEditMode(true);
      setEditedRecord(selectedRecord ? {...selectedRecord} : null);
    }
  };
  
  const handleSave = () => {
    if (editedRecord) {
      setSelectedRecord(editedRecord);
      setEditMode(false);
      resetSelectedBlocks();
    }
  };
  
  const handleSend = () => {
    if (editedRecord) {
      // Here you would typically send the data to a server
      // For now, we'll just update the local state
      setSelectedRecord({...editedRecord, status: 'sent'});
      setEditMode(false);
      resetSelectedBlocks();
      // Show a success message or notification here
    }
  };
  
  const toggleBlockSelection = (blockName: keyof typeof selectedBlocks) => {
    setSelectedBlocks(prev => ({
      ...prev,
      [blockName]: !prev[blockName]
    }));
  };
  
  const updateEditedRecord = (field: keyof Record, value: any) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        [field]: value
      });
    }
  };
  
  const updatePrescription = (index: number, field: keyof Prescription, value: any) => {
    if (editedRecord && editedRecord.prescriptions) {
      const updatedPrescriptions = [...editedRecord.prescriptions];
      updatedPrescriptions[index] = {
        ...updatedPrescriptions[index],
        [field]: value
      };
      
      setEditedRecord({
        ...editedRecord,
        prescriptions: updatedPrescriptions
      });
    }
  };

  const renderRecordDetails = () => {
    if (!selectedRecord) return null;
    
    const record = editMode ? editedRecord! : selectedRecord;

    return (
      <View style={styles.recordDetailsContainer}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordDate}>{record.date}</Text>
          {!editMode ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={toggleEditMode}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.recordInfo}>
          <Text style={styles.recordInfoText}>
            {record.segments} segments • {record.sent} sent • {record.edited} edited
          </Text>
        </View>

        {/* Key Facts Block */}
        <View style={[styles.contentBlock, editMode && selectedBlocks.keyFacts && styles.selectedBlock]}>
          {editMode && (
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleBlockSelection('keyFacts')}
            >
              <View style={[styles.checkbox, selectedBlocks.keyFacts && styles.checkboxSelected]}>
                {selectedBlocks.keyFacts && <Text style={styles.checkboxText}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
          <Text style={styles.sectionTitle}>Key Facts</Text>
          {editMode ? (
            <TextInput
              style={styles.textInput}
              multiline
              value={record.keyFacts || ''}
              onChangeText={(text) => updateEditedRecord('keyFacts', text)}
              placeholder="Enter key facts about the patient"
              editable={editMode}
            />
          ) : (
            <Text style={styles.contentText}>{record.keyFacts || 'No key facts recorded'}</Text>
          )}
        </View>

        {/* Diagnosis Block */}
        <View style={[styles.contentBlock, editMode && selectedBlocks.diagnosis && styles.selectedBlock]}>
          {editMode && (
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleBlockSelection('diagnosis')}
            >
              <View style={[styles.checkbox, selectedBlocks.diagnosis && styles.checkboxSelected]}>
                {selectedBlocks.diagnosis && <Text style={styles.checkboxText}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          {editMode ? (
            <TextInput
              style={styles.textInput}
              multiline
              value={record.diagnosis || ''}
              onChangeText={(text) => updateEditedRecord('diagnosis', text)}
              placeholder="Enter diagnosis"
              editable={editMode}
            />
          ) : (
            <Text style={styles.contentText}>{record.diagnosis || 'No diagnosis recorded'}</Text>
          )}
        </View>

        {/* Prescriptions Block */}
        <View style={[styles.contentBlock, editMode && selectedBlocks.prescriptions && styles.selectedBlock]}>
          {editMode && (
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleBlockSelection('prescriptions')}
            >
              <View style={[styles.checkbox, selectedBlocks.prescriptions && styles.checkboxSelected]}>
                {selectedBlocks.prescriptions && <Text style={styles.checkboxText}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.prescriptionHeaderContainer}>
            <Text style={styles.sectionTitle}>Prescriptions</Text>
            <View style={{ flex: 0.8 }} />
            {editMode && (
              <TouchableOpacity 
                style={styles.addMedicineButton}
                onPress={() => {
                  if (editedRecord) {
                    const newPrescription = {
                      medicine: '',
                      morning: 0,
                      noon: 0,
                      evening: 0,
                      night: 0,
                      duration: '',
                      remarks: ''
                    };
                    setEditedRecord({
                      ...editedRecord,
                      prescriptions: [...(editedRecord.prescriptions || []), newPrescription]
                    });
                  }
                }}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            )}
          </View>
          {record.prescriptions && record.prescriptions.length > 0 ? (
            record.prescriptions.map((prescription, index) => (
              <View key={index} style={styles.prescriptionItem}>
                <View style={styles.medicineHeaderRow}>
                  {editMode ? (
                    <TextInput
                      style={styles.medicineNameInput}
                      value={prescription.medicine}
                      onChangeText={(text) => updatePrescription(index, 'medicine', text)}
                      editable={editMode}
                      placeholder="Medicine name"
                    />
                  ) : (
                    <Text style={styles.medicineName}>{prescription.medicine}</Text>
                  )}
                  {editMode && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => {
                        if (editedRecord && editedRecord.prescriptions) {
                          const updatedPrescriptions = [...editedRecord.prescriptions];
                          updatedPrescriptions.splice(index, 1);
                          setEditedRecord({
                            ...editedRecord,
                            prescriptions: updatedPrescriptions
                          });
                        }
                      }}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.dosageContainer}>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Morning</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.dosageInput}
                        value={prescription.morning.toString()}
                        onChangeText={(text) => updatePrescription(index, 'morning', parseInt(text) || 0)}
                        keyboardType="numeric"
                        editable={editMode}
                      />
                    ) : (
                      <Text style={styles.dosageValue}>{prescription.morning}</Text>
                    )}
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Noon</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.dosageInput}
                        value={prescription.noon.toString()}
                        onChangeText={(text) => updatePrescription(index, 'noon', parseInt(text) || 0)}
                        keyboardType="numeric"
                        editable={editMode}
                      />
                    ) : (
                      <Text style={styles.dosageValue}>{prescription.noon}</Text>
                    )}
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Evening</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.dosageInput}
                        value={prescription.evening.toString()}
                        onChangeText={(text) => updatePrescription(index, 'evening', parseInt(text) || 0)}
                        keyboardType="numeric"
                        editable={editMode}
                      />
                    ) : (
                      <Text style={styles.dosageValue}>{prescription.evening}</Text>
                    )}
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Night</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.dosageInput}
                        value={prescription.night.toString()}
                        onChangeText={(text) => updatePrescription(index, 'night', parseInt(text) || 0)}
                        keyboardType="numeric"
                        editable={editMode}
                      />
                    ) : (
                      <Text style={styles.dosageValue}>{prescription.night}</Text>
                    )}
                  </View>
                  <View style={styles.dosageItem}>
                    <Text style={styles.dosageLabel}>Duration</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.dosageInput}
                        value={prescription.duration}
                        onChangeText={(text) => updatePrescription(index, 'duration', text)}
                        editable={editMode}
                      />
                    ) : (
                      <Text style={styles.dosageValue}>{prescription.duration}</Text>
                    )}
                  </View>
                </View>
                {editMode ? (
                  <>
                    <Text style={styles.inputLabel}>Remarks:</Text>
                    <TextInput
                      style={styles.textInput}
                      multiline
                      value={prescription.remarks}
                      onChangeText={(text) => updatePrescription(index, 'remarks', text)}
                      editable={editMode}
                      placeholder="Add any remarks or instructions"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.remarksText}>{prescription.remarks}</Text>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No prescriptions added</Text>
          )}
        </View>

        {/* Next Steps Block */}
        <View style={[styles.contentBlock, editMode && selectedBlocks.nextSteps && styles.selectedBlock]}>
          {editMode && (
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleBlockSelection('nextSteps')}
            >
              <View style={[styles.checkbox, selectedBlocks.nextSteps && styles.checkboxSelected]}>
                {selectedBlocks.nextSteps && <Text style={styles.checkboxText}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
          <Text style={styles.sectionTitle}>Next Steps</Text>
          {editMode ? (
            <TextInput
              style={styles.textInput}
              multiline
              value={record.nextSteps || ''}
              onChangeText={(text) => updateEditedRecord('nextSteps', text)}
              placeholder="Enter next steps for the patient"
              editable={editMode}
            />
          ) : (
            <Text style={styles.contentText}>{record.nextSteps || 'No next steps recorded'}</Text>
          )}
        </View>

        {/* Action Buttons */}
        {editMode && (
          <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleEditMode}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.actionButtonText}>Send</Text>
              </TouchableOpacity>
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
                      onPress={() => setSelectedRecord(record)}
                    >
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4a90e2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: '500',
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
  },
  editButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  contentBlock: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedBlock: {
    borderColor: '#4a90e2',
    backgroundColor: '#f0f7ff',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: '#4a90e2',
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    backgroundColor: 'white',
    minHeight: 80,
  },
  medicineNameInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    width: 50,
    textAlign: 'center',
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    width: 80,
    textAlign: 'center',
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // Added missing styles
  recordDetailsContainer: {
    flex: 1,
    padding: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recordInfo: {
    marginBottom: 16,
  },
  recordInfoText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  contentText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  prescriptionItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dosageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dosageItem: {
    marginRight: 16,
    marginBottom: 8,
  },
  dosageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dosageValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  aiHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIconContainer: {
    backgroundColor: '#4a90e2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  aiInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: 'white',
  },
  aiSendButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  aiSendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiResponseContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
  },
  aiResponseText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  recordsContainer: {
    marginTop: 16,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  recordCardContent: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sentBadge: {
    backgroundColor: '#4caf50',
  },
  draftBadge: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  diagnosisText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    padding: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  prescriptionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  addMedicineButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  medicineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});

export default PatientDetailsScreen;
