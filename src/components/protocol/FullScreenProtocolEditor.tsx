import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { BlockEditor } from "./BlockEditor";

interface TreatmentPlanEvent {
  id: string;
  activity: string;
  instructions: string;
  frequency: string;
  duration: number;
  videoUrl?: string;
}

interface FullScreenTreatmentPlanEditorProps {
  patientName: string;
  treatmentPlanName?: string;
  events?: TreatmentPlanEvent[];
  onSave: (treatmentPlan: any) => void;
  onCancel: () => void;
  mode: "create" | "assign";
}

export function FullScreenTreatmentPlanEditor({ 
  patientName, 
  treatmentPlanName: initialTreatmentPlanName = "",
  events: initialEvents = [],
  onSave, 
  onCancel,
  mode 
}: FullScreenTreatmentPlanEditorProps) {
  const [treatmentPlanName, setTreatmentPlanName] = useState(initialTreatmentPlanName);
  const [events, setEvents] = useState<TreatmentPlanEvent[]>(initialEvents);
  const [treatmentPlanInstructions, setTreatmentPlanInstructions] = useState("");

  const handleSave = () => {
    const treatmentPlan = {
      name: treatmentPlanName,
      events,
      instructions: treatmentPlanInstructions,
      patientName,
      createdAt: new Date().toISOString()
    };
    onSave(treatmentPlan);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="min-h-screen p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === "create" ? "Create Treatment Plan" : "Assign Treatment Plan"}
              </h1>
              <p className="text-muted-foreground">Patient: <span className="font-medium text-primary">{patientName}</span></p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!treatmentPlanName || events.length === 0}
            className="min-w-[120px]"
          >
            <Save size={16} className="mr-2" />
            {mode === "create" ? "Save Treatment Plan" : "Assign Treatment Plan"}
          </Button>
        </div>

        {/* Treatment Plan Details */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="treatmentPlanName">Treatment Plan Name *</Label>
              <Input
                id="treatmentPlanName"
                value={treatmentPlanName}
                onChange={(e) => setTreatmentPlanName(e.target.value)}
                placeholder="e.g., Knee Surgery Recovery Treatment Plan"
              />
            </div>
            <div>
              <Label htmlFor="treatmentPlanInstructions">General Instructions</Label>
              <Textarea
                id="treatmentPlanInstructions"
                value={treatmentPlanInstructions}
                onChange={(e) => setTreatmentPlanInstructions(e.target.value)}
                placeholder="General instructions and guidelines for this treatment plan..."
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Treatment Plan Events */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Plan Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockEditor
              events={events}
              onEventsChange={setEvents}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export both old and new names for compatibility
export const FullScreenProtocolEditor = FullScreenTreatmentPlanEditor;