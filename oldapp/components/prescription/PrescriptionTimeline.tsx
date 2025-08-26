import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, MapPin, Calendar, Stethoscope } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  date: string;
  time: string;
  hospital: string;
  location: string;
  diagnosis: string;
  medications: Medication[];
}

interface PrescriptionTimelineProps {
  prescriptions: Prescription[];
}

export function PrescriptionTimeline({ prescriptions }: PrescriptionTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription, index) => (
        <div key={prescription.id} className="relative">
          {/* Timeline line */}
          {index !== prescriptions.length - 1 && (
            <div className="absolute left-4 top-16 bottom-0 w-0.5 bg-border" />
          )}
          
          {/* Timeline dot */}
          <div className="absolute left-2.5 top-8 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          
          {/* Content */}
          <div className="ml-10 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">{prescription.date}</div>
                <div className="text-sm text-muted-foreground">{prescription.time}</div>
              </div>
            </div>
            
            <Collapsible 
              open={expandedItems.includes(prescription.id)}
              onOpenChange={() => toggleItem(prescription.id)}
            >
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{prescription.hospital}</h4>
                          <Badge variant="secondary">Prescription</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{prescription.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Stethoscope size={14} />
                            <span>{prescription.diagnosis}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
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
                <Card className="mt-2 border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Hospital Details</h5>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Name:</strong> {prescription.hospital}</p>
                          <p><strong>Location:</strong> {prescription.location}</p>
                          <p><strong>Date:</strong> {prescription.date} at {prescription.time}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Diagnosis</h5>
                        <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">Medications</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Medicine Name</th>
                                <th className="text-left py-2">Dosage</th>
                                <th className="text-left py-2">Frequency</th>
                                <th className="text-left py-2">Duration</th>
                                <th className="text-left py-2">Instructions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prescription.medications.map((med) => (
                                <tr key={med.id} className="border-b">
                                  <td className="py-2">{med.name}</td>
                                  <td className="py-2">{med.dosage}</td>
                                  <td className="py-2">{med.frequency}</td>
                                  <td className="py-2">{med.duration}</td>
                                  <td className="py-2">{med.instructions}</td>
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
  );
}