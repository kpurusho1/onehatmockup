import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, MapPin, Calendar, Stethoscope, Edit, Eye } from "lucide-react";

interface Medication {
  medicine: string;
  morning: string;
  noon: string;
  evening: string;
  night: string;
  duration: number;
  timeToTake: string;
  remarks: string;
}

interface Prescription {
  id: string;
  diagnosis: string;
  intakeScore: number;
  date: string;
  hasScannedCopy: boolean;
  medications: Medication[];
}

interface PrescriptionTimelineNewProps {
  prescriptions: Prescription[];
}

// Activity type colors
const getActivityColor = (type: string) => {
  switch (type) {
    case 'prescription':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'consultation':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'medication':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'checkup':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 text-white';
    case 'assigned':
      return 'bg-blue-500 text-white';
    case 'pending':
      return 'bg-yellow-500 text-white';
    case 'overdue':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export function PrescriptionTimelineNew({ prescriptions }: PrescriptionTimelineNewProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([prescriptions[0]?.id]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Group prescriptions by date
  const groupedByDate = prescriptions.reduce((acc, prescription) => {
    const date = prescription.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(prescription);
    return acc;
  }, {} as Record<string, Prescription[]>);

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
                <p className="text-sm text-muted-foreground">{groupedByDate[date].length} prescription(s)</p>
              </div>
            </div>
          </div>

          {/* Prescriptions for this date */}
          <div className="ml-12 space-y-4">
            {groupedByDate[date].map((prescription, index) => (
              <div key={prescription.id} className="relative">
                {/* Timeline connector */}
                {index !== groupedByDate[date].length - 1 && (
                  <div className="absolute -left-8 top-16 bottom-0 w-0.5 bg-border/50" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute -left-10 top-8 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                
                {/* Content */}
                <div className="pb-6">
                  <Collapsible 
                    open={expandedItems.includes(prescription.id)}
                    onOpenChange={() => toggleItem(prescription.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge 
                                  className={`px-3 py-1 rounded-full border ${getActivityColor('prescription')}`}
                                  variant="outline"
                                >
                                  Prescription
                                </Badge>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('assigned')}`}>
                                  Assigned
                                </div>
                              </div>
                              <h4 className="font-medium mb-1">{prescription.diagnosis}</h4>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Stethoscope size={14} />
                                  <span>Rx ID: {prescription.id}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Intake Score: {prescription.intakeScore}%</span>
                                </div>
                                {prescription.hasScannedCopy && (
                                  <Badge variant="secondary" className="text-xs">
                                    Scanned Copy Available
                                  </Badge>
                                )}
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
                              {expandedItems.includes(prescription.id) ? (
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
                      <Card className="mt-2 border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Diagnosis</h5>
                              <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-3">Medications</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border rounded-lg">
                                  <thead>
                                    <tr className="border-b bg-muted/50">
                                      <th className="text-left py-2 px-3 font-medium">Medicine</th>
                                      <th className="text-left py-2 px-3 font-medium">Morning</th>
                                      <th className="text-left py-2 px-3 font-medium">Noon</th>
                                      <th className="text-left py-2 px-3 font-medium">Evening</th>
                                      <th className="text-left py-2 px-3 font-medium">Night</th>
                                      <th className="text-left py-2 px-3 font-medium">Duration</th>
                                      <th className="text-left py-2 px-3 font-medium">Instructions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {prescription.medications.map((med, idx) => (
                                      <tr key={idx} className="border-b">
                                        <td className="py-2 px-3">{med.medicine}</td>
                                        <td className="py-2 px-3">{med.morning}</td>
                                        <td className="py-2 px-3">{med.noon}</td>
                                        <td className="py-2 px-3">{med.evening}</td>
                                        <td className="py-2 px-3">{med.night}</td>
                                        <td className="py-2 px-3">{med.duration} days</td>
                                        <td className="py-2 px-3">
                                          <div className="space-y-1">
                                            <div>{med.timeToTake}</div>
                                            <div className="text-xs text-muted-foreground">{med.remarks}</div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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