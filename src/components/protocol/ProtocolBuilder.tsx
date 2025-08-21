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
import { EventBlock } from "./EventBlock";
import { TemplateSelector } from "./TemplateSelector";

interface ProtocolEvent {
  id: string;
  activity: string;
  subActivity: string;
  frequency: string;
  duration: string;
  description: string;
  instructions: string;
  patientAction: string;
  doctorAction: string;
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
  const [events, setEvents] = useState<ProtocolEvent[]>(initialProtocol?.events || []);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  const addNewEvent = () => {
    const newEvent: ProtocolEvent = {
      id: Date.now().toString(),
      activity: "",
      subActivity: "",
      frequency: "",
      duration: "",
      description: "",
      instructions: "",
      patientAction: "",
      doctorAction: ""
    };
    setEvents([...events, newEvent]);
    setEditingEvent(newEvent.id);
  };

  const updateEvent = (id: string, updatedEvent: Partial<ProtocolEvent>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const reorderEvents = (fromIndex: number, toIndex: number) => {
    const newEvents = [...events];
    const [removed] = newEvents.splice(fromIndex, 1);
    newEvents.splice(toIndex, 0, removed);
    setEvents(newEvents);
  };

  const handleTemplateSelect = (template: any) => {
    setProtocolName(template.name);
    setEvents(template.events || []);
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
          <div className="flex items-center justify-between">
            <CardTitle>Protocol Events</CardTitle>
            <Button onClick={addNewEvent}>
              <Plus size={16} className="mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No activities added yet</p>
              <Button onClick={addNewEvent} variant="outline">
                <Plus size={16} className="mr-2" />
                Add First Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <EventBlock
                  key={event.id}
                  event={event}
                  index={index}
                  isEditing={editingEvent === event.id}
                  onUpdate={(updatedEvent) => updateEvent(event.id, updatedEvent)}
                  onDelete={() => deleteEvent(event.id)}
                  onEdit={() => setEditingEvent(event.id)}
                  onSave={() => setEditingEvent(null)}
                  onReorder={reorderEvents}
                  activityOptions={activityOptions}
                  subActivityOptions={subActivityOptions}
                  frequencyOptions={frequencyOptions}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}