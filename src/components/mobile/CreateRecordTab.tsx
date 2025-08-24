import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Clock, Play, Pause, Square, X } from "lucide-react";
import { AddPatientDialog } from "@/components/AddPatientDialog";

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
}

interface Recording {
  isRecording: boolean;
  duration: number;
  patientId: string | null;
}

export default function CreateRecordTab() {
  const [patients] = useState<Patient[]>([
    { id: "1", name: "John Doe", phone: "8954229999", age: 35 },
    { id: "2", name: "Jane Smith", phone: "9876543210", age: 28 },
    { id: "3", name: "Test Patient", phone: "8954229999", age: 45 },
  ]);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [recording, setRecording] = useState<Recording>({
    isRecording: false,
    duration: 0,
    patientId: null
  });

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording.isRecording) {
      interval = setInterval(() => {
        setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording.isRecording]);

  const startRecording = (patient: Patient) => {
    setRecording({
      isRecording: true,
      duration: 0,
      patientId: patient.id
    });
    setSelectedPatient(patient);
  };

  const pauseRecording = () => {
    setRecording(prev => ({ ...prev, isRecording: false }));
  };

  const resumeRecording = () => {
    setRecording(prev => ({ ...prev, isRecording: true }));
  };

  const stopRecording = () => {
    // Here you would save the recording and navigate to view/edit
    setRecording({ isRecording: false, duration: 0, patientId: null });
    setSelectedPatient(null);
  };

  const cancelRecording = () => {
    setRecording({ isRecording: false, duration: 0, patientId: null });
    setSelectedPatient(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Recording in progress view
  if (recording.patientId && selectedPatient) {
    return (
      <div className="flex flex-col h-full">
        {/* Patient Info Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                <p className="text-sm opacity-90">ID: #{selectedPatient.id} • Age: {selectedPatient.age} years • {selectedPatient.phone}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelRecording}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel Recording
            </Button>
          </div>
        </div>

        {/* Recording Status */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Recording in Progress</span>
            </div>
            <span className="text-sm text-red-600">You can browse previous records while recording</span>
          </div>
        </div>

        {/* Timer and Controls */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">
              {formatTime(recording.duration)}
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span>Recording Duration</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {recording.isRecording ? (
              <Button 
                onClick={pauseRecording}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200"
              >
                <Pause size={20} />
                Pause
              </Button>
            ) : (
              <Button 
                onClick={resumeRecording}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
              >
                <Play size={20} />
                Resume
              </Button>
            )}

            <Button 
              onClick={stopRecording}
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Square size={20} />
              Stop & Submit
            </Button>

            <Button 
              onClick={cancelRecording}
              variant="destructive"
              size="lg"
              className="flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Patient selection view
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Record</h2>
        <Button 
          onClick={() => setShowAddPatient(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Patient to Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => startRecording(patient)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Age: {patient.age} • {patient.phone}
                  </p>
                </div>
              </div>
              <Badge variant="outline">Select</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <AddPatientDialog 
        open={showAddPatient}
        onOpenChange={setShowAddPatient}
      />
    </div>
  );
}