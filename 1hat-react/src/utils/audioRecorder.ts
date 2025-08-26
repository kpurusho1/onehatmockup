import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
// expo-permissions is deprecated, using Audio.requestPermissionsAsync instead

class AudioRecorderService {
  private recording: Audio.Recording | null = null;
  private isRecording: boolean = false;
  private recordingUri: string = '';
  private chunkNumber: number = 0;

  constructor() {
    // Initialize audio mode
    this.configureAudio();
  }

  private async configureAudio() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: 1, // DO_NOT_MIX
      interruptionModeAndroid: 1, // DO_NOT_MIX
    });
  }

  // Request microphone permission
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  }

  // Start recording
  async startRecording(onProgress?: (e: any) => void): Promise<string> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('No permission to record audio');
    }

    // Reset chunk counter
    this.chunkNumber = 0;
    
    try {
      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: 1, // DO_NOT_MIX
        interruptionModeAndroid: 1, // DO_NOT_MIX
      });
      
      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      
      // Set up progress updates if needed
      if (onProgress) {
        recording.setProgressUpdateInterval(500); // Update every 500ms
        recording.setOnRecordingStatusUpdate((status) => {
          if (status.isRecording) {
            onProgress({
              currentPosition: status.durationMillis,
              currentMetering: 0, // Expo doesn't provide metering
            });
          }
        });
      }
      
      await recording.startAsync();
      this.recording = recording;
      this.isRecording = true;
      
      // Return a placeholder for the recording path
      // We'll get the actual URI when stopping
      return 'recording_started';
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  // Stop recording
  async stopRecording(): Promise<string> {
    if (!this.isRecording || !this.recording) {
      throw new Error('Not recording');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI() || '';
      this.recordingUri = uri;
      this.isRecording = false;
      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  // Get current audio chunk as base64
  async getCurrentChunkAsBase64(): Promise<{ base64Data: string, chunkNumber: number }> {
    if (!this.recordingUri) {
      throw new Error('No recording URI available');
    }

    try {
      // Read the file as base64
      const base64Data = await FileSystem.readAsStringAsync(this.recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const currentChunk = this.chunkNumber;
      this.chunkNumber += 1;
      
      return { 
        base64Data,
        chunkNumber: currentChunk
      };
    } catch (error) {
      console.error('Error getting audio chunk:', error);
      throw error;
    }
  }

  // Clean up recording file
  async cleanUp(): Promise<void> {
    if (this.recordingUri) {
      try {
        const info = await FileSystem.getInfoAsync(this.recordingUri);
        if (info.exists) {
          await FileSystem.deleteAsync(this.recordingUri);
        }
      } catch (error) {
        console.error('Error cleaning up recording file:', error);
      }
    }
  }
}

export default new AudioRecorderService();
