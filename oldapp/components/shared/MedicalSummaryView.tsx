import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit2, 
  Send, 
  Save,
  Plus,
  X,
  Eye,
  ArrowLeft,
  FileText,
  Pill,
  CheckCircle2
} from "lucide-react";

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

interface MedicalSummaryViewProps {
  medicalRecord: MedicalRecord;
  diagnosis: string;
  onBack: () => void;
  onSave?: (record: MedicalRecord) => void;
  onSend?: (record: MedicalRecord, selectedSections: any) => void;
  patientName?: string;
  recordId?: string;
  date?: string;
  isEditable?: boolean;
  showCreateRx?: boolean;
}

export default function MedicalSummaryView({
  medicalRecord: initialRecord,
  diagnosis: initialDiagnosis,
  onBack,
  onSave,
  onSend,
  patientName,
  recordId,
  date,
  isEditable = true,
  showCreateRx = true
}: MedicalSummaryViewProps) {
  const { toast } = useToast();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>(initialRecord);
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    keyFacts: true,
    diagnosis: true,
    prescriptionData: true,
    nextSteps: true
  });
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState("");

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(medicalRecord);
    } else {
      toast({
        title: "Record saved!",
        description: "The medical record has been saved successfully.",
      });
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend(medicalRecord, selectedSections);
    } else {
      toast({
        title: "Records sent successfully!",
        description: `The medical record has been sent to ${patientName || 'the patient'}.`,
      });
    }
  };

  return (
    <div className="relative pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Header */}
        {patientName && (
          <div className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1c2f7f' }}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patientName}</h2>
                {recordId && <p className="text-white/80">Record ID: {recordId}</p>}
                {date && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white/80">{date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medical Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Medical Summary</CardTitle>
              {isEditable && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 size={16} className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Facts */}
            <div className="relative">
              <div 
                className={`flex items-center justify-between cursor-pointer ${!selectedSections.keyFacts ? 'opacity-50' : ''}`}
                onClick={() => handleSectionToggle('keyFacts')}
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <FileText size={20} className="mr-2 text-primary" />
                  Key Facts
                  {!selectedSections.keyFacts && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
                </h3>
                <Checkbox 
                  checked={selectedSections.keyFacts}
                  onCheckedChange={() => handleSectionToggle('keyFacts')}
                />
              </div>
              {isEditing ? (
                <Textarea
                  value={medicalRecord.keyFacts}
                  onChange={(e) => setMedicalRecord(prev => ({ ...prev, keyFacts: e.target.value }))}
                  className="min-h-[100px] text-sm"
                  placeholder="Enter key facts..."
                />
              ) : (
                <div className={`${!selectedSections.keyFacts ? 'opacity-50' : ''}`}>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {medicalRecord.keyFacts}
                  </p>
                </div>
              )}
            </div>

            {/* Diagnosis */}
            <div className="relative">
              <div 
                className={`flex items-center justify-between cursor-pointer ${!selectedSections.diagnosis ? 'opacity-50' : ''}`}
                onClick={() => handleSectionToggle('diagnosis')}
              >
                <h3 className="font-semibold text-lg mb-3">
                  Diagnosis
                  {!selectedSections.diagnosis && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
                </h3>
                <Checkbox 
                  checked={selectedSections.diagnosis}
                  onCheckedChange={() => handleSectionToggle('diagnosis')}
                />
              </div>
              {isEditing ? (
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="Enter diagnosis..."
                />
              ) : (
                <p className={`text-sm text-muted-foreground ${!selectedSections.diagnosis ? 'opacity-50' : ''}`}>
                  {diagnosis}
                </p>
              )}
            </div>

            {/* Prescription */}
            <div className="relative">
              <div 
                className={`flex items-center justify-between cursor-pointer ${!selectedSections.prescriptionData ? 'opacity-50' : ''}`}
                onClick={() => handleSectionToggle('prescriptionData')}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Pill size={20} className="mr-2 text-primary" />
                    Prescription
                    {!selectedSections.prescriptionData && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
                  </h3>
                  {showCreateRx && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        createNewRx();
                      }}
                      className="text-xs h-7"
                    >
                      <Plus size={12} className="mr-1" />
                      Create Rx
                    </Button>
                  )}
                </div>
                <Checkbox 
                  checked={selectedSections.prescriptionData}
                  onCheckedChange={() => handleSectionToggle('prescriptionData')}
                />
              </div>
              
              {isEditing ? (
                <div className="space-y-6">
                  {medicalRecord.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
                      {/* Medicine Name */}
                      <div>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          placeholder="Enter medicine name"
                          className="text-lg font-medium bg-white"
                        />
                      </div>

                      {/* Dosage Grid */}
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Morning</label>
                          <Input
                            type="number"
                            value={medication.morning}
                            onChange={(e) => updateMedication(index, 'morning', parseInt(e.target.value) || 0)}
                            className="text-center text-lg font-medium bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Noon</label>
                          <Input
                            type="number"
                            value={medication.noon}
                            onChange={(e) => updateMedication(index, 'noon', parseInt(e.target.value) || 0)}
                            className="text-center text-lg font-medium bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Evening</label>
                          <Input
                            type="number"
                            value={medication.evening}
                            onChange={(e) => updateMedication(index, 'evening', parseInt(e.target.value) || 0)}
                            className="text-center text-lg font-medium bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Night</label>
                          <Input
                            type="number"
                            value={medication.night}
                            onChange={(e) => updateMedication(index, 'night', parseInt(e.target.value) || 0)}
                            className="text-center text-lg font-medium bg-white"
                          />
                        </div>
                      </div>

                      {/* Duration and Time to take */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
                          <Input
                            type="number"
                            value={medication.duration}
                            onChange={(e) => updateMedication(index, 'duration', parseInt(e.target.value) || 0)}
                            className="bg-white"
                            placeholder="Days"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Time to take</label>
                          <Input
                            value={medication.timeToTake}
                            onChange={(e) => updateMedication(index, 'timeToTake', e.target.value)}
                            className="bg-white"
                            placeholder="e.g., After meals"
                          />
                        </div>
                      </div>

                      {/* Remarks */}
                      <div>
                        <Textarea
                          value={medication.remarks}
                          onChange={(e) => updateMedication(index, 'remarks', e.target.value)}
                          className="bg-white min-h-[100px] text-sm"
                          placeholder="Additional instructions or remarks..."
                        />
                      </div>
                      
                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addMedication} variant="outline" className="w-full">
                    <Plus size={16} className="mr-2" />
                    Add Medication
                  </Button>
                </div>
              ) : (
                <div className={`space-y-6 ${!selectedSections.prescriptionData ? 'opacity-50' : ''}`}>
                  {medicalRecord.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      {/* Medicine Header */}
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">{medication.name}</h4>
                      </div>
                      
                      {/* Dosage Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">Morning</div>
                          <div className="text-2xl font-bold text-gray-800 bg-white rounded-lg py-2 border">
                            {medication.morning}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">Noon</div>
                          <div className="text-2xl font-bold text-gray-800 bg-white rounded-lg py-2 border">
                            {medication.noon}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">Evening</div>
                          <div className="text-2xl font-bold text-gray-800 bg-white rounded-lg py-2 border">
                            {medication.evening}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">Night</div>
                          <div className="text-2xl font-bold text-gray-800 bg-white rounded-lg py-2 border">
                            {medication.night}
                          </div>
                        </div>
                      </div>

                      {/* Duration and Time */}
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span><strong>Duration:</strong> {medication.duration} days</span>
                        <span><strong>Time:</strong> {medication.timeToTake}</span>
                      </div>

                      {/* Remarks with view button */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Remarks:</span>
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
            </div>

            {/* Next Steps */}
            <div className="relative">
              <div 
                className={`flex items-center justify-between cursor-pointer ${!selectedSections.nextSteps ? 'opacity-50' : ''}`}
                onClick={() => handleSectionToggle('nextSteps')}
              >
                <h3 className="font-semibold text-lg mb-3">
                  Next Steps
                  {!selectedSections.nextSteps && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
                </h3>
                <Checkbox 
                  checked={selectedSections.nextSteps}
                  onCheckedChange={() => handleSectionToggle('nextSteps')}
                />
              </div>
              {isEditing ? (
                <Textarea
                  value={medicalRecord.nextSteps}
                  onChange={(e) => setMedicalRecord(prev => ({ ...prev, nextSteps: e.target.value }))}
                  className="min-h-[100px] text-sm"
                  placeholder="Enter next steps..."
                />
              ) : (
                <div className={`${!selectedSections.nextSteps ? 'opacity-50' : ''}`}>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {medicalRecord.nextSteps}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleSave} className="flex-1">
                <Save size={16} className="mr-1" />
                Save
              </Button>
              <Button onClick={handleSend} className="flex-1">
                <Send size={16} className="mr-1" />
                Send
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Remarks Dialog */}
      <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medication Remarks</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="whitespace-pre-line text-sm">{selectedRemarks}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}