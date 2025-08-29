/**
 * Pradhi Live API Integration Service
 * Handles real-time audio recording and transcription with Pradhi
 * Based on working implementation from testing_frontend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Using process.env for TypeScript compatibility
const API_BASE_URL = process.env.VITE_API_URL || 'http://192.168.0.104:8000';

// Response interfaces matching backend API
export interface AuthTestResponse {
  success: boolean;
  message: string;
  token_preview?: string;
}

export interface RecordingSessionResponse {
  success: boolean;
  correlation_id?: string;
  chunk_interval?: number;
  message: string;
}

export interface ChunkUploadResponse {
  success: boolean;
  message: string;
  chunk_count?: number;
}

export interface FormSubmissionResponse {
  success: boolean;
  submission_id?: string;
  message: string;
}

// Define the structure of consultation data
interface ConsultationData {
  consultation_id: string;
  [key: string]: unknown;
}

// Define the structure of insights data
interface InsightData {
  [key: string]: string | number | boolean | object | null;
}

export interface FetchSubmissionResponse {
  success: boolean;
  data?: ConsultationData;
  message: string;
  transcription?: string;
  insights?: Record<string, InsightData>;
  submission_id?: string;
}

/**
 * PradhiLiveRecorder - Complete audio recording and transcription service
 * Implements the exact flow: authenticate → start audio → upload chunks → stop → submit → fetch
 */
class PradhiLiveRecorder {
  private correlationId: string | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunkTimer: ReturnType<typeof setInterval> | null = null;
  private chunkStartTime: number | null = null;
  private chunkCount: number = 0;
  private isRecording: boolean = false;
  private submissionId: string | null = null;
  private audioStream: MediaStream | null = null;
  private isPaused: boolean = false;
  private isCanceling: boolean = false;
  private recordingStartTime: number = 0;
  private totalRecordingDuration: number = 0;
  private pauseStartTime: number = 0;
  private pauseTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly PAUSE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

  /**
   * Test Pradhi authentication
   */
  async testAuthentication(): Promise<AuthTestResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/pradhi/auth/test`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: `Authentication test failed: ${error}`
      };
    }
  }

  /**
   * Start a new recording session
   * Returns correlation_id and chunk_interval
   */
  async startRecordingSession(): Promise<RecordingSessionResponse> {
    try {
      console.log('🎤 Starting Pradhi recording session...');
      
      // Reset duration tracking
      this.recordingStartTime = Date.now();
      this.totalRecordingDuration = 0;
      this.pauseStartTime = 0;
      this.isPaused = false;
      this.isCanceling = false;
      
      // Clear any existing pause timeout
      if (this.pauseTimeoutId) {
        clearTimeout(this.pauseTimeoutId);
        this.pauseTimeoutId = null;
      }
      
      const response = await fetch(`${API_BASE_URL}/pradhi/recording/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result: RecordingSessionResponse = await response.json();
      
