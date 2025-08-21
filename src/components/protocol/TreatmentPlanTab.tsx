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
  FileText
} from "lucide-react";

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
      frequency: "Daily",
      duration: "30 min",
      completed: true,
      dueDate: "2025-08-21",
      description: "Range of motion exercises to improve knee flexibility"
    },
    {
      id: 2,
      name: "Follow-up Consultation",
      type: "Consultation",
      frequency: "Weekly",
      duration: "30 min",
      completed: true,
      dueDate: "2025-08-22",
      description: "Regular check-up to monitor recovery progress"
    },
    {
      id: 3,
      name: "Pain Management",
      type: "Medication",
      frequency: "As needed",
      duration: "5 min",
      completed: false,
      dueDate: "2025-08-23",
      description: "Take prescribed medication for pain relief"
    },
    {
      id: 4,
      name: "Strength Building Exercises",
      type: "Exercise",
      frequency: "3x per week",
      duration: "45 min",
      completed: false,
      dueDate: "2025-08-24",
      description: "Progressive strength training for leg muscles"
    }
  ]
};

export function TreatmentPlanTab({ patient, onCreateProtocol }: TreatmentPlanTabProps) {
  const [treatmentPlan] = useState(mockTreatmentPlan);
  const hasTreatmentPlan = patient.adherence > 50; // Mock condition

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

      {/* Treatment Plan Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold">{treatmentPlan.name}</h4>
              <p className="text-muted-foreground">
                Week {treatmentPlan.currentWeek} of {treatmentPlan.totalWeeks}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {treatmentPlan.progress}% Complete
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {treatmentPlan.completedActivities} of {treatmentPlan.totalActivities} activities
                </span>
              </div>
              <Progress value={treatmentPlan.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{treatmentPlan.completedActivities}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {treatmentPlan.totalActivities - treatmentPlan.completedActivities}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{treatmentPlan.totalWeeks}</div>
                <div className="text-sm text-muted-foreground">Total Weeks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Activities */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4">Current Activities</h4>
          <div className="space-y-3">
            {treatmentPlan.activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  activity.completed ? 'bg-success/5 border-success/20' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {activity.completed ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : (
                    <Circle size={20} className="text-muted-foreground" />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.type)}
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <h5 className="font-medium">{activity.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 min-w-fit">
                  <div className="text-right text-sm">
                    <div className="font-medium">{activity.frequency}</div>
                    <div className="text-muted-foreground">{activity.duration}</div>
                  </div>
                  
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Due</div>
                    <div className="font-medium">{activity.dueDate}</div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}