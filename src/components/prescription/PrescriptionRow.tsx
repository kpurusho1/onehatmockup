import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Camera } from "lucide-react";

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
  defaultOpen?: boolean;
}

export function PrescriptionRow({ prescription, defaultOpen = false }: PrescriptionRowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
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
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  prescription.intakeScore >= 80 
                    ? 'border-green-500 bg-green-500/10' 
                    : prescription.intakeScore >= 60 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-red-500 bg-red-500/10'
                } ${
                  prescription.intakeScore >= 80 
                    ? 'text-green-600' 
                    : prescription.intakeScore >= 60 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                } text-sm font-bold`}>
                  {prescription.intakeScore}%
                </div>
              </div>
              <div className="p-2 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer" title="View Scanned Prescription">
                <Camera size={16} className="text-muted-foreground" />
              </div>
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