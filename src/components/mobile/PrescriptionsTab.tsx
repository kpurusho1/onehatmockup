import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus, Activity, Clock, Edit, Trash2, Play } from "lucide-react";
import { BlockEditor } from "@/components/protocol/BlockEditor";
import { FullScreenProtocolEditor } from "@/components/protocol/FullScreenProtocolEditor";
import doctorConsultation from "@/assets/doctor-consultation.jpg";
import physiotherapy from "@/assets/physiotherapy.jpg";
import medicalEquipment from "@/assets/medical-equipment.jpg";

const templates = [
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
      { id: "1", activity: "Exercise", instructions: "Jog in the morning", frequency: "Daily", duration: 15, startDay: 1 },
      { id: "2", activity: "Consultation", instructions: "Follow-up visit", frequency: "Weekly", duration: 1, startDay: 7 },
      { id: "3", activity: "Physiotherapy", instructions: "Knee strengthening exercises", frequency: "Twice weekly", duration: 5, startDay: 3 }
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
      { id: "1", activity: "Consultation", instructions: "Blood Sugar Check", frequency: "Weekly", duration: 1, startDay: 1 },
      { id: "2", activity: "Exercise", instructions: "Walking", frequency: "Daily", duration: 30, startDay: 2 },
      { id: "3", activity: "Diet", instructions: "Meal Planning", frequency: "Daily", duration: 1, startDay: 1 },
      { id: "4", activity: "Medication", instructions: "Insulin", frequency: "Twice daily", duration: 1, startDay: 1 }
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
      { id: "1", activity: "Exercise", instructions: "Light Cardio", frequency: "Daily", duration: 20, startDay: 1 },
      { id: "2", activity: "Consultation", instructions: "BP Monitoring", frequency: "Bi-weekly", duration: 1, startDay: 14 }
    ]
  }
];

const mockPatients = [
  { id: 1, name: "Arjun Patel" },
  { id: 2, name: "Priya Sharma" },
  { id: 3, name: "Rahul Gupta" }
];

export default function PrescriptionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [view, setView] = useState<"list" | "details" | "edit" | "assign">("list");
  const [events, setEvents] = useState<any[]>([]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setView("details");
  };

  const handleBack = () => {
    if (view === "details") {
      setView("list");
      setSelectedTemplate(null);
    } else if (view === "edit") {
      setView("details");
    } else if (view === "assign") {
      setView("details");
    } else {
      setView("list");
    }
  };

  const handleEdit = () => {
    setEvents(selectedTemplate.activities_list.map((activity: any) => ({
      ...activity,
      startDay: activity.startDay || 1
    })));
    setView("edit");
  };

  const handleAssign = () => {
    setView("assign");
  };

  const handleSaveChanges = () => {
    console.log("Saving template changes:", events);
    setView("details");
  };

  const handleSaveAssignment = (protocol: any) => {
    console.log("Assigning protocol:", protocol);
    setView("list");
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setEvents([]);
    setView("edit");
  };

  if (view === "assign") {
    return (
      <FullScreenProtocolEditor
        patientName=""
        protocolName={selectedTemplate?.name}
        events={selectedTemplate?.activities_list || []}
        onSave={handleSaveAssignment}
        onCancel={handleBack}
        mode="assign"
      />
    );
  }

  if (view === "edit") {
    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to {selectedTemplate ? 'Details' : 'Templates'}
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedTemplate ? `Edit: ${selectedTemplate.name}` : 'Create New Template'}
            </h1>
            <p className="text-muted-foreground">
              {selectedTemplate ? 'Edit template activities' : 'Create a new treatment template'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} style={{backgroundColor: '#1c2f7f'}}>
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Treatment Activities</CardTitle>
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

  if (view === "details" && selectedTemplate) {
    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Templates
        </Button>

        {/* Template Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                  <Badge variant="secondary">{selectedTemplate.duration}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{selectedTemplate.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Created By</p>
                    <p className="text-muted-foreground">{selectedTemplate.createdBy}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Activities</p>
                    <p className="text-muted-foreground">{selectedTemplate.activities}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
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
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedTemplate.activities_list.map((activity: any, index: number) => (
              <div key={activity.id} className="border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{activity.activity}</h3>
                      <Badge variant="outline" className="text-xs">{activity.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{activity.instructions}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Duration: {activity.duration} days</span>
                      {activity.startDay && <span>Start Day: {activity.startDay}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleAssign} className="w-full h-12 text-base font-semibold" style={{backgroundColor: '#1c2f7f'}}>
            <Play size={16} className="mr-2" />
            Assign to Patient
          </Button>
          <Button variant="outline" onClick={handleEdit} className="w-full h-12 text-base font-semibold">
            <Edit size={16} className="mr-2" />
            Edit Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4">
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Treatment Templates</h2>
        <p className="text-muted-foreground">Browse and manage treatment protocols</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Templates List */}
      <div className="space-y-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(template)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity size={12} />
                      <span>{template.activities} activities</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{template.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.createdBy}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Template Button */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plus size={24} className="text-primary" />
            </div>
            <h3 className="font-medium">Create New Template</h3>
            <p className="text-sm text-muted-foreground">Build a custom treatment protocol</p>
            <Button className="mt-2" style={{backgroundColor: '#1c2f7f'}} onClick={handleCreateNew}>
              Create Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}