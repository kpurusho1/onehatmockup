import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, User, Clock, Play, Pause, Square, X, Search, Edit2, Send, ArrowLeft } from "lucide-react";
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

type FlowStep = 'select-patient' | 'recording' | 'view-record' | 'edit-record' | 'send-record';

export default function CreateRecordTab() {
  const [patients] = useState<Patient[]>([
    { id: "1", name: "John Doe", phone: "8954229999", age: 35 },
    { id: "2", name: "Jane Smith", phone: "9876543210", age: 28 },
    { id: "3", name: "Test Patient", phone: "8954229999", age: 45 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-patient');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Mock medical record data
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>({
    id: "1",
    patientId: "",
    keyFacts: "Patient is prescribed antibiotics, alpha blocker, and pain medication for kidney stone.\nFollow-up is scheduled via WhatsApp message after one week.\nCost of the procedure is estimated at 20 plus medicines.\nMedical expulsive therapy is the initial plan, with URS plus DJ stent as a backup.",
    medications: [
      {
        id: "1",
        name: "Cefixime",
        morning: 1,
        noon: 0,
        evening: 1,
        night: 0,
        duration: 7,
        timeToTake: "N/A",
        remarks: "Oral antibiotic, 200 BD, morning one, evening one, for seven days, finish a course."
      },
      {
        id: "2",
        name: "Drotin",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 3,
        timeToTake: "N/A",
        remarks: "Keep Drotin for only three days. After three days, if there is pain, then put it in, otherwise, stop it."
      },
      {
        id: "3",
        name: "Urimax 0.4",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 7,
        timeToTake: "N/A",
        remarks: "Alpha blocker. This is what will help you pass out the stone. This can be kept for seven days."
      }
    ],
    nextSteps: "Immediate Actions: Start Cefixime and Urimax for seven days and Drotin for three days if needed.",
    recordDate: new Date().toLocaleDateString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    keyFacts: true,
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

  const startRecording = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep('recording');
    setIsRecording(true);
    setRecordingDuration(0);
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
    setCurrentStep('view-record');
    setMedicalRecord(prev => ({ ...prev, patientId: selectedPatient?.id || "" }));
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setCurrentStep('select-patient');
    setSelectedPatient(null);
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
    // Handle sending logic here
    alert("Record sent successfully!");
    setCurrentStep('select-patient');
    setSelectedPatient(null);
  };

  const goBack = () => {
    if (currentStep === 'edit-record' || currentStep === 'send-record') {
      setCurrentStep('view-record');
      setIsEditing(false);
    } else if (currentStep === 'view-record') {
      setCurrentStep('select-patient');
      setSelectedPatient(null);
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
            {filteredPatients.map((patient) => (
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

  // Recording View
  if (currentStep === 'recording') {
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

  // View/Edit Record View
  if (currentStep === 'view-record' || currentStep === 'edit-record' || currentStep === 'send-record') {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl font-semibold">Complete Medical Record</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentStep === 'send-record' && (
              <span className="text-lg font-medium">Select to Send</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Key Facts Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Key Facts</h2>
                {!isEditing && (
                  <Badge variant="secondary" className="text-xs">
                    <Send size={12} className="mr-1" />
                    Sent
                  </Badge>
                )}
              </div>
              {currentStep === 'send-record' && (
                <Checkbox 
                  checked={selectedSections.keyFacts}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, keyFacts: !!checked }))
                  }
                />
              )}
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

          {/* Prescription Data Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Prescription Data</h2>
                {!isEditing && (
                  <Badge variant="secondary" className="text-xs">
                    <Send size={12} className="mr-1" />
                    Sent
                  </Badge>
                )}
              </div>
              {currentStep === 'send-record' && (
                <Checkbox 
                  checked={selectedSections.prescriptionData}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, prescriptionData: !!checked }))
                  }
                />
              )}
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-8 gap-2 p-3 bg-muted text-sm font-medium">
                <div>Medicine</div>
                <div>Morning</div>
                <div>Noon</div>
                <div>Evening</div>
                <div>Night</div>
                <div>Duration (Days)</div>
                <div>Time to Take</div>
                <div>Remarks</div>
              </div>
              
              {medicalRecord.medications.map((medication, index) => (
                <div key={medication.id} className="grid grid-cols-8 gap-2 p-3 border-t text-sm">
                  <div>
                    {isEditing ? (
                      <Input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      medication.name
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={medication.morning}
                        onChange={(e) => updateMedication(index, 'morning', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      medication.morning
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={medication.noon}
                        onChange={(e) => updateMedication(index, 'noon', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      medication.noon
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={medication.evening}
                        onChange={(e) => updateMedication(index, 'evening', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      medication.evening
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={medication.night}
                        onChange={(e) => updateMedication(index, 'night', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      medication.night
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      medication.duration
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        value={medication.timeToTake}
                        onChange={(e) => updateMedication(index, 'timeToTake', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      medication.timeToTake
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {isEditing ? (
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
                    ) : (
                      medication.remarks
                    )}
                  </div>
                </div>
              ))}
            </div>
            
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Next Steps</h2>
                {!isEditing && (
                  <Badge variant="secondary" className="text-xs">
                    <Send size={12} className="mr-1" />
                    Sent
                  </Badge>
                )}
              </div>
              {currentStep === 'send-record' && (
                <Checkbox 
                  checked={selectedSections.nextSteps}
                  onCheckedChange={(checked) => 
                    setSelectedSections(prev => ({ ...prev, nextSteps: !!checked }))
                  }
                />
              )}
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
        <div className="p-4 border-t flex justify-between">
          {currentStep === 'send-record' ? (
            <>
              <Button variant="outline">
                Advanced Sending Options
              </Button>
              <Button onClick={sendRecord} className="flex items-center gap-2">
                <Send size={16} />
                Send Record
              </Button>
            </>
          ) : isEditing ? (
            <>
              <div></div>
              <Button onClick={saveChanges} className="flex items-center gap-2">
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                <Edit2 size={16} />
                Edit
              </Button>
              <Button onClick={goToSendRecord} className="flex items-center gap-2">
                <Send size={16} />
                Send Record
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}