      if (result.success && result.correlation_id) {
        this.correlationId = result.correlation_id;
        console.log(`✅ Recording session started: ${result.correlation_id}`);
        
        // Initialize audio recording
        await this.initializeAudioRecording();
        
        return result;
      } else {
        throw new Error(result.message || 'Failed to start recording session');
      }
    } catch (error) {
      console.error('❌ Failed to start recording session:', error);
      throw error;
    }
  }

  /**
   * Initialize browser audio recording with chunking
   */
  private async initializeAudioRecording(): Promise<void> {
    try {
      console.log('🎙️ Initializing browser audio recording...');
      
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      // Handle data available events (chunks)
      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && !this.isPaused && !this.isCanceling) {
          console.log(`📤 Audio chunk available: ${event.data.size} bytes`);
          await this.uploadChunk(event.data, false);
        } else if (this.isPaused && event.data.size > 0) {
          console.log(`⏸️ Chunk generated but paused - not uploading (${event.data.size} bytes)`);
        } else if (this.isCanceling && event.data.size > 0) {
          console.log(`🛑 Chunk generated but canceling - discarding (${event.data.size} bytes)`);
        }
      };
      
      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        console.log('⏹️ MediaRecorder stopped');
        this.cleanupAudio();
      };
      
      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      
      // Set up chunking timer (10 seconds as per Pradhi requirements)
      this.startChunkTimer();
      
      console.log('✅ Audio recording initialized and started');
    } catch (error) {
      console.error('❌ Failed to initialize audio recording:', error);
      throw error;
    }
  }

  /**
   * Start chunk timer for regular audio chunk uploads
   */
  private startChunkTimer(): void {
    const chunkInterval = 10000; // 10 seconds
    
    this.chunkTimer = setInterval(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        console.log('⏰ Chunk timer triggered - requesting data');
        this.mediaRecorder.requestData();
      }
    }, chunkInterval);
  }

  /**
   * Upload audio chunk to Pradhi
   */
  private async uploadChunk(audioBlob: Blob, isLast: boolean = false): Promise<ChunkUploadResponse> {
    try {
      if (!this.correlationId) {
        console.log('⚠️ Upload chunk called but no correlation ID available - likely canceled');
        return { success: false, message: 'No correlation ID available - recording canceled' };
      }
      
      if (this.isCanceling) {
        console.log('⚠️ Upload chunk called but recording is being canceled - skipping');
        return { success: false, message: 'Recording is being canceled' };
      }
      
      // Convert blob to base64
      const base64Data = await this.blobToBase64(audioBlob);
      
      // Create data URL format expected by backend
      const dataUrl = `data:audio/webm;codecs=opus;base64,${base64Data}`;
      
      const payload = {
        correlation_id: this.correlationId,
        audio_data: dataUrl,
        is_final: isLast
      };
      
      console.log(`📤 Uploading chunk ${this.chunkCount + 1} (${audioBlob.size} bytes, final: ${isLast})`);
      
      const response = await fetch(`${API_BASE_URL}/pradhi/recording/chunk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result: ChunkUploadResponse = await response.json();
      
      if (result.success) {
        this.chunkCount++;
        console.log(`✅ Chunk ${this.chunkCount} uploaded successfully`);
      } else {
        console.error('❌ Chunk upload failed:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to upload chunk:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<void> {
    try {
      console.log('⏹️ Stopping recording...');
      
      // Add final recording time if not paused
      if (!this.isPaused && this.recordingStartTime > 0) {
        this.totalRecordingDuration += Date.now() - this.recordingStartTime;
      }
      
      const totalDuration = this.getTotalRecordingDuration();
      console.log(`📊 Total recording duration: ${totalDuration} seconds`);
      
      // Check if duration is sufficient for meaningful insights
      if (!this.hasSufficientDuration()) {
        console.warn(`⚠️ Recording duration (${totalDuration}s) may be too short for meaningful insights. Recommended: 30+ seconds`);
      }
      
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        // Stop the MediaRecorder
        this.mediaRecorder.stop();
      }
      
      // Clear the chunk timer
      if (this.chunkTimer) {
        clearInterval(this.chunkTimer);
        this.chunkTimer = null;
      }
      
      this.isRecording = false;
      console.log('✅ Recording stopped');
      
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * Cancel recording - stops recording and prevents any further chunk uploads
   */
  async cancelRecording(): Promise<void> {
    try {
      console.log('🛑 Canceling recording...');
      this.isCanceling = true;
      
      // Stop recording first
      await this.stopRecording();
      
      // Reset all state
      this.reset();
      
      console.log('✅ Recording canceled successfully');
    } catch (error) {
      console.error('❌ Failed to cancel recording:', error);
      // Force reset even if stop fails
      this.reset();
      throw error;
    }
  }

  /**
   * Clean up audio resources
   */
  private cleanupAudio(): void {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
  }

  /**
   * Submit form with patient details
   */
  async submitForm(patientId: string, patientName: string, patientPhone: string, patientEmail: string, onehatDoctorId: string): Promise<FormSubmissionResponse> {
    try {
      if (!this.correlationId) {
        throw new Error('No correlation ID available');
      }
      
      console.log(`📤 Submitting form for ${patientName} (${patientPhone}) with ID: ${patientId} and doctor ID: ${onehatDoctorId}`);
      
      const payload = {
        correlation_id: this.correlationId,
        patient_id: patientId,  // Add patient ID to payload
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail,
        onehat_doctor_id: onehatDoctorId  // Add OneHat doctor ID for metadata
      };
      
      const response = await fetch(`${API_BASE_URL}/pradhi/recording/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result: FormSubmissionResponse = await response.json();
      
      if (result.success && result.submission_id) {
        this.submissionId = result.submission_id;
        console.log(`✅ Form submitted successfully: ${result.submission_id}`);
      } else {
        console.error('❌ Form submission failed:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to submit form:', error);
      throw error;
    }
  }

  /**
   * Submit form with patient details asynchronously - returns immediately without waiting for transcription
   */
  async submitFormAsync(patientId: string, patientName: string, patientPhone: string, patientEmail: string, onehatDoctorId: string): Promise<FormSubmissionResponse> {
    try {
      if (!this.correlationId) {
        throw new Error('No correlation ID available');
      }
      
      console.log(`📤 Submitting form asynchronously for ${patientName} (${patientPhone}) with ID: ${patientId} and doctor ID: ${onehatDoctorId}`);
      
      const payload = {
        correlation_id: this.correlationId,
        patient_id: patientId,
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail,
        onehat_doctor_id: onehatDoctorId
      };
      
      const response = await fetch(`${API_BASE_URL}/pradhi/recording/submit-async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result: FormSubmissionResponse = await response.json();
      
      if (result.success && result.submission_id) {
        this.submissionId = result.submission_id;
        console.log(`✅ Form submitted asynchronously: ${result.submission_id}`);
      } else {
        console.error('❌ Async form submission failed:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to submit form asynchronously:', error);
      throw error;
    }
  }

  /**
   * Fetch submission by ID and save to database
   */
  async fetchSubmissionById(submissionId: string, doctorId: string, patientId?: string): Promise<FetchSubmissionResponse> {
    try {
      console.log(`🎯 Fetching submission by ID: ${submissionId}`);
      console.log(`🔄 Using doctor_id: ${doctorId} for fetch-and-save`);
      console.log(`🔄 Using patient_id: ${patientId} for fetch-and-save`);
      
      const payload = {
        submission_id: submissionId,
        doctor_id: doctorId,
        patient_id: patientId  // Include patient_id in payload
      };
      
      const response = await fetch(`${API_BASE_URL}/pradhi/submission/fetch-and-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result: FetchSubmissionResponse = await response.json();
      
      if (result.success) {
        console.log(`✅ Submission ${submissionId} fetched and saved to database!`);
      } else {
        console.log(`⚠️ Submission not ready: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to fetch submission:`, error);
      throw error;
    }
  }

  /**
   * Poll for transcription completion with retry logic
   */
  async pollForTranscription(submissionId: string, maxAttempts: number = 30, delaySeconds: number = 10, patientId?: string): Promise<FetchSubmissionResponse> {
    console.log(`🔄 Starting polling for submission ${submissionId} with patient ID: ${patientId}`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 Polling attempt ${attempt}/${maxAttempts}`);
      
      try {
        // Get doctor_id from AsyncStorage
        const doctorId = await AsyncStorage.getItem('doctorId');
        if (!doctorId) {
          throw new Error('No doctor ID found in AsyncStorage. Please ensure you are logged in.');
        }
        
        const result = await this.fetchSubmissionById(submissionId, doctorId, patientId);
        
        // Enhanced check for complete response
        const hasTranscription = result.transcription && result.transcription.trim().length > 0;
        const hasInsights = result.insights && Object.keys(result.insights).length > 0;
        const hasConsultationId = result.data && result.data.consultation_id;
        
        // Check if transcription is ready with proper validation
        if (result.success && (hasTranscription || hasInsights || hasConsultationId)) {
          console.log(`✅ Transcription ready after ${attempt} attempts`);
          console.log(`📋 Response details:`, {
            hasTranscription,
            hasInsights,
            hasConsultationId,
            transcriptionLength: result.transcription?.length || 0,
            insightsKeys: result.insights ? Object.keys(result.insights).length : 0
          });
          return result;
        }
        
        // Log why we're continuing to poll
        console.log(`⏳ Response not complete yet:`, {
          success: result.success,
          hasTranscription,
          hasInsights,
          hasConsultationId,
          message: result.message
        });
        
        // Wait before next attempt
        if (attempt < maxAttempts) {
          console.log(`⏳ Waiting ${delaySeconds} seconds before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }
      } catch (error) {
        console.error(`❌ Polling attempt ${attempt} failed:`, error);
        
        // If it's a 500 error (like duplicate key), wait and retry
        if (error instanceof Error && error.message.includes('500')) {
          console.log(`🔄 Server error detected, will retry...`);
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            continue;
          }
        }
        
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }
    
    throw new Error(`Timeout: Transcription not ready after ${maxAttempts} attempts`);
  }

  /**
   * Convert blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data URL prefix to get just the base64 data
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Reset recorder state
   */
  reset(): void {
    this.correlationId = null;
    this.mediaRecorder = null;
    this.chunkTimer = null;
    this.chunkStartTime = null;
    this.chunkCount = 0;
    this.recordingStartTime = 0;
    this.isRecording = false;
    this.submissionId = null;
    this.isPaused = false;
    this.isCanceling = false;
    this.recordingStartTime = 0;
    this.totalRecordingDuration = 0;
    this.pauseStartTime = 0;
    this.cleanupAudio();
  }

  // Getters for state access
  get currentCorrelationId(): string | null {
    return this.correlationId;
  }

  get currentSubmissionId(): string | null {
    return this.submissionId;
  }

  get recordingState(): boolean {
    return this.isRecording;
  }

  get currentChunkCount(): number {
    return this.chunkCount;
  }

  /**
   * Wait for MediaRecorder to process and upload the current partial chunk
   */
  private waitForChunkUpload(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        resolve();
        return;
      }

      const originalHandler = this.mediaRecorder.ondataavailable;
      let chunkReceived = false;
      // Temporary handler to detect when partial chunk is processed
      const tempHandler = async (event: BlobEvent) => {
        if (!chunkReceived && event.data.size > 0) {
          chunkReceived = true;
          console.log(`📤 Partial chunk captured before pause: ${event.data.size} bytes`);
          
          try {
            // Upload the partial chunk immediately
            await this.uploadChunk(event.data, false);
            console.log('✅ Partial chunk uploaded successfully');
          } catch (error) {
            console.error('❌ Failed to upload partial chunk:', error);
          }
          
          // Restore original handler and resolve
          this.mediaRecorder!.ondataavailable = originalHandler;
          clearTimeout(timeoutId);
          resolve();
        } else {
          // Call original handler for any other chunks
          if (originalHandler && this.mediaRecorder) {
            originalHandler.call(this.mediaRecorder, event);
          }
        }
      };
      
      // Set temporary handler
      this.mediaRecorder.ondataavailable = tempHandler;
      
      // Fallback timeout (in case no chunk is generated)
      const timeoutId = setTimeout(() => {
        if (!chunkReceived) {
          console.log('⚠️ No partial chunk generated within timeout');
          this.mediaRecorder!.ondataavailable = originalHandler;
          resolve();
        }
      }, 2000); // 2 second timeout
    });
  }

  /**
   * Pause recording - upload any partial chunk first, then stop uploads
   */
  async pauseRecording(): Promise<void> {
    console.log('⏸️ Pausing recording...');
    
    // STEP 1: Force MediaRecorder to generate and upload current partial chunk
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.log('📤 Forcing partial chunk upload before pause...');
      
      // Request immediate data from MediaRecorder
      this.mediaRecorder.requestData();
      
      // Wait for the chunk to be processed and uploaded
      await this.waitForChunkUpload();
    }
    
    // STEP 2: Add current recording time to total before pausing
    if (!this.isPaused && this.recordingStartTime > 0) {
      this.totalRecordingDuration += Date.now() - this.recordingStartTime;
    }
    
    // STEP 3: Set pause state (no more uploads until resume)
    this.isPaused = true;
    this.pauseStartTime = Date.now();
    
    // STEP 4: Start 10-minute timeout for auto-cancel
    this.startPauseTimeout();
    
    console.log('✅ Recording paused - all audio preserved, chunk uploads stopped');
    console.log('⏰ 10-minute pause timeout started - recording will auto-cancel if not resumed');
  }

  /**
   * Resume recording (restart chunk uploads)
   */
  resumeRecording(): void {
    console.log('▶️ Resuming recording...');
    this.isPaused = false;
    
    // Clear pause timeout since recording is resumed
    this.clearPauseTimeout();
    
    // Reset recording start time for next segment
    this.recordingStartTime = Date.now();
    this.pauseStartTime = 0;
    
    console.log('✅ Recording resumed - chunk uploads restarted');
  }

  /**
   * Start pause timeout - auto-cancel recording after 10 minutes
   */
  private startPauseTimeout(): void {
    // Clear any existing timeout first
    this.clearPauseTimeout();
    
    this.pauseTimeoutId = setTimeout(async () => {
      console.log('⏰ Pause timeout reached (10 minutes) - auto-canceling recording...');
      
      try {
        // Auto-cancel the recording due to timeout
        await this.cancelRecording();
        
        // Notify the UI about the timeout cancellation
        // This will be handled by the UI component listening for recording state changes
        console.log('🚫 Recording automatically canceled due to 10-minute pause timeout');
        
        // You can emit a custom event here if needed for UI notification
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('pradhi-pause-timeout', {
            detail: { message: 'Recording was automatically canceled after being paused for 10 minutes' }
          }));
        }
      } catch (error) {
        console.error('❌ Failed to auto-cancel recording on pause timeout:', error);
      }
    }, this.PAUSE_TIMEOUT_MS);
    
    console.log(`⏰ Pause timeout set for ${this.PAUSE_TIMEOUT_MS / 1000 / 60} minutes`);
  }
  
  /**
   * Clear pause timeout
   */
  private clearPauseTimeout(): void {
    if (this.pauseTimeoutId) {
      clearTimeout(this.pauseTimeoutId);
      this.pauseTimeoutId = null;
      console.log('⏰ Pause timeout cleared');
    }
  }

  /**
   * Get total recording duration in seconds
   */
  getTotalRecordingDuration(): number {
    let duration = this.totalRecordingDuration;
    
    // Add current segment if recording and not paused
    if (this.isRecording && !this.isPaused && this.recordingStartTime > 0) {
      duration += Date.now() - this.recordingStartTime;
    }
    
    return Math.floor(duration / 1000); // Convert to seconds
  }

  /**
   * Check if recording has sufficient duration for Pradhi processing
   */
  hasSufficientDuration(): boolean {
    const minDurationSeconds = 30; // Minimum 30 seconds for meaningful insights
    return this.getTotalRecordingDuration() >= minDurationSeconds;
  }

  get isPausedState(): boolean {
    return this.isPaused;
  }
}

// Export singleton instance
const pradhiRecorder = new PradhiLiveRecorder();
export default pradhiRecorder;
