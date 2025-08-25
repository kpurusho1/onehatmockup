import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Clock, Play, Pause, Square, X, Search, Edit2, Send, ArrowLeft, Eye, Loader2, Mic } from "lucide-react";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import MedicalSummaryView from "@/components/shared/MedicalSummaryView";

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
}

interface Medication {
  id: string;
  name: string;
  morning: number;
  noon: number;
  evening: number;
  night: number;
  duration: number;
  timeToTake: string;
  remarks: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  keyFacts: string;
  medications: Medication[];
  nextSteps: string;
  recordDate: string;
}

type FlowStep = 'select-patient' | 'recording' | 'processing' | 'view-record' | 'edit-record' | 'send-record';

export default function CreateRecordTab() {
  const { toast } = useToast();
  const [patients] = useState<Patient[]>([
    { id: "1", name: "Arjun Sharma", phone: "+91 98765 43210", age: 32 },
    { id: "2", name: "Priya Patel", phone: "+91 87654 32109", age: 28 },
    { id: "3", name: "Vikram Singh", phone: "+91 76543 21098", age: 45 },
    { id: "4", name: "Deepika Reddy", phone: "+91 65432 10987", age: 35 },
    { id: "5", name: "Rohit Kumar", phone: "+91 54321 09876", age: 29 },
    { id: "6", name: "Ananya Gupta", phone: "+91 43210 98765", age: 31 },
    { id: "7", name: "Karthik Iyer", phone: "+91 32109 87654", age: 38 },
    { id: "8", name: "Sneha Nair", phone: "+91 21098 76543", age: 26 },
    { id: "9", name: "Aditya Joshi", phone: "+91 10987 65432", age: 42 },
    { id: "10", name: "Kavya Menon", phone: "+91 09876 54321", age: 33 },
    { id: "11", name: "Rajesh Verma", phone: "+91 98765 43211", age: 41 },
    { id: "12", name: "Meera Agarwal", phone: "+91 87654 32108", age: 27 },
    { id: "13", name: "Suresh Pillai", phone: "+91 76543 21097", age: 47 },
    { id: "14", name: "Pooja Bansal", phone: "+91 65432 10986", age: 30 },
    { id: "15", name: "Manoj Rao", phone: "+91 54321 09875", age: 39 }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-patient');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Mock medical record data
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>({
    id: "1",
    patientId: "",
    keyFacts: "Patient presents with symptoms consistent with kidney stone. Experiencing severe flank pain, nausea, and difficulty urinating. Physical examination reveals tenderness in the right costovertebral angle.",
    medications: [
      {
        id: "1",
        name: "Cefixime",
        morning: 1,
        noon: 0,
        evening: 1,
        night: 0,
        duration: 7,
        timeToTake: "After meals",
        remarks: "Oral antibiotic, 200mg BD, morning one, evening one, for seven days, finish a course. Important to complete full course even if symptoms improve."
      },
      {
        id: "2",
        name: "Drotin",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 3,
        timeToTake: "As needed",
        remarks: "Keep Drotin for only three days. After three days, if there is pain, then put it in, otherwise, stop it. Take only when experiencing severe pain."
      },
      {
        id: "3",
        name: "Urimax 0.4",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 7,
        timeToTake: "Before bedtime",
        remarks: "Alpha blocker. This is what will help you pass out the stone. This can be kept for seven days. Take consistently at the same time each day."
      }
    ],
    nextSteps: "Schedule follow-up appointment in one week. Increase fluid intake to 3-4 liters per day. Return immediately if symptoms worsen or fever develops.",
    recordDate: new Date().toLocaleDateString()
  });

  const [diagnosis, setDiagnosis] = useState("Nephrolithiasis (Kidney Stone) - Right Side");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    keyFacts: true,
    diagnosis: true,
    prescriptionData: true,
    nextSteps: true
  });

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const startRecording = () => {
    const patient = patients.find(p => p.id === selectedPatientId);
    if (patient) {
      setSelectedPatient(patient);
      setCurrentStep('recording');
      setIsRecording(true);
      setRecordingDuration(0);
    }
  };

  const pauseRecording = () => {
    setIsPaused(true);
  };

  const resumeRecording = () => {
    setIsPaused(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentStep('processing');
    setProcessingProgress(0);
    setMedicalRecord(prev => ({ ...prev, patientId: selectedPatient?.id || "" }));
    
    let hasNavigatedAway = false;
    
    // Simulate processing with progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        // Check if user has navigated away from processing
        if (currentStep !== 'processing') {
          hasNavigatedAway = true;
        }
        
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Only show summary if user is still on processing screen
          if (!hasNavigatedAway && currentStep === 'processing') {
            setCurrentStep('view-record');
          } else {
            // If user navigated away, just send notification
            toast({
              title: "Recording processed",
              description: "Your consultation summary is ready for review.",
            });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setCurrentStep('select-patient');
    setSelectedPatient(null);
    setSelectedPatientId("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setCurrentStep('edit-record');
  };

  const saveChanges = () => {
    setIsEditing(false);
    setCurrentStep('view-record');
  };

  const goToSendRecord = () => {
    setCurrentStep('send-record');
  };

  const sendRecord = () => {
    toast({
      title: "Records sent successfully!",
      description: "The medical record has been sent to the patient.",
    });
    setCurrentStep('select-patient');
    setSelectedPatient(null);
    setSelectedPatientId("");
  };

  const saveRecord = () => {
    toast({
      title: "Record saved!",
      description: "The medical record has been saved successfully.",
    });
  };

  const createNewRx = () => {
    setMedicalRecord(prev => ({
      ...prev,
      medications: [{
        id: Date.now().toString(),
        name: "",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 0,
        timeToTake: "N/A",
        remarks: ""
      }]
    }));
    setIsEditing(true);
    setCurrentStep('edit-record');
  };

  const goBack = () => {
    if (currentStep === 'edit-record' || currentStep === 'send-record') {
      setCurrentStep('view-record');
      setIsEditing(false);
    } else if (currentStep === 'view-record') {
      setCurrentStep('select-patient');
      setSelectedPatient(null);
      setSelectedPatientId("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    setMedicalRecord(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: "",
      morning: 0,
      noon: 0,
      evening: 0,
      night: 0,
      duration: 0,
      timeToTake: "N/A",
      remarks: ""
    };
    setMedicalRecord(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

  const removeMedication = (index: number) => {
    setMedicalRecord(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  // Patient Selection View
  if (currentStep === 'select-patient') {
    return (
      <div className="relative h-full">
        <div className="p-4 space-y-4 h-full pb-32">
          <div className={`flex items-center justify-between transition-all ${selectedPatientId ? 'opacity-30 pointer-events-none' : ''}`}>
            <h2 className="text-2xl font-bold">Create Record</h2>
            <Button 
              onClick={() => setShowAddPatient(true)}
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: '#1c2f7f' }}
            >
              <Plus size={16} />
              Add Patient
            </Button>
          </div>

          {/* Search */}
          <div className={`relative transition-all ${selectedPatientId ? 'opacity-30 pointer-events-none' : ''}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`relative flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                  selectedPatientId === patient.id 
                    ? 'border-primary bg-primary/5 z-10' 
                    : selectedPatientId 
                      ? 'opacity-30 pointer-events-none'
                      : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                {/* Selection Overlay */}
                {selectedPatientId === patient.id && (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg border-2 border-primary"></div>
                )}
                
                <Avatar className="w-6 h-6 mr-2 z-10 flex-shrink-0">
                  <AvatarImage src={`/src/assets/patient-avatar-${Math.floor(Math.random() * 3) + 1}.jpg`} />
                  <AvatarFallback className="text-xs">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center justify-between z-10 min-w-0">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="font-medium text-foreground text-sm truncate">{patient.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{patient.age}y</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{patient.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Recording Button - Fixed at Bottom */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t z-50">
          <Button 
            onClick={startRecording}
            disabled={!selectedPatientId}
            className={`w-full h-12 text-lg font-semibold transition-all ${
              selectedPatientId 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Mic size={20} className="mr-2" />
            Start Recording
          </Button>
        </div>

        <AddPatientDialog 
          open={showAddPatient}
          onOpenChange={setShowAddPatient}
        />
      </div>
    );
  }

  // Recording View
  if (currentStep === 'recording') {
    return (
      <div className="flex flex-col h-full pb-24">
        {/* Back Button */}
        <div className="p-4">
          <Button variant="ghost" onClick={() => setCurrentStep('select-patient')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Patient Selection
          </Button>
        </div>
        {/* Patient Info Header */}
        <div className="text-white p-4" style={{ backgroundColor: '#1c2f7f' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedPatient?.name}</h2>
                <p className="text-sm opacity-90">ID: #{selectedPatient?.id} • Age: {selectedPatient?.age} years • {selectedPatient?.phone}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelRecording}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Recording Status */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">
                {isPaused ? "Recording Paused" : "Recording in Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Timer and Controls */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">
              {formatTime(recordingDuration)}
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span>Recording Duration</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isPaused ? (
              <Button 
                onClick={pauseRecording}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Pause size={20} />
                Pause
              </Button>
            ) : (
              <Button 
                onClick={resumeRecording}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Play size={20} />
                Resume
              </Button>
            )}

            <Button 
              onClick={stopRecording}
              size="lg"
              className="flex items-center gap-2"
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

  // Processing View
  if (currentStep === 'processing') {
    return (
      <div className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        {/* Header */}
        <div className="text-white p-4" style={{ backgroundColor: '#1c2f7f' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 bg-white/20">
                <AvatarFallback className="text-white bg-transparent">
                  {selectedPatient?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">Patient ({selectedPatient?.name})</h2>
                <p className="text-sm opacity-90">ID: #{selectedPatient?.id.padStart(6, '0')} • Age: {selectedPatient?.age} years • {selectedPatient?.phone}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        </div>

        {/* Processing Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-primary">1hat AI is analyzing</h3>
              <p className="text-muted-foreground text-lg">
                This may take about 30-45 seconds. We will notify you once the record is ready for review.
              </p>
            </div>
            
            <div className="space-y-3">
              <Progress value={processingProgress} className="w-full max-w-sm mx-auto h-4" />
              <p className="text-sm text-muted-foreground">
                {processingProgress}% Complete
              </p>
            </div>
          </div>

          <div className="w-full max-w-md space-y-4">
            <Button 
              size="lg" 
              className="w-full h-16 text-lg text-white"
              style={{ backgroundColor: '#1c2f7f' }}
              onClick={() => {
                setCurrentStep('select-patient');
                setSelectedPatient(null);
                setSelectedPatientId("");
                setRecordingDuration(0);
              }}
            >
              Create New Recording
            </Button>
          </div>
        </div>
      </div>
    );
  }
  // View/Edit Record View
  if (currentStep === 'view-record' || currentStep === 'edit-record' || currentStep === 'send-record') {
    return (
      <MedicalSummaryView
        medicalRecord={medicalRecord}
        diagnosis={diagnosis}
        onBack={goBack}
        onSave={(record) => {
          setMedicalRecord(record);
          saveRecord();
        }}
        onSend={(record, sections) => {
          setMedicalRecord(record);
          setSelectedSections(sections);
          sendRecord();
        }}
        patientName={selectedPatient?.name}
        date={medicalRecord.recordDate}
        isEditable={true}
        showCreateRx={true}
      />
    );
  }

  return null;
}