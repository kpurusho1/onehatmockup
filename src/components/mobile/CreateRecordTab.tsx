import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Clock, Play, Pause, Square, X, Search, Edit2, Send, ArrowLeft, Eye, Loader2 } from "lucide-react";
import { AddPatientDialog } from "@/components/AddPatientDialog";

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
    { id: "1", name: "John Doe", phone: "8954229999", age: 35 },
    { id: "2", name: "Jane Smith", phone: "9876543210", age: 28 },
    { id: "3", name: "Robert Johnson", phone: "8754321098", age: 45 },
    { id: "4", name: "Emily Davis", phone: "9123456789", age: 32 },
    { id: "5", name: "Michael Brown", phone: "8765432109", age: 58 },
    { id: "6", name: "Sarah Wilson", phone: "9234567890", age: 29 },
    { id: "7", name: "David Miller", phone: "8654321987", age: 42 },
    { id: "8", name: "Lisa Garcia", phone: "9345678901", age: 36 },
    { id: "9", name: "Thomas Anderson", phone: "8543219876", age: 51 },
    { id: "10", name: "Maria Rodriguez", phone: "9456789012", age: 27 },
    { id: "11", name: "James Taylor", phone: "8432198765", age: 39 },
    { id: "12", name: "Jennifer Lee", phone: "9567890123", age: 44 },
    { id: "13", name: "Christopher White", phone: "8321987654", age: 33 },
    { id: "14", name: "Amanda Clark", phone: "9678901234", age: 26 },
    { id: "15", name: "Daniel Harris", phone: "8210987643", age: 48 }
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
    setMedicalRecord(prev => ({ ...prev, patientId: selectedPatient?.id || "" }));
    
    // Simulate processing time
    setTimeout(() => {
      setCurrentStep('view-record');
    }, 3000);
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
      medications: []
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
      <div className="relative h-full pb-32">
        <div className="p-4 space-y-4 h-full">
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Patient to Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              <RadioGroup value={selectedPatientId} onValueChange={setSelectedPatientId}>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedPatientId(patient.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <RadioGroupItem value={patient.id} id={patient.id} />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{patient.name}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{patient.age} yrs</span>
                        </div>
                        <span className="text-sm text-muted-foreground/70 italic ml-auto">{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Record Button */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t z-40">
          <Button 
            onClick={startRecording}
            disabled={!selectedPatientId}
            className={`w-full h-12 text-lg font-semibold ${
              selectedPatientId 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Record
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
      <div className="flex flex-col h-full pb-24 items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold">Processing...</h2>
          <p className="text-muted-foreground">
            Analyzing your recording and generating medical summary
          </p>
        </div>
      </div>
    );
  }
  // View/Edit Record View
  if (currentStep === 'view-record' || currentStep === 'edit-record' || currentStep === 'send-record') {
    return (
      <div className="flex flex-col h-full pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl font-semibold">Medical Summary</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentStep === 'view-record' && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Key Facts Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Key Facts</h2>
              <Checkbox 
                checked={selectedSections.keyFacts}
                onCheckedChange={(checked) => 
                  setSelectedSections(prev => ({ ...prev, keyFacts: !!checked }))
                }
              />
            </div>
            {isEditing ? (
              <Textarea
                value={medicalRecord.keyFacts}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, keyFacts: e.target.value }))}
                className="min-h-[120px]"
                placeholder="Enter key facts..."
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-line">{medicalRecord.keyFacts}</p>
              </div>
            )}
          </div>

          {/* Diagnosis Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Diagnosis</h2>
              <Checkbox 
                checked={selectedSections.diagnosis}
                onCheckedChange={(checked) => 
                  setSelectedSections(prev => ({ ...prev, diagnosis: !!checked }))
                }
              />
            </div>
            {isEditing ? (
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">{diagnosis}</p>
              </div>
            )}
          </div>

          {/* Prescription Data Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Prescription</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createNewRx}
                  className="text-xs"
                >
                  <Plus size={12} className="mr-1" />
                  Create Rx
                </Button>
              </div>
              <Checkbox 
                checked={selectedSections.prescriptionData}
                onCheckedChange={(checked) => 
                  setSelectedSections(prev => ({ ...prev, prescriptionData: !!checked }))
                }
              />
            </div>
            
            {isEditing ? (
              // Table format for editing
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 gap-2 p-3 bg-muted text-sm font-medium">
                  <div>Medicine</div>
                  <div>Morning</div>
                  <div>Noon</div>
                  <div>Evening</div>
                  <div>Night</div>
                  <div>Duration</div>
                  <div>Time</div>
                  <div>Remarks</div>
                </div>
                
                {medicalRecord.medications.map((medication, index) => (
                  <div key={medication.id} className="grid grid-cols-8 gap-2 p-3 border-t text-sm">
                    <div>
                      <Input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={medication.morning}
                        onChange={(e) => updateMedication(index, 'morning', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={medication.noon}
                        onChange={(e) => updateMedication(index, 'noon', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={medication.evening}
                        onChange={(e) => updateMedication(index, 'evening', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={medication.night}
                        onChange={(e) => updateMedication(index, 'night', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Input
                        value={medication.timeToTake}
                        onChange={(e) => updateMedication(index, 'timeToTake', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        value={medication.remarks}
                        onChange={(e) => updateMedication(index, 'remarks', e.target.value)}
                        className="h-8 flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Card format for viewing with eye button for remarks
              <div className="space-y-3">
                {medicalRecord.medications.map((medication, index) => (
                  <div key={medication.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{medication.name}</h3>
                      <Badge variant="outline">{medication.duration} days</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Morning:</span> {medication.morning}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Noon:</span> {medication.noon}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Evening:</span> {medication.evening}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Night:</span> {medication.night}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Time to take:</span> {medication.timeToTake}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Remarks:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRemarks(medication.remarks);
                          setShowRemarksDialog(true);
                        }}
                      >
                        <Eye size={16} />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isEditing && (
              <Button onClick={addMedication} variant="outline" className="w-full">
                <Plus size={16} className="mr-2" />
                Add Medication
              </Button>
            )}
          </div>

          {/* Next Steps Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Next Steps</h2>
              <Checkbox 
                checked={selectedSections.nextSteps}
                onCheckedChange={(checked) => 
                  setSelectedSections(prev => ({ ...prev, nextSteps: !!checked }))
                }
              />
            </div>
            {isEditing ? (
              <Textarea
                value={medicalRecord.nextSteps}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, nextSteps: e.target.value }))}
                className="min-h-[100px]"
                placeholder="Enter next steps..."
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-line">{medicalRecord.nextSteps}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('view-record')} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveChanges} className="flex-1">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={saveRecord}
                className="flex-1"
              >
                Save
              </Button>
              <Button 
                onClick={sendRecord}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Send size={16} className="mr-1" />
                Send
              </Button>
            </div>
          )}
        </div>

        {/* Remarks Dialog */}
        <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Medication Remarks</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="whitespace-pre-line">{selectedRemarks}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}