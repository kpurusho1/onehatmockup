import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

// Types for prescription data
type Medication = {
  id: string;
  name: string;
  morning: number;
  noon: number;
  evening: number;
  night: number;
  duration: string;
  timeToTake: string;
  remarks: string;
};

type Patient = {
  id: string;
  name: string;
  age: number;
};

// Mock data
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Cefixime',
    morning: 1,
    noon: 0,
    evening: 1,
    night: 0,
    duration: '7 days',
    timeToTake: 'After food',
    remarks: 'Oral antibiotic, 200 BD, morning one, evening one, for seven days, finish a course.',
  },
  {
    id: '2',
    name: 'Paracetamol',
    morning: 1,
    noon: 1,
    evening: 1,
    night: 0,
    duration: '5 days',
    timeToTake: 'As needed',
    remarks: 'For fever and pain relief. Take when temperature exceeds 100°F.',
  },
  {
    id: '3',
    name: 'Vitamin D3',
    morning: 1,
    noon: 0,
    evening: 0,
    night: 0,
    duration: '30 days',
    timeToTake: 'After breakfast',
    remarks: 'Supplement for vitamin D deficiency.',
  },
];

const mockPatient: Patient = {
  id: '1',
  name: 'Arjun Sharma',
  age: 32,
};

interface PrescriptionScreenProps {
  route?: {
    params?: {
      patient?: Patient;
      existingPrescription?: Medication[];
    };
  };
  navigation?: any;
}

