import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { BlockEditor } from "./BlockEditor";

interface ProtocolEvent {
  id: string;
  activity: string;
  instructions: string;
  frequency: string;
  duration: number;
  videoUrl?: string;
}

interface FullScreenProtocolEditorProps {
  patientName: string;
  protocolName?: string;
  events?: ProtocolEvent[];
  onSave: (protocol: any) => void;
  onCancel: () => void;
  mode: "create" | "assign";
}

export function FullScreenProtocolEditor({ 
  patientName, 
  protocolName: initialProtocolName = "",
  events: initialEvents = [],
  onSave, 
  onCancel,
  mode 
}: FullScreenProtocolEditorProps) {
  const [protocolName, setProtocolName] = useState(initialProtocolName);
  const [events, setEvents] = useState<ProtocolEvent[]>(initialEvents);
  const [protocolInstructions, setProtocolInstructions] = useState("");

  const handleSave = () => {
    const protocol = {
      name: protocolName,
      events,
      instructions: protocolInstructions,
      patientName,
      createdAt: new Date().toISOString()
    };
    onSave(protocol);
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
              <p className="text-muted-foreground">Patient: <span className="font-medium">{patientName}</span></p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!protocolName || events.length === 0}
            className="min-w-[120px]"
          >
            <Save size={16} className="mr-2" />
            {mode === "create" ? "Save Protocol" : "Assign Protocol"}
          </Button>
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
            <div>
              <Label htmlFor="protocolInstructions">General Instructions</Label>
              <Textarea
                id="protocolInstructions"
                value={protocolInstructions}
                onChange={(e) => setProtocolInstructions(e.target.value)}
                placeholder="General instructions and guidelines for this protocol..."
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Protocol Events */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Activities</CardTitle>
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