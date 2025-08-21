import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit,
  Play,
  FileText,
  GripVertical,
  Trash2,
  Settings
} from "lucide-react";
import { EventBlock } from "./EventBlock";

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

// Mock treatment plan data
const mockTreatmentPlan = {
  name: "Knee Surgery Recovery Protocol",
  startDate: "2025-08-15",
  endDate: "2025-10-15",
  progress: 65,
  totalActivities: 12,
  completedActivities: 8,
  currentWeek: 4,
  totalWeeks: 8,
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
};

export function TreatmentPlanTab({ patient, onCreateProtocol }: TreatmentPlanTabProps) {
  const [treatmentPlan, setTreatmentPlan] = useState(mockTreatmentPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const hasTreatmentPlan = patient.adherence > 50; // Mock condition

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

  const addNewActivity = () => {
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
    setTreatmentPlan(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity],
      totalActivities: prev.totalActivities + 1
    }));
  };

  const updateActivity = (id: string | number, updatedActivity: any) => {
    setTreatmentPlan(prev => ({
      ...prev,
      activities: prev.activities.map(activity => 
        activity.id === id ? { ...activity, ...updatedActivity } : activity
      )
    }));
  };

  const deleteActivity = (id: string | number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.id !== id),
      totalActivities: prev.totalActivities - 1
    }));
  };

  const reorderActivities = (fromIndex: number, toIndex: number) => {
    const newActivities = [...treatmentPlan.activities];
    const [removed] = newActivities.splice(fromIndex, 1);
    newActivities.splice(toIndex, 0, removed);
    setTreatmentPlan(prev => ({
      ...prev,
      activities: newActivities
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

  if (!hasTreatmentPlan) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Treatment Plan Progress</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onCreateProtocol}>
              <Plus size={16} className="mr-2" />
              Create from Template
            </Button>
            <Button size="sm" onClick={onCreateProtocol}>
              <Plus size={16} className="mr-2" />
              Create from Scratch
            </Button>
          </div>
        </div>
        
        <div className="text-center py-12">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">No treatment plan assigned</h4>
          <p className="text-muted-foreground mb-6">
            Create a personalized treatment plan to track {patient.name}'s recovery progress
          </p>
          <div className="flex justify-center space-x-3">
            <Button onClick={onCreateProtocol}>
              Create from Template
            </Button>
            <Button variant="outline" onClick={onCreateProtocol}>
              Create from Scratch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Treatment Plan Progress</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit size={16} className="mr-2" />
            Edit Plan
          </Button>
          <Button size="sm" onClick={onCreateProtocol}>
            <Plus size={16} className="mr-2" />
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Treatment Plan Overview - Compact */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-lg font-semibold">{treatmentPlan.name}</h4>
              <p className="text-sm text-muted-foreground">
                Week {treatmentPlan.currentWeek} of {treatmentPlan.totalWeeks}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-2 py-1">
                {treatmentPlan.progress}% Complete
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings size={14} className="mr-1" />
                {isEditing ? 'Done' : 'Edit Plan'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress value={treatmentPlan.progress} className="h-1.5" />
            </div>
            <span className="text-xs text-muted-foreground min-w-fit">
              {treatmentPlan.completedActivities}/{treatmentPlan.totalActivities} activities
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Activities */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Current Activities</h4>
            {isEditing && (
              <Button onClick={addNewActivity} size="sm">
                <Plus size={16} className="mr-2" />
                Add Activity
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {treatmentPlan.activities.map((activity, index) => {
              if (isEditing) {
                return (
                  <EventBlock
                    key={activity.id}
                    event={{
                      id: activity.id.toString(),
                      activity: activity.activity || activity.type,
                      subActivity: activity.subActivity || activity.name,
                      frequency: activity.frequency,
                      duration: activity.duration.replace(' min', ''),
                      description: activity.description,
                      instructions: activity.instructions || '',
                      patientAction: activity.patientAction || '',
                      doctorAction: activity.doctorAction || '',
                      videoUrl: activity.videoUrl
                    }}
                    index={index}
                    isEditing={editingEvent === activity.id.toString()}
                    onUpdate={(updatedEvent) => updateActivity(activity.id, {
                      activity: updatedEvent.activity,
                      subActivity: updatedEvent.subActivity,
                      name: updatedEvent.subActivity,
                      type: updatedEvent.activity,
                      frequency: updatedEvent.frequency,
                      duration: updatedEvent.duration + ' min',
                      description: updatedEvent.description,
                      instructions: updatedEvent.instructions,
                      patientAction: updatedEvent.patientAction,
                      doctorAction: updatedEvent.doctorAction,
                      videoUrl: updatedEvent.videoUrl
                    })}
                    onDelete={() => deleteActivity(activity.id)}
                    onEdit={() => setEditingEvent(activity.id.toString())}
                    onSave={() => setEditingEvent(null)}
                    onReorder={reorderActivities}
                    activityOptions={activityOptions}
                    subActivityOptions={subActivityOptions}
                    frequencyOptions={frequencyOptions}
                  />
                );
              }

              return (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    activity.completed ? 'bg-success/5 border-success/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {activity.completed ? (
                      <CheckCircle2 size={18} className="text-success" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground" />
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{activity.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 min-w-fit text-xs">
                    <div className="text-right">
                      <div className="font-medium">{activity.frequency}</div>
                      <div className="text-muted-foreground">{activity.duration}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-muted-foreground">Due</div>
                      <div className="font-medium">{activity.dueDate}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}