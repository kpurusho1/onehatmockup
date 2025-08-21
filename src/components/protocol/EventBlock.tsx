import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  GripVertical, 
  Upload,
  Save,
  X,
  FileVideo
} from "lucide-react";

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

interface EventBlockProps {
  event: ProtocolEvent;
  index: number;
  isEditing: boolean;
  onUpdate: (event: Partial<ProtocolEvent>) => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  activityOptions: string[];
  subActivityOptions: Record<string, string[]>;
  frequencyOptions: string[];
}

export function EventBlock({
  event,
  index,
  isEditing,
  onUpdate,
  onDelete,
  onEdit,
  onSave,
  onReorder,
  activityOptions,
  subActivityOptions,
  frequencyOptions
}: EventBlockProps) {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (fromIndex !== index) {
      onReorder(fromIndex, index);
    }
  };

  const handleVideoUpload = () => {
    // In a real app, this would open a file picker and upload the video
    const videoUrl = prompt("Enter video URL (for demo):");
    if (videoUrl) {
      onUpdate({ videoUrl });
    }
  };

  if (isEditing) {
    return (
      <Card className="border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Edit Activity</h4>
            <div className="flex space-x-2">
              <Button onClick={onSave} size="sm">
                <Save size={14} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" onClick={onSave} size="sm">
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Main Activity Details */}
            <div className="col-span-8 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Activity *</Label>
                  <Select
                    value={event.activity}
                    onValueChange={(value) => onUpdate({ activity: value, subActivity: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sub-activity *</Label>
                  <Select
                    value={event.subActivity}
                    onValueChange={(value) => onUpdate({ subActivity: value })}
                    disabled={!event.activity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {event.activity && subActivityOptions[event.activity]?.map((subActivity) => (
                        <SelectItem key={subActivity} value={subActivity}>
                          {subActivity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Frequency *</Label>
                  <Select
                    value={event.frequency}
                    onValueChange={(value) => onUpdate({ frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration</Label>
                  <Input
                    type="number"
                    value={event.duration}
                    onChange={(e) => onUpdate({ duration: e.target.value })}
                    placeholder="15"
                  />
                </div>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={event.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Describe the activity details..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Instructions *</Label>
                <Textarea
                  value={event.instructions}
                  onChange={(e) => onUpdate({ instructions: e.target.value })}
                  placeholder="Detailed instructions for the patient..."
                  rows={3}
                />
              </div>
            </div>

            {/* Actions Panel */}
            <div className="col-span-4 space-y-4">
              <div>
                <Label>Patient Action *</Label>
                <Select
                  value={event.patientAction}
                  onValueChange={(value) => onUpdate({ patientAction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upload-report">Upload Report</SelectItem>
                    <SelectItem value="book-appointment">Book Appointment</SelectItem>
                    <SelectItem value="measure-vitals">Measure Vitals</SelectItem>
                    <SelectItem value="take-medication">Take Medication</SelectItem>
                    <SelectItem value="complete-exercise">Complete Exercise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Doctor Action</Label>
                <Select
                  value={event.doctorAction}
                  onValueChange={(value) => onUpdate({ doctorAction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review-report">Review Report</SelectItem>
                    <SelectItem value="schedule-consultation">Schedule Consultation</SelectItem>
                    <SelectItem value="adjust-medication">Adjust Medication</SelectItem>
                    <SelectItem value="provide-feedback">Provide Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleVideoUpload}
                  variant="outline"
                  className="w-full"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Video
                </Button>
                {event.videoUrl && (
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <FileVideo size={14} />
                    <span>Video attached</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`cursor-move ${draggedOver ? 'border-primary' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <GripVertical size={16} className="text-muted-foreground" />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{event.activity}</Badge>
                <span className="font-medium">{event.subActivity}</span>
                {event.videoUrl && (
                  <FileVideo size={14} className="text-primary" />
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Frequency:</span> {event.frequency}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {event.duration || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Patient Action:</span> {event.patientAction || "None"}
                </div>
              </div>
              
              {event.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit size={14} className="mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}