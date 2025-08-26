import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Plus, X, Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Medication {
  drugName: string;
  morning: string;
  noon: string;
  night: string;
  time: string;
  duration: string;
  totalQty: string;
  remarks: string;
}

interface CreatePrescriptionProps {
  patientName?: string;
  patientPhone?: string;
  onBack: () => void;
  mode?: 'create' | 'view' | 'edit';
  prescriptionData?: {
    id: string;
    date: string;
    doctorAssigned: string;
  };
}

export function CreatePrescription({ 
  patientName = "Parivel", 
  patientPhone = "8954229999", 
  onBack, 
  mode = 'create',
  prescriptionData 
}: CreatePrescriptionProps) {
  const [prescriptionDate, setPrescriptionDate] = useState<Date>(new Date());
  const [validityDate, setValidityDate] = useState<Date | undefined>();
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);
  const [remindPatient, setRemindPatient] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { drugName: "", morning: "", noon: "", night: "", time: "", duration: "", totalQty: "", remarks: "" },
    { drugName: "", morning: "", noon: "", night: "", time: "", duration: "", totalQty: "", remarks: "" },
    { drugName: "", morning: "", noon: "", night: "", time: "", duration: "", totalQty: "", remarks: "" }
  ]);

  const addMedication = () => {
    setMedications([...medications, { 
      drugName: "", morning: "", noon: "", night: "", time: "", duration: "", totalQty: "", remarks: "" 
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'view' ? 'View Prescription' : mode === 'edit' ? 'Edit Prescription' : 'Create E-Prescription'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'view' || mode === 'edit' ? `Prescription ID: ${prescriptionData?.id}` : `Generate prescription for ${patientName}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Mobile *</Label>
                  <Input 
                    value={patientPhone} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Patient Profile</Label>
                  <Select disabled>
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder={patientName} />
                    </SelectTrigger>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date of Prescription (DD/MM/YYYY)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled
                        className={cn(
                          "w-full justify-start text-left font-normal bg-muted",
                          !prescriptionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {prescriptionDate ? format(prescriptionDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Prescription Valid Till (DD/MM/YYYY) *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validityDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validityDate ? format(validityDate, "dd/MM/yyyy") : <span>Choose a date *</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validityDate}
                        onSelect={setValidityDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="followup" 
                    checked={requiresFollowUp}
                    onCheckedChange={(checked) => setRequiresFollowUp(checked === true)}
                  />
                  <Label htmlFor="followup">Requires Follow-Up</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remind" 
                    checked={remindPatient}
                    onCheckedChange={(checked) => setRemindPatient(checked === true)}
                  />
                  <Label htmlFor="remind">Remind Patient</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter diagnosis details..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Medicine Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-8 gap-2 text-sm font-medium text-muted-foreground bg-muted p-3 rounded">
                  <div>Drug Name</div>
                  <div>Morning</div>
                  <div>Noon</div>
                  <div>Night</div>
                  <div>Time</div>
                  <div>Duration (in days)</div>
                  <div>Total Qty</div>
                  <div>Remarks</div>
                </div>
                
                {/* Medication Rows */}
                {medications.map((medication, index) => (
                  <div key={index} className="grid grid-cols-8 gap-2 items-center">
                    <div className="relative">
                      <Input 
                        placeholder="Pick one"
                        value={medication.drugName}
                        onChange={(e) => updateMedication(index, 'drugName', e.target.value)}
                      />
                    </div>
                    <Input 
                      value={medication.morning}
                      onChange={(e) => updateMedication(index, 'morning', e.target.value)}
                    />
                    <Input 
                      value={medication.noon}
                      onChange={(e) => updateMedication(index, 'noon', e.target.value)}
                    />
                    <Input 
                      value={medication.night}
                      onChange={(e) => updateMedication(index, 'night', e.target.value)}
                    />
                    <Select 
                      value={medication.time}
                      onValueChange={(value) => updateMedication(index, 'time', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before-food">Before Food</SelectItem>
                        <SelectItem value="after-food">After Food</SelectItem>
                        <SelectItem value="with-food">With Food</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    />
                    <Input 
                      value={medication.totalQty}
                      onChange={(e) => updateMedication(index, 'totalQty', e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={medication.remarks}
                        onChange={(e) => updateMedication(index, 'remarks', e.target.value)}
                        className="flex-1"
                      />
                      {medications.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="p-2 h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addMedication}
                  className="w-full mt-4 border-2 border-dashed border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus size={16} className="mr-2" />
                  Add Medicine
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - File Upload */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Attach prescriptions & reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Choose File</p>
                <p className="text-xs text-muted-foreground">Drag and drop files here or click to browse</p>
                <input type="file" multiple className="hidden" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button className="bg-primary">Create Rx</Button>
        </div>
      </div>
    </div>
  );
}