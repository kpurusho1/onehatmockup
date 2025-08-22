import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

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

interface PrescriptionData {
  id: string;
  diagnosis: string;
  intakeScore: number;
  date: string;
  medications: Medication[];
}

interface PrescriptionRowProps {
  prescription: PrescriptionData;
}

export function PrescriptionRow({ prescription }: PrescriptionRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const getIntakeScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-4">
              {isOpen ? (
                <ChevronDown size={16} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
              <div className="text-left">
                <h4 className="font-semibold">{prescription.diagnosis}</h4>
                <p className="text-sm text-muted-foreground">{prescription.date}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">Intake Score</p>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getIntakeScoreColor(prescription.intakeScore)} text-white text-xs font-bold`}>
                  {prescription.intakeScore}%
                </div>
              </div>
              <Badge variant="outline">View Details</Badge>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4 border-t bg-muted/20">
            <div className="space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground bg-muted p-2 rounded">
                <div>Medicine</div>
                <div>Morning</div>
                <div>Noon</div>
                <div>Evening</div>
                <div>Night</div>
                <div>Duration (Days)</div>
                <div>Time to Take</div>
                <div>Remarks</div>
              </div>
              
              {/* Medication Rows */}
              {prescription.medications.map((medication, index) => (
                <div key={index} className="grid grid-cols-8 gap-4 text-sm p-2 border rounded">
                  <div className="font-medium">{medication.medicine}</div>
                  <div>{medication.morning}</div>
                  <div>{medication.noon}</div>
                  <div>{medication.evening}</div>
                  <div>{medication.night}</div>
                  <div>{medication.duration}</div>
                  <div>{medication.timeToTake}</div>
                  <div>{medication.remarks}</div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}