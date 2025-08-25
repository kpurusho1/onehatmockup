import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  Send, 
  Save,
  User,
  Pill,
  FileText,
  CheckCircle2
} from "lucide-react";

interface NotificationRecordViewProps {
  patientName: string;
  recordId: string;
  onBack: () => void;
}

export default function NotificationRecordView({ patientName, recordId, onBack }: NotificationRecordViewProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    keyFacts: true,
    diagnosis: true,
    prescription: true,
    nextSteps: true
  });

  // Mock data for the medical record
  const [mockRecord, setMockRecord] = useState({
    id: recordId,
    patientName,
    date: "25 Aug 2025",
    keyFacts: [
      "Patient reports persistent headaches for the past 2 weeks",
      "Pain is described as throbbing, located in the frontal region", 
      "Associated with mild nausea and sensitivity to light",
      "No fever or recent trauma reported"
    ],
    diagnosis: "Primary headache disorder, likely tension-type headache with possible migraine features. Recommend neurological evaluation if symptoms persist.",
    medications: [
      {
        id: "1",
        name: "Ibuprofen",
        dosage: "400mg",
        duration: "5 days",
        remarks: "Take with food to prevent stomach upset"
      },
      {
        id: "2",
        name: "Paracetamol", 
        dosage: "500mg",
        duration: "7 days",
        remarks: "Can be taken every 6 hours if needed"
      }
    ],
    nextSteps: [
      "Follow up in 1 week if symptoms persist",
      "Maintain headache diary to track triggers",
      "Ensure adequate sleep and hydration",
      "Consider stress management techniques"
    ]
  });

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    toast({
      title: "Record saved!",
      description: "The medical record has been saved successfully.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Records sent successfully!",
      description: `The medical record has been sent to ${patientName}.`,
    });
  };

  return (
    <div className="relative pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Notifications
          </Button>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 size={14} className="mr-1" />
            Ready for Review
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Header */}
        <div className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1c2f7f' }}>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-white/20 text-white">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{patientName}</h2>
              <p className="text-white/80">Record ID: {recordId}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar size={16} />
                <span className="text-white/80">{mockRecord.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Medical Summary</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit size={16} className="mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Facts */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="keyFacts"
                  checked={selectedSections.keyFacts}
                  onCheckedChange={() => handleSectionToggle('keyFacts')}
                />
              </div>
              <h3 className={`font-semibold text-lg mb-3 flex items-center ${!selectedSections.keyFacts ? 'opacity-50' : ''}`}>
                <FileText size={20} className="mr-2 text-primary" />
                Key Facts
                {!selectedSections.keyFacts && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
              </h3>
              {isEditing ? (
                <textarea
                  className="w-full p-3 border rounded-lg min-h-[100px] text-sm"
                  value={mockRecord.keyFacts.join('\n')}
                  onChange={(e) => setMockRecord(prev => ({
                    ...prev,
                    keyFacts: e.target.value.split('\n').filter(fact => fact.trim())
                  }))}
                  placeholder="Enter key facts..."
                />
              ) : (
                <ul className={`space-y-2 ${!selectedSections.keyFacts ? 'opacity-50' : ''}`}>
                  {mockRecord.keyFacts.map((fact, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {fact}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Diagnosis */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="diagnosis"
                  checked={selectedSections.diagnosis}
                  onCheckedChange={() => handleSectionToggle('diagnosis')}
                />
              </div>
              <h3 className={`font-semibold text-lg mb-3 ${!selectedSections.diagnosis ? 'opacity-50' : ''}`}>
                Diagnosis
                {!selectedSections.diagnosis && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
              </h3>
              {isEditing ? (
                <textarea
                  className="w-full p-3 border rounded-lg min-h-[80px] text-sm"
                  value={mockRecord.diagnosis}
                  onChange={(e) => setMockRecord(prev => ({
                    ...prev,
                    diagnosis: e.target.value
                  }))}
                  placeholder="Enter diagnosis..."
                />
              ) : (
                <p className={`text-sm text-muted-foreground ${!selectedSections.diagnosis ? 'opacity-50' : ''}`}>{mockRecord.diagnosis}</p>
              )}
            </div>

            {/* Prescription */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="prescription"
                  checked={selectedSections.prescription}
                  onCheckedChange={() => handleSectionToggle('prescription')}
                />
              </div>
              <h3 className={`font-semibold text-lg mb-3 flex items-center ${!selectedSections.prescription ? 'opacity-50' : ''}`}>
                <Pill size={20} className="mr-2 text-primary" />
                Prescription
                {!selectedSections.prescription && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  {mockRecord.medications.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <input
                        type="text"
                        className="w-full p-2 border rounded text-sm font-medium"
                        value={medication.name}
                        onChange={(e) => setMockRecord(prev => ({
                          ...prev,
                          medications: prev.medications.map((med, i) => 
                            i === index ? { ...med, name: e.target.value } : med
                          )
                        }))}
                        placeholder="Medication name"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          className="p-2 border rounded text-sm"
                          value={medication.dosage}
                          onChange={(e) => setMockRecord(prev => ({
                            ...prev,
                            medications: prev.medications.map((med, i) => 
                              i === index ? { ...med, dosage: e.target.value } : med
                            )
                          }))}
                          placeholder="Dosage"
                        />
                        <input
                          type="text"
                          className="p-2 border rounded text-sm"
                          value={medication.duration}
                          onChange={(e) => setMockRecord(prev => ({
                            ...prev,
                            medications: prev.medications.map((med, i) => 
                              i === index ? { ...med, duration: e.target.value } : med
                            )
                          }))}
                          placeholder="Duration"
                        />
                      </div>
                      <textarea
                        className="w-full p-2 border rounded text-xs min-h-[60px]"
                        value={medication.remarks}
                        onChange={(e) => setMockRecord(prev => ({
                          ...prev,
                          medications: prev.medications.map((med, i) => 
                            i === index ? { ...med, remarks: e.target.value } : med
                          )
                        }))}
                        placeholder="Remarks"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`space-y-4 ${!selectedSections.prescription ? 'opacity-50' : ''}`}>
                  {mockRecord.medications.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-primary mb-2">{medication.name}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dosage:</span>
                          <span className="ml-2 font-medium">{medication.dosage}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{medication.duration}</span>
                        </div>
                      </div>
                      {medication.remarks && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <span className="font-medium">Note:</span> {medication.remarks}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="nextSteps"
                  checked={selectedSections.nextSteps}
                  onCheckedChange={() => handleSectionToggle('nextSteps')}
                />
              </div>
              <h3 className={`font-semibold text-lg mb-3 ${!selectedSections.nextSteps ? 'opacity-50' : ''}`}>
                Next Steps
                {!selectedSections.nextSteps && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
              </h3>
              {isEditing ? (
                <textarea
                  className="w-full p-3 border rounded-lg min-h-[100px] text-sm"
                  value={mockRecord.nextSteps.join('\n')}
                  onChange={(e) => setMockRecord(prev => ({
                    ...prev,
                    nextSteps: e.target.value.split('\n').filter(step => step.trim())
                  }))}
                  placeholder="Enter next steps..."
                />
              ) : (
                <ul className={`space-y-2 ${!selectedSections.nextSteps ? 'opacity-50' : ''}`}>
                  {mockRecord.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {step}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSave}
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSend}
              >
                <Send size={16} className="mr-2" />
                Send Selected to Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}