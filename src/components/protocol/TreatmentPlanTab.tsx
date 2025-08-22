import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Clock,
  CheckCircle2,
  Circle,
  Edit,
  Play,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Calendar,
  MoreVertical,
  Trash2,
  RefreshCw
} from "lucide-react";
import { ScheduleView } from "./ScheduleView";
import { BlockEditor } from "./BlockEditor";
import { TemplateDropdown } from "./TemplateDropdown";

interface Patient {
  id: number;
  name: string;
  phone: string;
  adherence: number;
  avatar: string;
  lastVisit: string;
  diagnosis: string;
  prescriptions: any[];
  healthRecords: any[];
}

interface TreatmentPlanTabProps {
  patient: Patient;
  onCreateProtocol: () => void;
}

// Mock treatment plan data - now supporting multiple protocols
const mockTreatmentPlans = [
  {
    id: 1,
    name: "Knee Surgery Recovery Protocol",
    startDate: "2025-08-15",
    endDate: "2025-10-15",
    progress: 65,
    totalActivities: 4,
    completedActivities: 2,
    currentWeek: 4,
    totalWeeks: 8,
    status: "active",
    activities: [
      {
        id: 1,
        name: "Physiotherapy Knee Exercises",
        type: "Physiotherapy",
        activity: "Physiotherapy",
        subActivity: "Physiotherapy Knee Exercises",
        frequency: "Daily",
        duration: "30 min",
        completed: true,
        dueDate: "2025-08-21",
        description: "Range of motion exercises to improve knee flexibility",
        instructions: "Perform 3 sets of 10 repetitions, hold each position for 5 seconds",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      },
      {
        id: 2,
        name: "Follow-up Consultation",
        type: "Consultation",
        activity: "Consultation",
        subActivity: "Follow-up",
        frequency: "Weekly",
        duration: "30 min",
        completed: true,
        dueDate: "2025-08-22",
        description: "Regular check-up to monitor recovery progress",
        instructions: "Come prepared with any concerns or questions",
        patientAction: "book-appointment",
        doctorAction: "provide-feedback",
        videoUrl: ""
      },
      {
        id: 3,
        name: "Pain Management",
        type: "Medication",
        activity: "Medication",
        subActivity: "Oral Medication",
        frequency: "As needed",
        duration: "5 min",
        completed: false,
        dueDate: "2025-08-23",
        description: "Take prescribed medication for pain relief",
        instructions: "Take medication with food to prevent stomach upset",
        patientAction: "take-medication",
        doctorAction: "adjust-medication",
        videoUrl: ""
      },
      {
        id: 4,
        name: "Strength Building Exercises",
        type: "Exercise",
        activity: "Exercise",
        subActivity: "Strength Training",
        frequency: "3x per week",
        duration: "45 min",
        completed: false,
        dueDate: "2025-08-24",
        description: "Progressive strength training for leg muscles",
        instructions: "Start with light weights and gradually increase intensity",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      }
    ]
  },
  {
    id: 2,
    name: "Post-Surgery Mobility Protocol",
    startDate: "2025-08-20",
    endDate: "2025-09-20",
    progress: 25,
    totalActivities: 3,
    completedActivities: 1,
    currentWeek: 1,
    totalWeeks: 4,
    status: "active",
    activities: [
      {
        id: 5,
        name: "Walking Exercises",
        type: "Exercise",
        activity: "Exercise",
        subActivity: "Walk",
        frequency: "Twice Daily",
        duration: "15 min",
        completed: true,
        dueDate: "2025-08-21",
        description: "Gentle walking to improve mobility",
        instructions: "Start with short distances and gradually increase",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      },
      {
        id: 6,
        name: "Range of Motion Assessment",
        type: "Consultation",
        activity: "Consultation",
        subActivity: "Assessment",
        frequency: "Weekly",
        duration: "20 min",
        completed: false,
        dueDate: "2025-08-25",
        description: "Assess progress in joint mobility",
        instructions: "Prepare to demonstrate current range of motion",
        patientAction: "book-appointment",
        doctorAction: "provide-feedback",
        videoUrl: ""
      },
      {
        id: 7,
        name: "Rest and Recovery",
        type: "Rest",
        activity: "Rest",
        subActivity: "Bed Rest",
        frequency: "As needed",
        duration: "Variable",
        completed: false,
        dueDate: "2025-08-26",
        description: "Adequate rest to support healing",
        instructions: "Elevate leg when resting, avoid overexertion",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      }
    ]
  }
];

