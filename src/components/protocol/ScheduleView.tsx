import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

interface ScheduleEvent {
  id: number;
  date: string;
  day: string;
  activity: string;
  instructions: string;
  videoUrl?: string;
  status: "assigned" | "completed" | "overdue";
}

interface ScheduleViewProps {
  events: ScheduleEvent[];
  onUpdateEvent?: (id: number, updates: Partial<ScheduleEvent>) => void;
  editable?: boolean;
}

const activityOptions = ["Exercise", "Consultation", "Physiotherapy", "Medication", "Diet", "Rest"];

export function ScheduleView({ events, onUpdateEvent, editable = false }: ScheduleViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "assigned":
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const calculateDueDate = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due in 1 day";
    if (diffDays > 1) return `Due in ${diffDays} days`;
    if (diffDays === -1) return "1 day overdue";
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-3">Date & Due</div>
        <div className="col-span-3">Activity</div>
        <div className="col-span-4">Instructions</div>
        <div className="col-span-1">Video</div>
        <div className="col-span-1">Status</div>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg border hover:bg-muted/50 transition-colors">
            {/* Date & Due */}
            <div className="col-span-3">
              <div className="font-medium text-sm">{event.date}</div>
              <div className="text-xs text-muted-foreground">{event.day}</div>
              <div className="text-xs text-primary font-medium mt-1">
                {calculateDueDate(event.date)}
              </div>
            </div>

            {/* Activity */}
            <div className="col-span-3">
              {editable && onUpdateEvent ? (
                <Select 
                  value={event.activity} 
                  onValueChange={(value) => onUpdateEvent(event.id, { activity: value })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {event.activity}
                </Badge>
              )}
            </div>

            {/* Instructions */}
            <div className="col-span-4">
              {editable && onUpdateEvent ? (
                <Input
                  value={event.instructions}
                  onChange={(e) => onUpdateEvent(event.id, { instructions: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Enter instructions"
                />
              ) : (
                <p className="text-sm line-clamp-2">{event.instructions}</p>
              )}
            </div>

            {/* Video Link */}
            <div className="col-span-1 flex justify-center">
              {event.videoUrl ? (
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <ExternalLink size={14} />
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground">-</div>
              )}
            </div>

            {/* Status */}
            <div className="col-span-1 flex justify-center">
              <Badge 
                className={`text-xs px-2 py-1 ${getStatusColor(event.status)}`}
              >
                {event.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No scheduled activities
        </div>
      )}
    </div>
  );
}