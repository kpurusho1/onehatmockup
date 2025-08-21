import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const prescriptions = [
  {
    id: "215280",
    date: "Dec 27, 2023",
    time: "11:30 AM",
    hospital: "Guru Hospital",
    inTake: 0,
    expiryDate: "Dec 30, 2023",
    prescribedBy: "mithra",
    patientName: "Kumar",
    mobile: "9488091926",
    diagnosis: "Hypertension and Type 2 Diabetes",
    medications: [
      { name: "DOLIFF GEL-30G", dosage: "2 times daily", duration: "5 days" },
      { name: "ZERODOL P TAB", dosage: "1 tablet", duration: "10 days" },
      { name: "dolomite", dosage: "1 capsule", duration: "5 days" },
      { name: "ZERODOL P TAB", dosage: "2 tablets", duration: "6 days" },
      { name: "FUNGICROSS NAIL LACQUER", dosage: "Apply twice", duration: "2 weeks" }
    ]
  },
  {
    id: "215272",
    date: "Dec 12, 2023",
    time: "7:21 AM",
    hospital: "Guru Hospital",
    inTake: 0,
    expiryDate: "Dec 27, 2023",
    prescribedBy: "mithra",
    patientName: "Kumar",
    mobile: "9488091926",
    diagnosis: "Common Cold and Fever",
    medications: [
      { name: "Paracetamol 500mg", dosage: "1 tablet", duration: "3 days" },
      { name: "Cetirizine 10mg", dosage: "1 tablet", duration: "5 days" }
    ]
  },
  {
    id: "215251",
    date: "Dec 11, 2023",
    time: "7:18 AM",
    hospital: "Guru Hospital",
    inTake: 0,
    expiryDate: "Dec 26, 2023",
    prescribedBy: "mithra",
    patientName: "Kumar",
    mobile: "9488091926",
    diagnosis: "Gastritis",
    medications: [
      { name: "Omeprazole 20mg", dosage: "1 capsule", duration: "7 days" },
      { name: "Antacid syrup", dosage: "10ml", duration: "5 days" }
    ]
  },
  {
    id: "207122",
    date: "Dec 8, 2023",
    time: "4:23 PM",
    hospital: "Guru Hospital",
    inTake: 0,
    expiryDate: "Dec 26, 2023",
    prescribedBy: "mithra",
    patientName: "Parivel",
    mobile: "8954229999",
    diagnosis: "Allergic Rhinitis",
    medications: [
      { name: "Montelukast 10mg", dosage: "1 tablet", duration: "10 days" },
      { name: "Nasal spray", dosage: "2 puffs", duration: "7 days" }
    ]
  }
];

export default function Prescription() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prescription">My prescription</TabsTrigger>
          <TabsTrigger value="health-records">Shared Health Records</TabsTrigger>
          <TabsTrigger value="treatment-logs">Shared Treatment Logs</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescription" className="mt-6">
          <div className="space-y-0">
            {prescriptions.map((prescription, index) => {
              const isOpen = openItems.includes(prescription.id);
              return (
                <div key={prescription.id} className="flex">
                  {/* Timeline */}
                  <div className="flex flex-col items-center mr-6">
                    <div className="text-right min-w-[100px]">
                      <div className="text-sm font-medium text-foreground">{prescription.date}</div>
                      <div className="text-xs text-muted-foreground">{prescription.time}</div>
                    </div>
                    <div className="w-3 h-3 bg-success rounded-full mt-2 relative">
                      {index < prescriptions.length - 1 && (
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-border"></div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <Collapsible
                      open={isOpen}
                      onOpenChange={() => toggleItem(prescription.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{prescription.hospital}</h3>
                                <p className="text-sm text-muted-foreground">InTake: {prescription.inTake}</p>
                                <p className="text-sm text-muted-foreground">Expiry Date: {prescription.expiryDate}</p>
                                <p className="text-sm text-muted-foreground">Prescribed By: {prescription.prescribedBy}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Info size={14} />
                                </Button>
                                {isOpen ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="mt-4 space-y-4">
                          {/* Medical Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Medical Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div>
                                <span className="font-medium">Diagnosis:</span>
                                <p className="text-muted-foreground mt-1">{prescription.diagnosis}</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Prescribed Drugs Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Prescribed Drugs Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-2 font-medium">Medicine Name</th>
                                      <th className="text-left py-2 font-medium">Dosage</th>
                                      <th className="text-left py-2 font-medium">Duration</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {prescription.medications.map((med, medIndex) => (
                                      <tr key={medIndex} className="border-b last:border-b-0">
                                        <td className="py-2 text-foreground">{med.name}</td>
                                        <td className="py-2 text-muted-foreground">{med.dosage}</td>
                                        <td className="py-2 text-muted-foreground">{med.duration}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="health-records">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Shared health records will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatment-logs">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Shared treatment logs will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Your notes will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}