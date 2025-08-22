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
    <div className="space-y-6">
      {/* Timeline Events */}
      <div className="relative">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-start space-x-4 pb-6">
            {/* Timeline Line */}
            {index < events.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border"></div>
            )}
            
            {/* Date Circle */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                {new Date(event.date).getDate()}
              </div>
            </div>
            
            {/* Event Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-card border rounded-lg p-4 space-y-3">
                {/* Date & Status Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{event.date}</div>
                    <div className="text-xs text-muted-foreground">{event.day}</div>
                    <div className="text-xs text-primary font-medium mt-1">
                      {calculateDueDate(event.date)}
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs px-2 py-1 ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </Badge>
                </div>
                
                {/* Activity */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Activity</div>
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
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Instructions</div>
                  {editable && onUpdateEvent ? (
                    <Input
                      value={event.instructions}
                      onChange={(e) => onUpdateEvent(event.id, { instructions: e.target.value })}
                      className="h-8 text-sm"
                      placeholder="Enter instructions"
                    />
                  ) : (
                    <p className="text-sm">{event.instructions}</p>
                  )}
                </div>
                
                {/* Video Link */}
                {event.videoUrl && (
                  <div className="pt-2">
                    <Button size="sm" variant="ghost" className="h-8 text-xs">
                      <ExternalLink size={12} className="mr-1" />
                      Watch Video
                    </Button>
                  </div>
                )}
              </div>
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