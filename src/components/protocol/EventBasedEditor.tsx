import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Trash2, Plus, Calendar } from "lucide-react";
import { BlockEditor } from "./BlockEditor";

interface ScheduledEvent {
  id: string;
  activity: string;
  instructions: string;
  date: string;
  time: string;
  completed: boolean;
  videoUrl?: string;
}

interface EventBasedEditorProps {
  patientName: string;
  protocolName: string;
  events: ScheduledEvent[];
  onSave: (events: ScheduledEvent[], newBlocks?: any[]) => void;
  onCancel: () => void;
  mode: "instructions" | "plan";
}

export function EventBasedEditor({ 
  patientName, 
  protocolName,
  events: initialEvents,
  onSave, 
  onCancel,
  mode 
}: EventBasedEditorProps) {
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newBlocks, setNewBlocks] = useState<any[]>([]);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.activity]) {
      acc[event.activity] = [];
    }
    acc[event.activity].push(event);
    return acc;
  }, {} as Record<string, ScheduledEvent[]>);

  const handleEventSelect = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const handleSelectAllForActivity = (activity: string) => {
    const activityEventIds = groupedEvents[activity].map(e => e.id);
    const allSelected = activityEventIds.every(id => selectedEvents.includes(id));
    
    if (allSelected) {
      setSelectedEvents(selectedEvents.filter(id => !activityEventIds.includes(id)));
    } else {
      const newSelected = [...selectedEvents, ...activityEventIds.filter(id => !selectedEvents.includes(id))];
      setSelectedEvents(newSelected);
    }
  };

  const handleDeleteSelected = () => {
    const filteredEvents = events.filter(event => !selectedEvents.includes(event.id));
    setEvents(filteredEvents);
    setSelectedEvents([]);
  };

  const handleUpdateEvent = (eventId: string, updates: Partial<ScheduledEvent>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const handleSave = () => {
    onSave(events, newBlocks);
  };

  const getActivityColor = (activity: string) => {
    const colors = {
      Exercise: "bg-blue-100 text-blue-800 border-blue-200",
      Physiotherapy: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      Medication: "bg-green-100 text-green-800 border-green-200",
      Consultation: "bg-purple-100 text-purple-800 border-purple-200",
      Diet: "bg-orange-100 text-orange-800 border-orange-200",
      Rest: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[activity as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
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
                {mode === "instructions" ? "Update Instructions" : "Edit Treatment Plan"}
              </h1>
              <p className="text-muted-foreground">
                {protocolName} - Patient: <span className="font-medium">{patientName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {mode === "plan" && selectedEvents.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected}>
                <Trash2 size={16} className="mr-2" />
                Delete Selected ({selectedEvents.length})
              </Button>
            )}
            {mode === "plan" && (
              <Button variant="outline" onClick={() => setShowAddBlock(!showAddBlock)}>
                <Plus size={16} className="mr-2" />
                Add New Block
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Add New Block Section */}
        {mode === "plan" && showAddBlock && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Activity Block</CardTitle>
            </CardHeader>
            <CardContent>
              <BlockEditor
                events={newBlocks}
                onEventsChange={setNewBlocks}
              />
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([activity, activityEvents]) => (
            <Card key={activity}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={`px-3 py-1 rounded-full border ${getActivityColor(activity)}`}>
                      {activity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {activityEvents.length} events
                    </span>
                  </div>
                  {mode === "plan" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectAllForActivity(activity)}
                    >
                      {activityEvents.every(e => selectedEvents.includes(e.id)) ? 'Deselect All' : 'Select All'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {mode === "plan" && (
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={(checked) => handleEventSelect(event.id, !!checked)}
                            className="mt-1"
                          />
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar size={14} />
                              <span>{event.date}</span>
                              <span>{event.time}</span>
                            </div>
                            {event.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Instructions</label>
                            <Textarea
                              value={event.instructions}
                              onChange={(e) => handleUpdateEvent(event.id, { instructions: e.target.value })}
                              className="mt-1"
                              disabled={mode === "plan"}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Video URL</label>
                            <Input
                              value={event.videoUrl || ""}
                              onChange={(e) => handleUpdateEvent(event.id, { videoUrl: e.target.value })}
                              placeholder="Enter video URL..."
                              className="mt-1"
                              disabled={mode === "plan"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}