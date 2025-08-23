import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Calendar,
  Edit,
  Trash2,
  Copy,
  Activity,
  Clock
} from "lucide-react";
import { BlockEditor } from "@/components/protocol/BlockEditor";
import doctorConsultation from "@/assets/doctor-consultation.jpg";
import physiotherapy from "@/assets/physiotherapy.jpg";
import medicalEquipment from "@/assets/medical-equipment.jpg";

const treatmentPlans = [
  {
    id: 1,
    name: "Knee Surgery Recovery",
    description: "Comprehensive rehabilitation protocol for post-knee surgery patients",
    activities: 3,
    duration: "6 weeks",
    createdBy: "Dr. Mithra",
    createdOn: "18/04/2025",
    updatedOn: "13/05/2025",
    image: physiotherapy,
    activities_list: [
      { id: "1", activity: "Exercise", instructions: "Jog in the morning", frequency: "Daily", duration: 15 },
      { id: "2", activity: "Consultation", instructions: "Follow-up visit", frequency: "Weekly", duration: 1 },
      { id: "3", activity: "Physiotherapy", instructions: "Knee strengthening exercises", frequency: "Twice weekly", duration: 5 }
    ]
  },
  {
    id: 2,
    name: "Diabetes Management",
    description: "Complete diabetes care protocol with diet and exercise guidance",
    activities: 4,
    duration: "12 weeks",
    createdBy: "Dr. Mithra",
    createdOn: "12/05/2025",
    updatedOn: "12/05/2025",
    image: medicalEquipment,
    activities_list: [
      { id: "1", activity: "Consultation", instructions: "Blood Sugar Check", frequency: "Weekly", duration: 1 },
      { id: "2", activity: "Exercise", instructions: "Walking", frequency: "Daily", duration: 30 },
      { id: "3", activity: "Diet", instructions: "Meal Planning", frequency: "Daily", duration: 1 },
      { id: "4", activity: "Medication", instructions: "Insulin", frequency: "Twice daily", duration: 1 }
    ]
  },
  {
    id: 3,
    name: "Hypertension Protocol",
    description: "Blood pressure management with lifestyle modifications",
    activities: 2,
    duration: "8 weeks",
    createdBy: "Dr. Mithra",
    createdOn: "13/05/2025",
    updatedOn: "13/05/2025",
    image: doctorConsultation,
    activities_list: [
      { id: "1", activity: "Exercise", instructions: "Light Cardio", frequency: "Daily", duration: 20 },
      { id: "2", activity: "Consultation", instructions: "BP Monitoring", frequency: "Bi-weekly", duration: 1 }
    ]
  }
];

interface TreatmentPlanTemplatesProps {
  onSelect?: (treatmentPlan: any) => void;
  onCreateFromScratch?: () => void;
  patientName?: string;
}

export default function TreatmentPlanTemplates({ onSelect, onCreateFromScratch, patientName }: TreatmentPlanTemplatesProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTreatmentPlan, setSelectedTreatmentPlan] = useState(treatmentPlans[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState(selectedTreatmentPlan.activities_list);

  const filteredTreatmentPlans = treatmentPlans.filter(treatmentPlan =>
    treatmentPlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatmentPlan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTreatmentPlan = () => {
    setEvents(selectedTreatmentPlan.activities_list);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // Update treatment plan with new events
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Treatment Plan: {selectedTreatmentPlan.name}</h1>
            <p className="text-muted-foreground">Edit the treatment plan template activities</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockEditor 
              events={events} 
              onEventsChange={setEvents}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treatment Plan Templates</h1>
          <p className="text-muted-foreground">Create and manage reusable treatment plans</p>
        </div>
        <Button className="flex items-center space-x-2" style={{backgroundColor: '#1c2f7f'}}>
          <Plus size={16} />
          <span>Create Protocol</span>
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Protocol List */}
        <div className="col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Protocol List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search protocols..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {filteredTreatmentPlans.map((treatmentPlan) => (
                  <div
                    key={treatmentPlan.id}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      selectedTreatmentPlan.id === treatmentPlan.id
                        ? "bg-primary/10 border-l-primary"
                        : "hover:bg-muted border-l-transparent"
                    }`}
                    onClick={() => setSelectedTreatmentPlan(treatmentPlan)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{treatmentPlan.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {treatmentPlan.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Activity size={12} />
                          <span>{treatmentPlan.activities} activities</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{treatmentPlan.duration}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {treatmentPlan.createdBy}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Protocol Details */}
        <div className="col-span-7">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold">{selectedTreatmentPlan.name}</h2>
                    <Badge variant="secondary">{selectedTreatmentPlan.duration}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {selectedTreatmentPlan.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Created By</p>
                      <p className="text-muted-foreground">{selectedTreatmentPlan.createdBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Created On</p>
                      <p className="text-muted-foreground">{selectedTreatmentPlan.createdOn}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-muted-foreground">{selectedTreatmentPlan.updatedOn}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Activities</p>
                      <p className="text-muted-foreground">{selectedTreatmentPlan.activities}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleEditTreatmentPlan}>
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Treatment Plan Activities</h3>
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground bg-muted p-3 rounded">
                    <div>#</div>
                    <div>Activity</div>
                    <div>Instructions</div>
                    <div>Frequency</div>
                    <div>Duration</div>
                  </div>
                  
                  {/* Activity Rows */}
                  {selectedTreatmentPlan.activities_list.map((event, index) => (
                    <div key={event.id} className="grid grid-cols-5 gap-4 text-sm p-3 border rounded bg-background">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                      </div>
                      <div className="font-medium">{event.activity}</div>
                      <div className="text-muted-foreground">{event.instructions}</div>
                      <div className="font-medium">{event.frequency}</div>
                      <div className="text-muted-foreground">{event.duration} min</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => onSelect?.(selectedTreatmentPlan)}
                    className="flex-1 h-12 text-base font-semibold"
                    size="lg"
                  >
                    Use This Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onCreateFromScratch?.()}
                    className="flex-1 h-12 text-base font-semibold"
                    size="lg"
                  >
                    <Plus size={16} className="mr-2" />
                    Create from Scratch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}