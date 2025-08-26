import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Phone, Calendar, Plus, Activity, TrendingUp, Clock, Users } from "lucide-react";
import patientGenericAvatar from "@/assets/patient-generic-avatar.jpg";

const patients = [
  {
    id: 1,
    name: "Arjun Patel",
    phone: "8954229999",
    adherence: 85,
    treatmentAdherence: 85,
    avatar: patientGenericAvatar,
    lastVisit: "Aug 4, 2025",
    diagnosis: "Knee Surgery Recovery",
    protocols: [
      {
        id: 1,
        name: "Knee Surgery Recovery Protocol",
        activities: "2/4",
        progress: 65,
        week: "Week 4 of 8",
        status: "active"
      },
      {
        id: 2,
        name: "Post-Surgery Mobility Protocol", 
        activities: "1/3",
        progress: 25,
        week: "Week 1 of 4",
        status: "active"
      }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "6382214165",
    adherence: 92,
    treatmentAdherence: 88,
    avatar: patientGenericAvatar,
    lastVisit: "Jul 25, 2025",
    diagnosis: "Diabetes Management",
    protocols: [
      {
        id: 3,
        name: "Diabetes Care Protocol",
        activities: "3/4",
        progress: 75,
        week: "Week 6 of 12",
        status: "active"
      }
    ]
  },
  {
    id: 3,
    name: "Rahul Gupta",
    phone: "9488091926",
    adherence: 78,
    treatmentAdherence: 82,
    avatar: patientGenericAvatar,
    lastVisit: "Aug 1, 2025",
    diagnosis: "Hypertension Management",
    protocols: [
      {
        id: 4,
        name: "Blood Pressure Control",
        activities: "2/2",
        progress: 95,
        week: "Week 8 of 8",
        status: "completed"
      }
    ]
  }
];

const mockActivities = [
  {
    id: "1",
    date: "2025-08-23",
    day: "Saturday",
    daysOverdue: 1,
    activity: "Medication",
    instructions: "Take medication with food to prevent stomach upset",
    status: "overdue"
  },
  {
    id: "2", 
    date: "2025-08-24",
    day: "Sunday",
    daysOverdue: 0,
    activity: "Exercise",
    instructions: "Start with light weights and gradually increase intensity",
    status: "overdue"
  }
];

export default function PatientManagementTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [view, setView] = useState<"search" | "details">("search");

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setView("details");
  };

  const handleBack = () => {
    setView("search");
    setSelectedPatient(null);
  };

  if (view === "details" && selectedPatient) {
    return (
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Patients
        </Button>

        {/* Patient Header */}
        <div className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1c2f7f' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">{selectedPatient.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedPatient.name}</h2>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Phone size={12} />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Calendar size={12} />
                  <span>Last visit: {selectedPatient.lastVisit}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button size="sm" className="bg-white text-blue-800 hover:bg-white/90">
                <Plus size={14} className="mr-1" />
                Create Rx
              </Button>
              <Button size="sm" className="bg-white text-blue-800 hover:bg-white/90">
                <Plus size={14} className="mr-1" />
                Create Treatment Plan
              </Button>
            </div>
          </div>

          {/* Progress Circles */}
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray={`${selectedPatient.adherence}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{selectedPatient.adherence}%</span>
                </div>
              </div>
              <p className="text-xs text-white/80 text-center">Rx Intake</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray={`${selectedPatient.treatmentAdherence}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{selectedPatient.treatmentAdherence}%</span>
                </div>
              </div>
              <p className="text-xs text-white/80 text-center">Treatment<br/>Adherence</p>
            </div>
          </div>
        </div>

        {/* Treatment Protocols */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Treatment Protocols ({selectedPatient.protocols.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPatient.protocols.map((protocol: any) => (
              <div key={protocol.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{protocol.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{protocol.week} • {protocol.status}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${protocol.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{protocol.activities} activities</span>
                      <span className="text-orange-600 font-medium">{protocol.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp size={14} className="mr-1" />
                      Update Instructions
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Plan
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock size={20} />
                Overdue Activities (2)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{activity.date}</span>
                      <span className="text-sm text-muted-foreground">{activity.day}</span>
                      <Badge variant="destructive" className="text-xs">
                        {activity.daysOverdue} day{activity.daysOverdue > 1 ? 's' : ''} overdue
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {activity.activity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.instructions}</p>
                  </div>
                  <Badge variant="destructive">overdue</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
        <h2 className="text-2xl font-bold mb-2">Patient Management</h2>
        <p className="text-muted-foreground">Search and manage patient treatments</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone number"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePatientSelect(patient)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#26bc9f] rounded-full flex items-center justify-center text-white font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                    <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{patient.adherence}%</div>
                  <div className="text-xs text-muted-foreground">Adherence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Patient Button */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plus size={24} className="text-primary" />
            </div>
            <h3 className="font-medium">Add New Patient</h3>
            <p className="text-sm text-muted-foreground">Create a new patient profile</p>
            <Button className="mt-2" style={{backgroundColor: '#1c2f7f'}}>
              Add Patient
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}