const PrescriptionScreen: React.FC<PrescriptionScreenProps> = ({ route, navigation }) => {
  const patient = route?.params?.patient || mockPatient;
  const [medications, setMedications] = useState<Medication[]>(
    route?.params?.existingPrescription || mockMedications
  );
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new/editing medication
  const [medicationName, setMedicationName] = useState('');
  const [morning, setMorning] = useState('0');
  const [noon, setNoon] = useState('0');
  const [evening, setEvening] = useState('0');
  const [night, setNight] = useState('0');
  const [duration, setDuration] = useState('');
  const [timeToTake, setTimeToTake] = useState('');
  const [remarks, setRemarks] = useState('');

  const resetForm = () => {
    setMedicationName('');
    setMorning('0');
    setNoon('0');
    setEvening('0');
    setNight('0');
    setDuration('');
    setTimeToTake('');
    setRemarks('');
    setEditingMedication(null);
  };

  const handleAddMedication = () => {
    if (!medicationName.trim()) {
      Alert.alert('Error', 'Please enter a medication name');
      return;
    }

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: medicationName,
      morning: parseInt(morning) || 0,
      noon: parseInt(noon) || 0,
      evening: parseInt(evening) || 0,
      night: parseInt(night) || 0,
      duration: duration || '0 days',
      timeToTake: timeToTake || 'N/A',
      remarks: remarks || '',
    };

    setMedications([...medications, newMedication]);
    resetForm();
    setIsEditing(false);
  };

  const handleUpdateMedication = () => {
    if (!editingMedication) return;
    if (!medicationName.trim()) {
      Alert.alert('Error', 'Please enter a medication name');
      return;
    }

    const updatedMedications = medications.map(med => 
      med.id === editingMedication.id 
        ? {
            ...med,
            name: medicationName,
            morning: parseInt(morning) || 0,
            noon: parseInt(noon) || 0,
            evening: parseInt(evening) || 0,
            night: parseInt(night) || 0,
            duration: duration || '0 days',
            timeToTake: timeToTake || 'N/A',
            remarks: remarks || '',
          }
        : med
    );

    setMedications(updatedMedications);
    resetForm();
    setIsEditing(false);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setMedicationName(medication.name);
    setMorning(medication.morning.toString());
    setNoon(medication.noon.toString());
    setEvening(medication.evening.toString());
    setNight(medication.night.toString());
    setDuration(medication.duration);
    setTimeToTake(medication.timeToTake);
    setRemarks(medication.remarks);
    setIsEditing(true);
  };

  const handleDeleteMedication = (id: string) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMedications(medications.filter(med => med.id !== id));
          }
        },
      ]
    );
  };

  const handleSavePrescription = () => {
    // In a real app, this would save to a database or API
    Alert.alert('Success', 'Prescription saved successfully');
    if (navigation) {
      navigation.goBack();
    }
  };

  const renderMedicationForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {editingMedication ? 'Edit Medication' : 'Add New Medication'}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={styles.input}
            value={medicationName}
            onChangeText={setMedicationName}
            placeholder="Enter medication name"
          />
        </View>
        
        <Text style={styles.dosageTitle}>Dosage</Text>
        <View style={styles.dosageContainer}>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>Morning</Text>
            <TextInput
              style={styles.dosageInput}
              value={morning}
              onChangeText={setMorning}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>Noon</Text>
            <TextInput
              style={styles.dosageInput}
              value={noon}
              onChangeText={setNoon}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>Evening</Text>
            <TextInput
              style={styles.dosageInput}
              value={evening}
              onChangeText={setEvening}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>Night</Text>
            <TextInput
              style={styles.dosageInput}
              value={night}
              onChangeText={setNight}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g., 7 days"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>When to Take</Text>
          <TextInput
            style={styles.input}
            value={timeToTake}
            onChangeText={setTimeToTake}
            placeholder="e.g., After food"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Additional instructions or notes"
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.formActions}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              resetForm();
              setIsEditing(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={editingMedication ? handleUpdateMedication : handleAddMedication}
          >
            <Text style={styles.saveButtonText}>
              {editingMedication ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSavePrescription}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Patient Info */}
        <View style={styles.patientCard}>
          <View style={styles.patientAvatarContainer}>
            <Text style={styles.patientAvatarText}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientInfo}>{patient.age} years</Text>
          </View>
        </View>

        {/* Medications List */}
        {!isEditing && (
          <>
            <View style={styles.medicationsHeader}>
              <Text style={styles.medicationsTitle}>Medications</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {medications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No medications added yet</Text>
              </View>
            ) : (
              <View style={styles.medicationsList}>
                {medications.map((medication) => (
                  <View key={medication.id} style={styles.medicationCard}>
                    <View style={styles.medicationHeader}>
                      <Text style={styles.medicationName}>{medication.name}</Text>
                      <View style={styles.medicationActions}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => handleEditMedication(medication)}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDeleteMedication(medication.id)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.dosageRow}>
                      <View style={styles.dosageBlock}>
                        <Text style={styles.dosageBlockLabel}>Morning</Text>
                        <Text style={styles.dosageBlockValue}>{medication.morning}</Text>
                      </View>
                      <View style={styles.dosageBlock}>
                        <Text style={styles.dosageBlockLabel}>Noon</Text>
                        <Text style={styles.dosageBlockValue}>{medication.noon}</Text>
                      </View>
                      <View style={styles.dosageBlock}>
                        <Text style={styles.dosageBlockLabel}>Evening</Text>
                        <Text style={styles.dosageBlockValue}>{medication.evening}</Text>
                      </View>
                      <View style={styles.dosageBlock}>
                        <Text style={styles.dosageBlockLabel}>Night</Text>
                        <Text style={styles.dosageBlockValue}>{medication.night}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.medicationDetails}>
                      <Text style={styles.medicationDetail}>
                        <Text style={styles.detailLabel}>Duration: </Text>
                        {medication.duration}
                      </Text>
                      <Text style={styles.medicationDetail}>
                        <Text style={styles.detailLabel}>When to take: </Text>
                        {medication.timeToTake}
                      </Text>
                      {medication.remarks ? (
                        <Text style={styles.medicationRemarks}>
                          <Text style={styles.detailLabel}>Remarks: </Text>
                          {medication.remarks}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Add/Edit Medication Form */}
        {isEditing && renderMedicationForm()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
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
  medicationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  medicationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 16,
  },
  medicationsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  editButtonText: {
    color: '#1c2f7f',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  dosageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dosageBlock: {
    alignItems: 'center',
  },
  dosageBlockLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  dosageBlockValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  medicationDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  medicationDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  medicationRemarks: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
    color: '#64748b',
  },
  detailLabel: {
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dosageTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  dosageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dosageItem: {
    alignItems: 'center',
    flex: 1,
  },
  dosageLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  dosageInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 8,
    width: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#1c2f7f',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default PrescriptionScreen;
