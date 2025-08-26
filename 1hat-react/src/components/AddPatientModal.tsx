import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { RadioButton } from 'react-native-paper';

interface AddPatientModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPatient: (patient: {
    name: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
  }) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  visible,
  onClose,
  onAddPatient,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!name.trim()) {
      alert('Please enter patient name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter patient phone number');
      return;
    }

    // Submit the new patient
    onAddPatient({
      name: name.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      gender,
      dob: dob.trim(),
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setCountryCode('+91');
    setGender('male');
    setDob('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Format DOB input as DD/MM/YYYY
  const handleDobChange = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Format with slashes
    let formatted = '';
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    
    setDob(formatted);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Patient</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Patient mobile number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter 10 digits"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="male"
                    status={gender === 'male' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('male')}
                    color="#00A884"
                  />
                  <Text style={styles.radioLabel}>Male</Text>
                </View>
                
                <View style={styles.radioOption}>
                  <RadioButton
                    value="female"
                    status={gender === 'female' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('female')}
                    color="#00A884"
                  />
                  <Text style={styles.radioLabel}>Female</Text>
                </View>
                
                <View style={styles.radioOption}>
                  <RadioButton
                    value="other"
                    status={gender === 'other' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('other')}
                    color="#00A884"
                  />
                  <Text style={styles.radioLabel}>Other</Text>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Patient's Full Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter full name"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.fieldLabel}>DOB (DD/MM/YYYY)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                value={dob}
                onChangeText={handleDobChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Patient</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A884',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#888',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: 60,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: 'red',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00A884',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPatientModal;
