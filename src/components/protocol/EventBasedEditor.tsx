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

  // Convert events to blocks for instructions editing
  const convertEventsToBlocks = () => {
    const blockMap = new Map();
    events.forEach(event => {
      const key = `${event.activity}-${event.instructions}`;
      if (!blockMap.has(key)) {
        blockMap.set(key, {
          id: `block-${Date.now()}-${Math.random()}`,
          activity: event.activity,
          instructions: event.instructions,
          frequency: "N/A", // Not editable in instructions mode
          duration: 0, // Not editable in instructions mode
          videoUrl: event.videoUrl,
          eventIds: []
        });
      }
      blockMap.get(key).eventIds.push(event.id);
    });
    return Array.from(blockMap.values());
  };

  const handleBlockUpdate = (blockIndex: number, updates: any) => {
    const blocks = convertEventsToBlocks();
    const block = blocks[blockIndex];
    
    // Update all events that belong to this block
    const updatedEvents = events.map(event => {
      if (block.eventIds.includes(event.id)) {
        return { ...event, ...updates };
      }
      return event;
    });
    setEvents(updatedEvents);
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
                {protocolName} - Patient: <span className="font-medium text-primary">{patientName}</span>
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

        {/* Instructions Mode - Block-wise editing */}
        {mode === "instructions" && (
          <Card>
            <CardHeader>
              <CardTitle>Update Instructions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Edit instructions and video links for each activity block
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-11 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-2">Activity</div>
                  <div className="col-span-4">Instructions</div>
                  <div className="col-span-2">Frequency</div>
                  <div className="col-span-1">Duration</div>
                  <div className="col-span-1">Video</div>
                  <div className="col-span-1">Events</div>
                </div>

                {/* Blocks */}
                <div className="space-y-2">
                  {convertEventsToBlocks().map((block, index) => (
                    <Card key={block.id} className="p-4">
                      <div className="grid grid-cols-11 gap-4 items-center">
                        {/* Activity - Disabled */}
                        <div className="col-span-2">
                          <Badge className={`px-3 py-1 rounded-full border ${getActivityColor(block.activity)}`}>
                            {block.activity}
                          </Badge>
                        </div>

                        {/* Instructions - Editable */}
                        <div className="col-span-4">
                          <Textarea
                            value={block.instructions}
                            onChange={(e) => handleBlockUpdate(index, { instructions: e.target.value })}
                            placeholder="Enter instructions for this activity..."
                            className="min-h-[36px] resize-none"
                            rows={1}
                          />
                        </div>

                        {/* Frequency - Disabled */}
                        <div className="col-span-2">
                          <div className="px-3 py-2 bg-muted rounded text-sm text-muted-foreground">
                            {block.frequency}
                          </div>
                        </div>

                        {/* Duration - Disabled */}
                        <div className="col-span-1">
                          <div className="px-3 py-2 bg-muted rounded text-sm text-muted-foreground text-center">
                            -
                          </div>
                        </div>

                        {/* Video Link - Editable */}
                        <div className="col-span-1">
                          <Input
                            value={block.videoUrl || ""}
                            onChange={(e) => handleBlockUpdate(index, { videoUrl: e.target.value })}
                            placeholder="Video URL"
                            className="h-9"
                          />
                        </div>

                        {/* Event Count */}
                        <div className="col-span-1 text-center">
                          <Badge variant="secondary" className="text-xs">
                            {block.eventIds.length}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Mode - Event-wise editing */}
        {mode === "plan" && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Treatment Plan Events</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select and manage individual events. You can delete selected events or add new activity blocks.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground bg-muted p-3 rounded">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedEvents.length === events.length && events.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEvents(events.map(e => e.id));
                        } else {
                          setSelectedEvents([]);
                        }
                      }}
                    />
                  </div>
                  <div>Activity</div>
                  <div className="col-span-2">Instructions</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Status</div>
                  <div>Video</div>
                </div>
                
                {/* Event Rows */}
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="grid grid-cols-8 gap-4 text-sm p-3 border rounded bg-background items-center">
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={(checked) => handleEventSelect(event.id, !!checked)}
                        />
                      </div>
                      
                      <div>
                        <Badge className={`px-2 py-1 rounded-full border text-xs ${getActivityColor(event.activity)}`}>
                          {event.activity}
                        </Badge>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm">{event.instructions}</div>
                      </div>
                      
                      <div className="text-muted-foreground">{event.date}</div>
                      
                      <div className="text-muted-foreground">{event.time}</div>
                      
                      <div>
                        {event.completed ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        {event.videoUrl ? (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Video
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Groups for Select All */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Quick Select by Activity:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(groupedEvents).map(([activity, activityEvents]) => (
                      <Button
                        key={activity}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllForActivity(activity)}
                        className="text-xs"
                      >
                        <Badge className={`mr-2 px-2 py-0 rounded-full border text-xs ${getActivityColor(activity)}`}>
                          {activity}
                        </Badge>
                        {activityEvents.every(e => selectedEvents.includes(e.id)) ? 'Deselect All' : 'Select All'} ({activityEvents.length})
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}