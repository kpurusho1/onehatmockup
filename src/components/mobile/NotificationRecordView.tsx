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
  const [selectedSections, setSelectedSections] = useState({
    keyFacts: true,
    diagnosis: true,
    prescription: true,
    nextSteps: true
  });

  // Mock data for the medical record
  const mockRecord = {
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
  };

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
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
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
            <Button variant="outline" size="sm">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Facts */}
          {selectedSections.keyFacts && (
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="keyFacts"
                  checked={selectedSections.keyFacts}
                  onCheckedChange={() => handleSectionToggle('keyFacts')}
                />
              </div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <FileText size={20} className="mr-2 text-primary" />
                Key Facts
              </h3>
              <ul className="space-y-2">
                {mockRecord.keyFacts.map((fact, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagnosis */}
          {selectedSections.diagnosis && (
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="diagnosis"
                  checked={selectedSections.diagnosis}
                  onCheckedChange={() => handleSectionToggle('diagnosis')}
                />
              </div>
              <h3 className="font-semibold text-lg mb-3">Diagnosis</h3>
              <p className="text-sm text-muted-foreground">{mockRecord.diagnosis}</p>
            </div>
          )}

          {/* Prescription */}
          {selectedSections.prescription && (
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="prescription"
                  checked={selectedSections.prescription}
                  onCheckedChange={() => handleSectionToggle('prescription')}
                />
              </div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Pill size={20} className="mr-2 text-primary" />
                Prescription
              </h3>
              <div className="space-y-4">
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
            </div>
          )}

          {/* Next Steps */}
          {selectedSections.nextSteps && (
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Checkbox 
                  id="nextSteps"
                  checked={selectedSections.nextSteps}
                  onCheckedChange={() => handleSectionToggle('nextSteps')}
                />
              </div>
              <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
              <ul className="space-y-2">
                {mockRecord.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              Send to Patient
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}