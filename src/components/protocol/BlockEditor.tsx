import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link } from "lucide-react";

interface BlockEvent {
  id: string;
  activity: string;
  instructions: string;
  frequency: string;
  duration: number;
  videoUrl?: string;
}

interface BlockEditorProps {
  events: BlockEvent[];
  onEventsChange: (events: BlockEvent[]) => void;
  activityOptions?: string[];
  frequencyOptions?: string[];
}

const defaultActivityOptions = ["Exercise", "Consultation", "Physiotherapy", "Medication", "Diet", "Rest"];
const defaultFrequencyOptions = ["Daily", "Twice Daily", "Weekly", "Twice Weekly", "As needed"];

export function BlockEditor({ 
  events, 
  onEventsChange,
  activityOptions = defaultActivityOptions,
  frequencyOptions = defaultFrequencyOptions
}: BlockEditorProps) {
  const addNewEvent = () => {
    const newEvent: BlockEvent = {
      id: Date.now().toString(),
      activity: "",
      instructions: "",
      frequency: "",
      duration: 0,
      videoUrl: ""
    };
    onEventsChange([...events, newEvent]);
  };

  const updateEvent = (index: number, updates: Partial<BlockEvent>) => {
    const updatedEvents = events.map((event, i) => 
      i === index ? { ...event, ...updates } : event
    );
    onEventsChange(updatedEvents);
  };

  const deleteEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    onEventsChange(updatedEvents);
  };

  const addVideoLink = (index: number) => {
    const videoUrl = prompt("Enter video URL:");
    if (videoUrl) {
      updateEvent(index, { videoUrl });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-11 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-2">Activity</div>
        <div className="col-span-4">Instructions</div>
        <div className="col-span-2">Frequency</div>
        <div className="col-span-1">Duration</div>
        <div className="col-span-1">Video</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Events */}
      <div className="space-y-2">
        {events.map((event, index) => (
          <Card key={event.id} className="p-4">
            <div className="grid grid-cols-11 gap-4 items-center">
              {/* Activity */}
              <div className="col-span-2">
                <Select 
                  value={event.activity} 
                  onValueChange={(value) => updateEvent(index, { activity: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Instructions */}
              <div className="col-span-4">
                <Textarea
                  value={event.instructions}
                  onChange={(e) => updateEvent(index, { instructions: e.target.value })}
                  placeholder="Enter instructions for this activity..."
                  className="min-h-[36px] resize-none"
                  rows={1}
                />
              </div>

              {/* Frequency */}
              <div className="col-span-2">
                <Select 
                  value={event.frequency} 
                  onValueChange={(value) => updateEvent(index, { frequency: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="col-span-1">
                <Input
                  type="number"
                  value={event.duration || ""}
                  onChange={(e) => updateEvent(index, { duration: parseInt(e.target.value) || 0 })}
                  placeholder="Days"
                  className="h-9"
                  min="1"
                />
              </div>

              {/* Video Link */}
              <div className="col-span-1 flex justify-center">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 w-9 p-0"
                  onClick={() => addVideoLink(index)}
                >
                  <Link size={14} className={event.videoUrl ? "text-primary" : "text-muted-foreground"} />
                </Button>
                {event.videoUrl && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    ✓
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-center">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => deleteEvent(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Event */}
      <Button 
        onClick={addNewEvent} 
        variant="outline" 
        className="w-full"
      >
        <Plus size={16} className="mr-2" />
        Add Activity
      </Button>

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No activities added yet</p>
          <Button onClick={addNewEvent} variant="outline">
            <Plus size={16} className="mr-2" />
            Add First Activity
          </Button>
        </div>
      )}
    </div>
  );
}