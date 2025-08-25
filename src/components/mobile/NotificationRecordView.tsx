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
  CheckCircle2,
  Eye,
  Plus
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
        name: "Cefixime",
        morning: 1,
        noon: 0,
        evening: 1,
        night: 0,
        duration: "7 days",
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
        duration: "3 days",
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
        duration: "7 days",
        timeToTake: "Before bedtime",
        remarks: "Alpha blocker. This is what will help you pass out the stone. This can be kept for seven days. Take consistently at the same time each day."
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
            Back to All Patients
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-white" style={{ backgroundColor: '#1c2f7f' }}>
                  <Plus size={16} className="mr-2" />
                  Create Rx
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit size={16} className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
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
              <h3 className={`font-semibold text-lg mb-3 flex items-center cursor-pointer ${!selectedSections.keyFacts ? 'opacity-50' : ''}`}
                  onClick={() => handleSectionToggle('keyFacts')}>
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
              <h3 className={`font-semibold text-lg mb-3 cursor-pointer ${!selectedSections.diagnosis ? 'opacity-50' : ''}`}
                  onClick={() => handleSectionToggle('diagnosis')}>
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
              <h3 className={`font-semibold text-lg mb-3 flex items-center cursor-pointer ${!selectedSections.prescription ? 'opacity-50' : ''}`}
                  onClick={() => handleSectionToggle('prescription')}>
                <Pill size={20} className="mr-2 text-primary" />
                Prescription
                {!selectedSections.prescription && <span className="ml-2 text-xs text-muted-foreground">(not selected for sending)</span>}
                <CheckCircle2 size={20} className="ml-auto text-green-600" />
              </h3>
              {isEditing ? (
                <div className="space-y-6">
                  {mockRecord.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
                      {/* Medicine Name */}
                      <div>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium bg-white"
                          value={medication.name}
                          onChange={(e) => setMockRecord(prev => ({
                            ...prev,
                            medications: prev.medications.map((med, i) => 
                              i === index ? { ...med, name: e.target.value } : med
                            )
                          }))}
                          placeholder="Enter medicine name"
                        />
                      </div>

                      {/* Dosage Grid */}
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Morning</label>
                          <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg font-medium bg-white"
                            value={medication.morning}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, morning: parseInt(e.target.value) || 0 } : med
                              )
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Noon</label>
                          <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg font-medium bg-white"
                            value={medication.noon}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, noon: parseInt(e.target.value) || 0 } : med
                              )
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Evening</label>
                          <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg font-medium bg-white"
                            value={medication.evening}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, evening: parseInt(e.target.value) || 0 } : med
                              )
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Night</label>
                          <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg font-medium bg-white"
                            value={medication.night}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, night: parseInt(e.target.value) || 0 } : med
                              )
                            }))}
                          />
                        </div>
                      </div>

                      {/* Duration and Time to take */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                            value={medication.duration}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, duration: e.target.value } : med
                              )
                            }))}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Time to take</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                            value={medication.timeToTake}
                            onChange={(e) => setMockRecord(prev => ({
                              ...prev,
                              medications: prev.medications.map((med, i) => 
                                i === index ? { ...med, timeToTake: e.target.value } : med
                              )
                            }))}
                            placeholder="e.g., After meals"
                          />
                        </div>
                      </div>

                      {/* Remarks */}
                      <div>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white min-h-[100px] text-sm"
                          value={medication.remarks}
                          onChange={(e) => setMockRecord(prev => ({
                            ...prev,
                            medications: prev.medications.map((med, i) => 
                              i === index ? { ...med, remarks: e.target.value } : med
                            )
                          }))}
                          placeholder="Additional instructions or remarks..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`space-y-6 ${!selectedSections.prescription ? 'opacity-50' : ''}`}>
                  {mockRecord.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      {/* Medicine Header */}
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">{medication.name}</h4>
                        <CheckCircle2 size={20} className="text-green-600" />
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

                      {/* Duration and Time to take */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-sm font-medium text-gray-600 mb-1">Duration</div>
                          <div className="font-semibold text-gray-800">{medication.duration}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-sm font-medium text-gray-600 mb-1">Time to take</div>
                          <div className="font-semibold text-gray-800">{medication.timeToTake}</div>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="bg-white rounded-lg p-4 border">
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {medication.remarks}
                        </div>
                      </div>
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
              <h3 className={`font-semibold text-lg mb-3 cursor-pointer ${!selectedSections.nextSteps ? 'opacity-50' : ''}`}
                  onClick={() => handleSectionToggle('nextSteps')}>
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