import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import NotificationsModal from '../components/NotificationsModal';
import AddPatientModal from '../components/AddPatientModal';
import audioRecorder from '../utils/audioRecorder';
import { useAuth } from '../contexts/AuthContext';
import pradhiRecorder from '../services/pradhiService';
import PatientService, { Patient } from '../services/patientService';
import PradhiService from '../services/pradhiService';
import DashboardService, { NewPatient, DashboardStats } from '../services/dashboardService';

interface HomeScreenProps {
  onLogout?: () => void;
  navigation?: NavigationProp<ParamListBase>;
}

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'processing' | 'completed' | 'error';

const HomeScreen = ({ onLogout, navigation }: HomeScreenProps = {}) => {
  // Get auth context
  const { doctorId: authDoctorId, user } = useAuth();

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [statsToggle, setStatsToggle] = useState<'today' | 'weekly'>('today');
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [addPatientModalVisible, setAddPatientModalVisible] = useState(false);
  const [patients, setPatients] = useState<NewPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<NewPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsperiod, setStatsperiod] = useState<'daily' | 'weekly'>('weekly');
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [correlationId, setCorrelationId] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string>('');
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<string>('00:00');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Format recording time (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reusable function to refresh patient list
  const refreshPatientList = async () => {
    try {
      setIsLoading(true);
      const response = await DashboardService.getNewPatients(2, 50);
      setPatients(response.patients);
      setFilteredPatients(response.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // If the new patients endpoint fails, try the working JWT endpoint
      try {
        const response = await PatientService.getAllPatients();
        const formattedPatients = response.map(patient => ({
          patient_id: patient.id,
          full_name: patient.full_name,
          phone_number: patient.phone_number,
          onehat_patient_id: patient.onehat_patient_id,
          relation_created_at: patient.created_at,
          relation_updated_at: patient.created_at,
          total_consultations: patient.number_of_records || 0,
          last_consultation_date: patient.last_consultation_date
        }));
        setPatients(formattedPatients);
        setFilteredPatients(formattedPatients);
      } catch (fallbackError) {
        console.error('Error with fallback patient fetch:', fallbackError);
        Alert.alert('Error', 'Failed to fetch patients');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch patients data on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await DashboardService.getNewPatients(2, 50);
        setPatients(response.patients);
        setFilteredPatients(response.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        Alert.alert('Error', 'Failed to fetch patients');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await DashboardService.getDetailedStats(statsperiod);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPatients();
    fetchDashboardStats();
  }, []);

  // Refresh patients when modal closes or component gains focus
  useEffect(() => {
    const refreshPatients = async () => {
      try {
        setIsLoading(true);
        const response = await DashboardService.getNewPatients(2, 50);
        setPatients(response.patients);
        setFilteredPatients(response.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!addPatientModalVisible) {
      // Modal closed, refresh patient list
      refreshPatients();
    }
  }, [addPatientModalVisible]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await DashboardService.getDetailedStats(statsperiod);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchDashboardStats();
  }, [statsperiod]);

  // Handle search functionality with pagination
  const handleSearch = async (query: string, page: number = 1, append: boolean = false) => {
    if (!append) {
      setSearchQuery(query);
      setSearchPage(1);
    }

    if (query.trim() === '') {
      // Search cleared - refresh patient list instead of using stale state
      try {
        setIsLoading(true);
        const response = await DashboardService.getNewPatients(2, 50);
        setPatients(response.patients);
        setFilteredPatients(response.patients);
      } catch (error) {
        console.error('Error refreshing patients on search clear:', error);
        // Fallback to existing patients if refresh fails
        setFilteredPatients(patients);
      } finally {
        setIsLoading(false);
      }
      setSearchHasMore(false);
      return;
    }

    try {
      setSearchLoading(true);
      const searchData = await PatientService.searchPatients(query);
      
      // Convert Patient[] to NewPatient[] format for consistency
      const convertedPatients = searchData.patients.map(patient => ({
        patient_id: patient.id,
        full_name: patient.full_name || '',
        phone_number: patient.phone_number || '',
        onehat_patient_id: patient.onehat_patient_id,
        relation_created_at: patient.created_at || new Date().toISOString(),
        relation_updated_at: patient.last_consultation_date || new Date().toISOString(),
        total_consultations: 0,
        last_consultation_date: patient.last_consultation_date
      }));
      
      if (append) {
        setFilteredPatients(prev => [...prev, ...convertedPatients]);
      } else {
        setFilteredPatients(convertedPatients);
      }
      
      // Check if there are more results
      setSearchHasMore(searchData.patients.length === 20);
      if (append) {
        setSearchPage(page);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      Alert.alert('Error', 'Failed to search patients');
    } finally {
      setSearchLoading(false);
    }
  };

  // Load more search results
  const loadMoreSearchResults = () => {
    if (searchQuery && searchHasMore && !searchLoading) {
      handleSearch(searchQuery, searchPage + 1, true);
    }
  };

  // Handle add patient
  const handleAddPatient = async (patientData: {
    name: string;
    mobile_number: string;
    date_of_birth: string;
    gender: string;
    age?: number;
  }) => {
    try {
      // Debug: Log the current doctor ID from auth context
      console.log('🔍 Current doctor ID from auth context:', authDoctorId);
      
      const result = await PatientService.createPatient(patientData);
      if (result.success) {
        Alert.alert('Success', 'Patient added successfully');
        // Refresh the patient list using the working JWT endpoint instead of the buggy new patients endpoint
        try {
          const response = await PatientService.getAllPatients();
          // Convert to the format expected by HomeScreen
          const formattedPatients = response.map(patient => ({
            patient_id: patient.id,
            full_name: patient.full_name,
            phone_number: patient.phone_number,
            onehat_patient_id: patient.onehat_patient_id,
            relation_created_at: patient.created_at,
            relation_updated_at: patient.created_at,
            total_consultations: patient.number_of_records || 0,
            last_consultation_date: patient.last_consultation_date
          }));
          setPatients(formattedPatients);
          setFilteredPatients(formattedPatients);
        } catch (refreshError) {
          console.error('Error refreshing patient list after creation:', refreshError);
          // Fallback: just reload the page data using the existing refresh function
          refreshPatientList();
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown; headers?: unknown } };
        console.error('❌ Status:', axiosError.response?.status);
        console.error('❌ Response data:', axiosError.response?.data);
        console.error('❌ Response headers:', axiosError.response?.headers);
      }
      
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  // Start the timer
  const startTimer = () => {
    const now = Date.now();
    setRecordingStartTime(now);
    setElapsedTime(0);
    setRecordingDuration('00:00');
    
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Set up a new interval
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - now) / 1000);
      setElapsedTime(elapsed);
      setRecordingDuration(formatTime(elapsed));
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Pause the timer
  const pauseTimer = () => {
    // Clear the interval
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Resume the timer
  const resumeTimer = () => {
    if (recordingStartTime === null) return;
    
    // Calculate the new start time based on elapsed time
    const newStartTime = Date.now() - (elapsedTime * 1000);
    setRecordingStartTime(newStartTime);
    
    // Set up a new interval
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - newStartTime) / 1000);
      setElapsedTime(elapsed);
      setRecordingDuration(formatTime(elapsed));
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Start recording process
  const handleStartRecording = async () => {
    try {
      // Check if patient is selected
      if (!selectedPatient) {
        Alert.alert('Error', 'Please select a patient before recording');
        return;
      }

      setRecordingStatus('recording');
      
      // 1. Start recording session with Pradhi API
      const doctorId = authDoctorId || '123'; // Use auth context or fallback
      const startResponse = await pradhiRecorder.startRecordingSession();
      if (!startResponse || !startResponse.correlation_id) {
        throw new Error('Failed to start recording session');
      }
      
      setCorrelationId(startResponse.correlation_id);
      console.log('Recording started with correlation ID:', startResponse.correlation_id);
      
      // 2. Start audio recording
      await audioRecorder.startRecording((e: { currentPosition: number; currentMetering: number }) => {
        // Update recording progress
        //setRecordingDuration(formatTime(e.currentPosition / 1000));
        setRecordingProgress(e.currentPosition);
      });
      
      // 3. Start the timer
      startTimer();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('error');
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  // Handle pause recording
  const handlePauseRecording = () => {
    // Toggle between recording and paused states
    // Note: In a real implementation, we would need to add pause/resume functionality to the audioRecorder service
    if (recordingStatus === 'recording') {
      console.log('Pausing recording');
      setRecordingStatus('paused' as RecordingStatus);
      pauseTimer(); // Pause the timer
    } else if (recordingStatus === 'paused') {
      console.log('Resuming recording');
      setRecordingStatus('recording');
      resumeTimer(); // Resume the timer
    }
  };

  // Stop recording and process audio
  const handleStopRecording = async () => {
    try {
      if ((recordingStatus !== 'recording' && recordingStatus !== 'paused') || !correlationId) {
        return;
      }
      
      setRecordingStatus('processing');
      
      // Clear the timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // 1. Stop audio recording
      const audioPath = await audioRecorder.stopRecording();
      console.log('Recording stopped, file saved at:', audioPath);
      
      // 2. Get audio data as base64
      const { base64Data, chunkNumber } = await audioRecorder.getCurrentChunkAsBase64();
      
      // 3. Upload audio chunk to Pradhi
      // Note: We can't directly use pradhiRecorder.uploadChunk as it's private
      // The PradhiLiveRecorder class handles chunk uploads internally
      // We'll rely on the mediaRecorder's ondataavailable event to trigger uploads
      
      // 4. Stop recording session with Pradhi
      try {
        await pradhiRecorder.stopRecording();
      } catch (stopError: unknown) {
        // If it's a 404 error, the recording session might not exist on the server
        // This is fine, we'll just continue with submission
        if (stopError && typeof stopError === 'object' && 'response' in stopError && 
            stopError.response && typeof stopError.response === 'object' && 'status' in stopError.response) {
          console.log('API error when stopping recording:', stopError.response.status);
        } else {
          console.log('API error when stopping recording:', stopError);
        }
        // Don't rethrow - we want to continue with the submission process
      }
      
      // 5. Submit recording with patient details
      const selectedPatientData = patients.find((p: NewPatient) => p.patient_id === selectedPatient);
      if (!selectedPatientData) {
        throw new Error('Selected patient data not found');
      }
      
      // Try to submit with new patient details, but fall back to regular submit if that fails
      let submitResponse;
      try {
        const doctorId = authDoctorId || '123'; // Use auth context or fallback
        submitResponse = await pradhiRecorder.submitForm(
          selectedPatientData.patient_id,
          selectedPatientData.full_name,
          selectedPatientData.phone_number || '',
          '', // patient email
          doctorId
        );
      } catch (submitError: unknown) {
        const errorStatus = submitError && typeof submitError === 'object' && 'response' in submitError && 
            submitError.response && typeof submitError.response === 'object' && 'status' in submitError.response ? 
            submitError.response.status : 'unknown';
        console.log('Error with submitRecordingWithNewPatient, trying regular submitRecording:', errorStatus);
        
        // Fall back to regular submit if the new patient endpoint fails
        try {
          // We already checked that selectedPatient exists above, but TypeScript doesn't know that
          if (!selectedPatient) {
            throw new Error('Selected patient ID is required');
          }
          
          const selectedPatientData = patients.find((p: NewPatient) => p.patient_id === selectedPatient);
          if (!selectedPatientData) {
            throw new Error('Selected patient data not found');
          }
          const doctorId = authDoctorId || '123'; // Use auth context or fallback
          submitResponse = await pradhiRecorder.submitForm(
            selectedPatientData.patient_id,
            selectedPatientData.full_name,
            selectedPatientData.phone_number || '',
            '', // patient email
            doctorId
          );
        } catch (fallbackError: unknown) {
          const errorStatus = fallbackError && typeof fallbackError === 'object' && 'response' in fallbackError && 
              fallbackError.response && typeof fallbackError.response === 'object' && 'status' in fallbackError.response ? 
              fallbackError.response.status : 'unknown';
          console.error('Both submission methods failed:', errorStatus);
          throw new Error('Failed to submit recording');
        }
      }
      
      if (!submitResponse?.success || !submitResponse?.submission_id) {
        throw new Error('Failed to submit recording - no submission ID returned');
      }
      
      setSubmissionId(submitResponse.submission_id);
      console.log('Recording submitted with submission ID:', submitResponse.submission_id);
      
      // 6. Start polling for results
      pollForResults(submitResponse.submission_id);
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      setRecordingStatus('error');
      Alert.alert('Processing Error', 'Failed to process recording. Please try again.');
      // Clean up
      await audioRecorder.cleanUp();
    }
  };
  
  // Poll for transcription results
  const pollForResults = async (submissionId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    
    const poll = async () => {
      try {
        attempts++;
        setProcessingProgress(Math.min((attempts / maxAttempts) * 100, 95)); // Cap at 95% until complete
        
        const doctorId = authDoctorId || '123'; // Use auth context or fallback
        const pollResponse = await pradhiRecorder.pollForTranscription(submissionId, 30, 10, selectedPatient || undefined);
        
        if (pollResponse && pollResponse.success && pollResponse.transcription) {
          // Transcription is ready
          console.log('Transcription completed successfully');
          
          // Save the submission to database
          const doctorId = authDoctorId || '123'; // Use auth context or fallback
          const saveResponse = await pradhiRecorder.fetchSubmissionById(submissionId, doctorId, selectedPatient || undefined);
          
          if (saveResponse.success) {
            setProcessingProgress(100);
            setRecordingStatus('completed');
            Alert.alert(
              'Success', 
              'Voice recording processed successfully!',
              [{ text: 'View Record', onPress: () => saveResponse.submission_id ? navigateToRecord(saveResponse.submission_id) : null }]
            );
          } else {
            throw new Error('Failed to save transcription');
          }
          
          return;
        }
        
        // If not ready and not reached max attempts, try again
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          throw new Error('Polling timeout reached');
        }
        
      } catch (error) {
        console.error('Error polling for results:', error);
        setRecordingStatus('error');
        Alert.alert('Processing Error', 'Failed to retrieve transcription results. Please try again.');
      }
    };
    
    // Start polling
    poll();
  };
  
  // Navigate to the record view with consultation ID
  const navigateToRecord = (consultationId: string) => {
    console.log('Navigate to consultation:', consultationId);
    
    if (navigation) {
      // Navigate to the Patient Files tab and pass the consultation ID
      navigation.navigate('Patient Files', {
        screen: 'RecordsList',
        params: { consultationId }
      });
    }
    
    // Reset recording state
    resetRecordingState();
  };
  
  // Handle adding a new patient from modal (convert format for API)
  const handleAddPatientFromModal = async (patientData: { name: string; phone: string; gender: string; dob: string }) => {
    console.log('🆕 Creating new patient:', patientData.name, 'for doctor:', authDoctorId);
    
    // Calculate age from DOB if provided
    const age = patientData.dob ? calculateAge(patientData.dob) : undefined;
    
    // Validate date format (DD/MM/YYYY)
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const validDob = patientData.dob && dobRegex.test(patientData.dob) ? patientData.dob : '01/01/1990';
    
    // Extract only the 10-digit mobile number (remove country code and spaces)
    const cleanMobileNumber = patientData.phone.replace(/[^\d]/g, '').slice(-10);
    
    const apiPatientData = {
      name: patientData.name,
      mobile_number: cleanMobileNumber,
      date_of_birth: validDob,
      gender: patientData.gender === 'male' ? 'Male' : patientData.gender === 'female' ? 'Female' : 'Male',
      age: age || 30,
    };
    
    console.log('📤 API payload:', apiPatientData);
    
    await handleAddPatient(apiPatientData);
  };
  
  // Helper function to calculate age from DOB
  const calculateAge = (dob: string): number => {
    try {
      const [day, month, year] = dob.split('/').map(Number);
      if (!year || isNaN(year)) return 0;
      
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  };
  
  // Reset recording state
  const resetRecordingState = () => {
    setRecordingStatus('idle');
    setCorrelationId('');
    setSubmissionId('');
    setRecordingProgress(0);
    setRecordingDuration('00:00');
    setProcessingProgress(0);
  };
  
  // Cancel recording
  const handleCancelRecording = async () => {
    try {
      // First stop the timer if it's running
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      if ((recordingStatus === 'recording' || recordingStatus === 'paused') && correlationId) {
        // Stop the audio recording first
        try {
          await audioRecorder.stopRecording();
        } catch (audioError) {
          console.log('Audio recorder already stopped or error stopping:', audioError);
          // Continue with cleanup even if audio recorder fails
        }
        
        // Try to stop the recording on the server
        try {
          const doctorId = authDoctorId || '123'; // Use auth context or fallback
          await pradhiRecorder.stopRecording();
        } catch (apiError: unknown) {
          // If it's a 404 error, the recording session might not exist on the server
          // This is fine, we'll just continue with cleanup
          if (apiError && typeof apiError === 'object' && 'response' in apiError && 
              apiError.response && typeof apiError.response === 'object' && 'status' in apiError.response) {
            console.log('API error when stopping recording:', apiError.response.status);
          } else {
            console.log('API error when stopping recording:', apiError);
          }
        }
      }
      
      // Always clean up and reset state
      await audioRecorder.cleanUp();
      resetRecordingState();
      
    } catch (error) {
      console.error('Error in cancel recording flow:', error);
      // Even if there's an error, try to reset the state
      resetRecordingState();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>1hat</Text>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Abhishant Padmanaban</Text>
            <Text style={styles.hospitalName}>City General Hospital</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setNotificationsVisible(true)}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={onLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ScrollView style={styles.scrollContent}>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statsToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, statsperiod === 'daily' && styles.toggleButtonActive]}
                onPress={() => setStatsperiod('daily')}
              >
                <Text style={[styles.toggleText, statsperiod === 'daily' && styles.toggleTextActive]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, statsperiod === 'weekly' && styles.toggleButtonActive]}
                onPress={() => setStatsperiod('weekly')}
              >
                <Text style={[styles.toggleText, statsperiod === 'weekly' && styles.toggleTextActive]}>
                  This Week
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                {statsLoading ? (
                  <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                  <Text style={styles.statNumber}>
                    {statsperiod === 'daily' 
                      ? (dashboardStats?.todays_consultations || 0)
                      : (dashboardStats?.total_consultations_week || 0)
                    }
                  </Text>
                )}
                <Text style={styles.statLabel}>Consultations</Text>
              </View>
              <View style={styles.statCard}>
                {statsLoading ? (
                  <ActivityIndicator size="small" color="#f59e0b" />
                ) : (
                  <Text style={[styles.statNumber, styles.statNumberOrange]}>
                    {statsperiod === 'daily'
                      ? (dashboardStats?.unsent_records_today || 0)
                      : (dashboardStats?.unsent_records_week || 0)
                    }
                  </Text>
                )}
                <Text style={styles.statLabel}>Pending Reviews</Text>
              </View>
            </View>
          </View>

          {/* Patient Record Section - Scrollable Part */}
          <View style={styles.recordingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select patient and record</Text>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search patients by name or phone..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <TouchableOpacity 
                style={styles.addPatientButton}
                onPress={() => setAddPatientModalVisible(true)}
              >
                <Text style={styles.addPatientButtonText}>+ Add Patient</Text>
              </TouchableOpacity>
            </View>
            
            {/* Patient List */}
            <View style={styles.patientList}>
              {isLoading ? (
                <View style={styles.recordingContainer}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text style={styles.recordingDuration}>Loading patients...</Text>
                </View>
              ) : (
                <>
                  {filteredPatients.map((patient: NewPatient) => (
                    <TouchableOpacity 
                      key={patient.patient_id}
                      style={[styles.patientItem, selectedPatient === patient.patient_id && styles.patientItemSelected]}
                      onPress={() => setSelectedPatient(patient.patient_id)}
                    >
                      <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>{patient.full_name}</Text>
                      </View>
                      <Text style={styles.patientPhone}>{patient.phone_number}</Text>
                    </TouchableOpacity>
                  ))}
                  {searchQuery && searchHasMore && (
                    <TouchableOpacity 
                      style={styles.loadMoreButton}
                      onPress={loadMoreSearchResults}
                      disabled={searchLoading}
                    >
                      {searchLoading ? (
                        <ActivityIndicator size="small" color="#3b82f6" />
                      ) : (
                        <Text style={styles.loadMoreText}>Load More Results</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
            
            {/* Add padding at the bottom to ensure scrolling works well with fixed button */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
        
        {/* Fixed Recording Button Container */}
        <View style={styles.fixedButtonContainer}>
          {recordingStatus === 'idle' && (
            <TouchableOpacity 
              style={[styles.startRecordingButton, !selectedPatient && styles.startRecordingButtonDisabled]}
              onPress={selectedPatient ? handleStartRecording : undefined}
              disabled={!selectedPatient}
            >
              <Text style={styles.startRecordingButtonIcon}>🎤</Text>
              <Text style={styles.startRecordingButtonText}>Start Recording</Text>
            </TouchableOpacity>
          )}
          
          {(recordingStatus === 'recording' || recordingStatus === 'paused') && (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingInfo}>
                <Text style={styles.recordingDuration}>{recordingDuration}</Text>
                <View style={styles.recordingIndicator}>
                  <View style={[styles.recordingDot, recordingStatus === 'paused' && styles.recordingDotPaused]} />
                  <Text style={[styles.recordingText, recordingStatus === 'paused' && styles.recordingTextPaused]}>
                    {recordingStatus === 'paused' ? 'Paused' : 'Recording...'}
                  </Text>
                </View>
              </View>
              <View style={styles.recordingActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelRecording}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pauseButton}
                  onPress={handlePauseRecording}
                >
                  <Text style={styles.pauseButtonText}>
                    {recordingStatus === ('paused' as RecordingStatus) ? 'Resume' : 'Pause'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.stopButton}
                  onPress={handleStopRecording}
                >
                  <Text style={styles.stopButtonText}>Stop & Process</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {recordingStatus === 'processing' && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color="#26bc9f" style={styles.processingSpinner} />
              <Text style={styles.processingText}>Processing voice recording...</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${processingProgress}%` }]} />
              </View>
              <Text style={styles.processingSubtext}>{processingProgress < 100 ? 'This may take a few minutes' : 'Almost done!'}</Text>
            </View>
          )}
          
          {recordingStatus === 'completed' && (
            <View style={styles.completedContainer}>
              <Text style={styles.completedIcon}>✓</Text>
              <Text style={styles.completedText}>Recording processed successfully!</Text>
              <TouchableOpacity 
                style={styles.newRecordingButton}
                onPress={resetRecordingState}
              >
                <Text style={styles.newRecordingButtonText}>New Recording</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {recordingStatus === 'error' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>An error occurred during recording</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={resetRecordingState}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {/* Notifications Modal */}
      <NotificationsModal 
        visible={notificationsVisible} 
        onClose={() => setNotificationsVisible(false)} 
      />
      
      {/* Add Patient Modal */}
      <AddPatientModal
        visible={addPatientModalVisible}
        onClose={() => setAddPatientModalVisible(false)}
        onAddPatient={handleAddPatientFromModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  hospitalName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
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
  statsToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c2f7f',
    marginBottom: 4,
  },
  statNumberOrange: {
    color: '#f59e0b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  recordingSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  addPatientButton: {
    backgroundColor: '#26bc9f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPatientButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  patientList: {
    marginBottom: 20,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  patientItemSelected: {
    backgroundColor: '#f0fdfa',
    borderColor: '#26bc9f',
  },
  patientInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#26bc9f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInitialsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 14,
    color: '#64748b',
  },
  patientPhone: {
    fontSize: 14,
    color: '#64748b',
  },
  startRecordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26bc9f',
    borderRadius: 8,
    paddingVertical: 14,
    shadowColor: '#26bc9f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  startRecordingButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowColor: '#94a3b8',
  },
  startRecordingButtonIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 8,
  },
  startRecordingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    minHeight: 80,
  },
  
  // Recording in progress styles
  recordingContainer: {
    width: '100%',
  },
  recordingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingDuration: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  recordingDotPaused: {
    backgroundColor: '#f59e0b',
  },
  
  // Load more button styles
  loadMoreButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  recordingText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  recordingTextPaused: {
    color: '#f59e0b',
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pauseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  stopButton: {
    flex: 2,
    backgroundColor: '#26bc9f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Processing styles
  processingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  processingSpinner: {
    marginBottom: 8,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#26bc9f',
    borderRadius: 3,
  },
  processingSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  
  // Completed styles
  completedContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  completedIcon: {
    fontSize: 24,
    color: '#26bc9f',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 12,
  },
  newRecordingButton: {
    backgroundColor: '#26bc9f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  newRecordingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Error styles
  errorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#1c2f7f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#26bc9f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;
