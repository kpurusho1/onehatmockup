import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Play, 
  FileText,
  Dumbbell,
  Pill,
  User,
  Edit,
  Eye
} from "lucide-react";

interface Activity {
  id: number;
  name: string;
  type: string;
  activity: string;
  subActivity: string;
  frequency: string;
  duration: string;
  completed: boolean;
  dueDate: string;
  description: string;
  instructions: string;
  patientAction: string;
  doctorAction: string;
  videoUrl: string;
}

interface TreatmentProtocol {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  totalActivities: number;
  completedActivities: number;
  currentWeek: number;
  totalWeeks: number;
  status: string;
  activities: Activity[];
}

interface TreatmentTimelineNewProps {
  protocols: TreatmentProtocol[];
}

// Activity type colors
const getActivityColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'physiotherapy':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'consultation':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'medication':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'exercise':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'diet':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'rest':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusColor = (completed: boolean) => {
  return completed 
    ? 'bg-green-500 text-white' 
    : 'bg-blue-500 text-white';
};

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'physiotherapy':
      return <Play size={16} className="text-primary" />;
    case 'consultation':
      return <User size={16} className="text-primary" />;
    case 'medication':
      return <Pill size={16} className="text-primary" />;
    case 'exercise':
      return <Dumbbell size={16} className="text-primary" />;
    default:
      return <FileText size={16} className="text-primary" />;
  }
};

export function TreatmentTimelineNew({ protocols }: TreatmentTimelineNewProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Group all activities by date from all protocols
  const allActivities = protocols.flatMap(protocol => 
    protocol.activities.map(activity => ({
      ...activity,
      protocolName: protocol.name,
      protocolId: protocol.id
    }))
  );

  const groupedByDate = allActivities.reduce((acc, activity) => {
    const date = activity.dueDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, (Activity & { protocolName: string; protocolId: number })[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      {sortedDates.map((date, dateIndex) => (
        <div key={date} className="relative">
          {/* Date Header - Timeline Anchor */}
          <div className="relative flex items-center mb-4">
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
            <div className="flex items-center space-x-3 z-10 bg-background">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h3>
                <p className="text-sm text-muted-foreground">{groupedByDate[date].length} activity(ies)</p>
              </div>
            </div>
          </div>

          {/* Activities for this date */}
          <div className="ml-12 space-y-4">
            {groupedByDate[date].map((activity, index) => (
              <div key={`${activity.protocolId}-${activity.id}`} className="relative">
                {/* Timeline connector */}
                {index !== groupedByDate[date].length - 1 && (
                  <div className="absolute -left-8 top-16 bottom-0 w-0.5 bg-border/50" />
                )}
                
                {/* Timeline dot */}
                <div className={`absolute -left-10 top-8 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  activity.completed ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                
                {/* Content */}
                <div className="pb-6">
                  <Collapsible 
                    open={expandedItems.includes(`${activity.protocolId}-${activity.id}`)}
                    onOpenChange={() => toggleItem(`${activity.protocolId}-${activity.id}`)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getActivityIcon(activity.type)}
                                <Badge 
                                  className={`px-3 py-1 rounded-full border ${getActivityColor(activity.type)}`}
                                  variant="outline"
                                >
                                  {activity.type}
                                </Badge>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.completed)}`}>
                                  {activity.completed ? 'Completed' : 'Assigned'}
                                </div>
                              </div>
                              <h4 className="font-medium mb-1">{activity.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{activity.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>{activity.frequency}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Protocol: {activity.protocolName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                              {expandedItems.includes(`${activity.protocolId}-${activity.id}`) ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <Card className={`mt-2 border-l-4 ${
                        activity.completed ? 'border-l-green-500' : 'border-l-blue-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Description</h5>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Instructions</h5>
                              <p className="text-sm text-muted-foreground">{activity.instructions}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium mb-1 text-sm">Patient Action</h5>
                                <p className="text-xs text-muted-foreground capitalize">{activity.patientAction.replace('-', ' ')}</p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1 text-sm">Doctor Action</h5>
                                <p className="text-xs text-muted-foreground capitalize">{activity.doctorAction.replace('-', ' ')}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-sm">
                                <span className="font-medium">Frequency:</span> {activity.frequency}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Duration:</span> {activity.duration}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}