export function TreatmentPlanTab({ patient, onCreateProtocol }: TreatmentPlanTabProps) {
  const [treatmentPlans, setTreatmentPlans] = useState(mockTreatmentPlans);
  const [editingProtocol, setEditingProtocol] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [openProtocols, setOpenProtocols] = useState<number[]>([1]); // First protocol open by default
  const hasProtocols = patient.adherence > 30; // Mock condition - adjusted to show protocols

  const activityOptions = ["Exercise", "Consultation", "Physiotherapy", "Medication", "Diet", "Rest"];
  const subActivityOptions = {
    Exercise: ["Jog", "Walk", "Cycling", "Swimming", "Strength Training"],
    Consultation: ["Consultation", "Follow-up", "Check-up", "Assessment"],
    Physiotherapy: ["Physiotherapy Knee Exercises", "Range of Motion", "Strength Building", "Pain Management"],
    Medication: ["Oral Medication", "Injection", "Topical Application"],
    Diet: ["Meal Plan", "Supplements", "Hydration", "Restrictions"],
    Rest: ["Bed Rest", "Activity Limitation", "Sleep Schedule"]
  };
  const frequencyOptions = ["Daily", "Twice Daily", "Weekly", "Twice Weekly", "Choose manually", "As needed"];

  const toggleProtocol = (protocolId: number) => {
    setOpenProtocols(prev => 
      prev.includes(protocolId) 
        ? prev.filter(id => id !== protocolId)
        : [...prev, protocolId]
    );
  };

  const addNewProtocol = () => {
    onCreateProtocol();
  };

  const handleTemplateSelect = (template: any) => {
    // Create new protocol from template
    console.log("Creating protocol from template:", template);
    onCreateProtocol();
  };

  const handleCreateFromScratch = () => {
    // Create empty protocol
    console.log("Creating protocol from scratch");
    onCreateProtocol();
  };

  const addNewActivity = (protocolId: number) => {
    const newActivity = {
      id: Date.now(),
      name: "New Activity",
      type: "Exercise",
      frequency: "Daily",
      duration: "30 min",
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      description: "New activity description",
      activity: "Exercise",
      subActivity: "Walk",
      instructions: "Instructions for the new activity",
      patientAction: "complete-exercise",
      doctorAction: "review-report",
      videoUrl: ""
    };

    setTreatmentPlans(prev => prev.map(protocol => 
      protocol.id === protocolId 
        ? {
            ...protocol,
            activities: [...protocol.activities, newActivity],
            totalActivities: protocol.totalActivities + 1
          }
        : protocol
    ));
  };

  const updateActivity = (protocolId: number, activityId: string | number, updatedActivity: any) => {
    setTreatmentPlans(prev => prev.map(protocol => 
      protocol.id === protocolId 
        ? {
            ...protocol,
            activities: protocol.activities.map(activity => 
              activity.id === activityId ? { ...activity, ...updatedActivity } : activity
            )
          }
        : protocol
    ));
  };

  const deleteActivity = (protocolId: number, activityId: string | number) => {
    setTreatmentPlans(prev => prev.map(protocol => 
      protocol.id === protocolId 
        ? {
            ...protocol,
            activities: protocol.activities.filter(activity => activity.id !== activityId),
            totalActivities: protocol.totalActivities - 1
          }
        : protocol
    ));
  };

  const reorderActivities = (protocolId: number, fromIndex: number, toIndex: number) => {
    setTreatmentPlans(prev => prev.map(protocol => {
      if (protocol.id === protocolId) {
        const newActivities = [...protocol.activities];
        const [removed] = newActivities.splice(fromIndex, 1);
        newActivities.splice(toIndex, 0, removed);
        return { ...protocol, activities: newActivities };
      }
      return protocol;
    }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Physiotherapy":
        return <Play size={16} className="text-primary" />;
      case "Consultation":
        return <Calendar size={16} className="text-primary" />;
      case "Medication":
        return <FileText size={16} className="text-primary" />;
      default:
        return <Circle size={16} className="text-primary" />;
    }
  };

  if (!hasProtocols) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Treatment Protocols</h3>
          <TemplateDropdown 
            onSelectTemplate={handleTemplateSelect}
            onCreateFromScratch={handleCreateFromScratch}
          />
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h4 className="text-xl font-medium mb-3">No treatment protocols assigned</h4>
            <p className="text-muted-foreground mb-6">
              Create a personalized treatment protocol to track {patient.name}'s recovery progress
            </p>
            <Button 
              onClick={() => onCreateProtocol()} 
              className="w-full" 
              style={{backgroundColor: '#1c2f7f'}}
            >
              <Plus size={16} className="mr-2" />
              Add New Protocol
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Treatment Protocols ({treatmentPlans.length})</h3>
        <TemplateDropdown 
          onSelectTemplate={handleTemplateSelect}
          onCreateFromScratch={handleCreateFromScratch}
        />
      </div>

      {/* Protocols List */}
      <div className="space-y-3">
        {treatmentPlans.map((protocol) => {
          const isOpen = openProtocols.includes(protocol.id);
          const isEditing = editingProtocol === protocol.id;
          
          return (
            <Card key={protocol.id} className="overflow-hidden">
              {/* Protocol Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b"
                onClick={() => toggleProtocol(protocol.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isOpen ? (
                      <ChevronDown size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronRight size={16} className="text-muted-foreground" />
                    )}
                    
                    <div>
                      <h4 className="font-semibold">{protocol.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Week {protocol.currentWeek} of {protocol.totalWeeks} • {protocol.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-3">
                       <div className="text-right text-sm">
                         <div className="text-muted-foreground">
                           {protocol.completedActivities}/{protocol.totalActivities} activities
                         </div>
                       </div>
                       <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                         protocol.progress >= 80 
                           ? 'border-green-500 bg-green-500/10 text-green-600' 
                           : protocol.progress >= 60 
                           ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' 
                           : 'border-red-500 bg-red-500/10 text-red-600'
                       } text-sm font-bold`}>
                         {protocol.progress}%
                       </div>
                     </div>
                    
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProtocol(isEditing ? null : protocol.id)}
                      >
                        <Settings size={14} className="mr-1" />
                        {isEditing ? 'Done' : 'Edit'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => console.log('Delete protocol', protocol.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Override protocol', protocol.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Override
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Archive protocol', protocol.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Progress value={protocol.progress} className="h-1.5" />
                </div>
              </div>

              {/* Protocol Content */}
              <Collapsible open={isOpen}>
                <CollapsibleContent>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      {/* Pending Activities */}
                      <div className="space-y-4">
                        {isEditing ? (
                          // Edit view: Show activities in BlockEditor format
                          <BlockEditor
                            events={protocol.activities
                              .filter(activity => !activity.completed)
                              .map(activity => ({
                                id: activity.id.toString(),
                                activity: activity.activity || activity.type,
                                instructions: activity.instructions || activity.description,
                                frequency: activity.frequency,
                                duration: parseInt(activity.duration.replace(/\D/g, '')) || 0,
                                videoUrl: activity.videoUrl
                              }))}
                            onEventsChange={(events) => {
                              // Convert back to protocol activities format and update
                              const completedActivities = protocol.activities.filter(activity => activity.completed);
                              const updatedActivities = [
                                ...events.map((event, index) => {
                                  const originalActivity = protocol.activities.find(a => !a.completed && protocol.activities.indexOf(a) === index) || {
                                    completed: false,
                                    dueDate: new Date().toISOString().split('T')[0],
                                    patientAction: 'complete-task',
                                    doctorAction: 'review-progress'
                                  };
                                  return {
                                    ...originalActivity,
                                    id: parseInt(event.id) || Date.now() + index,
                                    activity: event.activity,
                                    type: event.activity,
                                    name: event.activity,
                                    subActivity: event.activity,
                                    instructions: event.instructions,
                                    description: event.instructions,
                                    frequency: event.frequency,
                                    duration: `${event.duration} min`,
                                    videoUrl: event.videoUrl,
                                    completed: false,
                                    dueDate: originalActivity.dueDate,
                                    patientAction: originalActivity.patientAction,
                                    doctorAction: originalActivity.doctorAction
                                  };
                                }),
                                ...completedActivities
                              ];
                              
                              setTreatmentPlans(prev => prev.map(p => 
                                p.id === protocol.id 
                                  ? { ...p, activities: updatedActivities, totalActivities: updatedActivities.length }
                                  : p
                              ));
                            }}
                            activityOptions={activityOptions}
                            frequencyOptions={frequencyOptions}
                          />
                        ) : (
                          // Schedule view: Show pending activities in schedule format
                          <ScheduleView
                            events={protocol.activities
                              .filter(activity => !activity.completed)
                              .map(activity => ({
                                id: activity.id,
                                date: activity.dueDate,
                                day: new Date(activity.dueDate).toLocaleDateString('en-US', { weekday: 'long' }),
                                activity: activity.activity || activity.type,
                                instructions: activity.instructions || activity.description,
                                videoUrl: activity.videoUrl,
                                status: new Date(activity.dueDate) < new Date() ? 'overdue' : 'assigned'
                              }))}
                          />
                        )}
                      </div>

                      {/* Completed Activities - Collapsible */}
                      {protocol.activities.some(activity => activity.completed) && (
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t hover:bg-muted/50 rounded">
                            <h5 className="font-semibold text-sm text-muted-foreground">
                              Completed Activities ({protocol.activities.filter(a => a.completed).length})
                            </h5>
                            <ChevronDown size={16} className="text-muted-foreground" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <ScheduleView
                              events={protocol.activities
                                .filter(activity => activity.completed)
                                .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()) // Recent to earliest
                                .map(activity => ({
                                  id: activity.id,
                                  date: activity.dueDate,
                                  day: new Date(activity.dueDate).toLocaleDateString('en-US', { weekday: 'long' }),
                                  activity: activity.activity || activity.type,
                                  instructions: activity.instructions || activity.description,
                                  videoUrl: activity.videoUrl,
                                  status: 'completed'
                                }))}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
}