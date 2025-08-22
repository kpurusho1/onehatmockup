import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Upload,
  Save,
  ArrowLeft
} from "lucide-react";
import { BlockEditor } from "./BlockEditor";
import { TemplateSelector } from "./TemplateSelector";

interface ProtocolEvent {
  id: string;
  activity: string;
  instructions: string;
  frequency: string;
  duration: number;
  videoUrl?: string;
}

interface ProtocolBuilderProps {
  patientName: string;
  onSave: (protocol: any) => void;
  onCancel: () => void;
  initialProtocol?: any;
}

const activityOptions = [
  "Exercise",
  "Consultation", 
  "Physiotherapy",
  "Medication",
  "Diet",
  "Rest"
];

const subActivityOptions = {
  Exercise: ["Jog", "Walk", "Cycling", "Swimming", "Strength Training"],
  Consultation: ["Consultation", "Follow-up", "Check-up", "Assessment"],
  Physiotherapy: ["Physiotherapy Knee Exercises", "Range of Motion", "Strength Building", "Pain Management"],
  Medication: ["Oral Medication", "Injection", "Topical Application"],
  Diet: ["Meal Plan", "Supplements", "Hydration", "Restrictions"],
  Rest: ["Bed Rest", "Activity Limitation", "Sleep Schedule"]
};

const frequencyOptions = ["Daily", "Twice Daily", "Weekly", "Twice Weekly", "Choose manually", "As needed"];

export function ProtocolBuilder({ patientName, onSave, onCancel, initialProtocol }: ProtocolBuilderProps) {
  const [protocolName, setProtocolName] = useState(initialProtocol?.name || "");
  const [events, setEvents] = useState<ProtocolEvent[]>(
    initialProtocol?.events?.map((event: any) => ({
      id: event.id || Date.now().toString(),
      activity: event.activity || "",
      instructions: event.instructions || event.description || "",
      frequency: event.frequency || "",
      duration: parseInt(event.duration?.replace(/\D/g, '')) || 0,
      videoUrl: event.videoUrl || ""
    })) || []
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleTemplateSelect = (template: any) => {
    setProtocolName(template.name);
    setEvents(template.events?.map((event: any) => ({
      id: event.id || Date.now().toString(),
      activity: event.activity || "",
      instructions: event.instructions || event.description || "",
      frequency: event.frequency || "",
      duration: parseInt(event.duration?.replace(/\D/g, '')) || 0,
      videoUrl: event.videoUrl || ""
    })) || []);
    setShowTemplateSelector(false);
  };

  const handleSave = () => {
    const protocol = {
      name: protocolName,
      events,
      patientName,
      createdAt: new Date().toISOString()
    };
    onSave(protocol);
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        onSelect={handleTemplateSelect}
        onCancel={() => setShowTemplateSelector(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Patient
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {initialProtocol ? "Edit Protocol" : "Create Protocol"}
            </h2>
            <p className="text-muted-foreground">Patient: {patientName}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!initialProtocol && (
            <Button variant="outline" onClick={() => setShowTemplateSelector(true)}>
              Choose from Template
            </Button>
          )}
          <Button onClick={handleSave} disabled={!protocolName || events.length === 0}>
            <Save size={16} className="mr-2" />
            Save Protocol
          </Button>
        </div>
      </div>

      {/* Protocol Details */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="protocolName">Protocol Name *</Label>
            <Input
              id="protocolName"
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              placeholder="e.g., Knee Surgery Recovery Protocol"
            />
          </div>
        </CardContent>
      </Card>

      {/* Protocol Events */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Events</CardTitle>
        </CardHeader>
        <CardContent>
          <BlockEditor
            events={events}
            onEventsChange={setEvents}
            activityOptions={activityOptions}
            frequencyOptions={frequencyOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}