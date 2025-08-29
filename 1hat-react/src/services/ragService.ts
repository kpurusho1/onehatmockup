import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RAGResponse {
  success: boolean;
  answer?: string;
  sources?: Array<{ date: string }>;
  error?: string;
}

export interface RAGTextQuery {
  patient_id: string;
  query_text: string;
}

export interface RAGVoiceQuery {
  patient_id: string;
  audio_data: string;
}

class RAGService {
  /**
   * Query patient history using text input
   */
  async queryPatientHistoryText(patientId: string, queryText: string): Promise<RAGResponse> {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      const payload: RAGTextQuery = {
        patient_id: patientId,
        query_text: queryText
      };

      const response = await apiClient.post('/rag/query-text', payload, {
        params: { doctor_id: doctorId }
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Error in text RAG query:', error);
      return {
        success: false,
        error: 'Error while Querying'
      };
    }
  }

  /**
   * Query patient history using voice input
   */
  async queryPatientHistoryVoice(patientId: string, audioBase64: string): Promise<RAGResponse> {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      const payload: RAGVoiceQuery = {
        patient_id: patientId,
        audio_data: audioBase64
      };

      const response = await apiClient.post('/rag/query-voice', payload, {
        params: { doctor_id: doctorId }
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Error in voice RAG query:', error);
      return {
        success: false,
        error: 'Error while Querying'
      };
    }
  }
}

const ragService = new RAGService();
export default ragService;
