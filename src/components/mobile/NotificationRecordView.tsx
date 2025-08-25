import MedicalSummaryView from "@/components/shared/MedicalSummaryView";
import { useToast } from "@/hooks/use-toast";

interface NotificationRecordViewProps {
  patientName: string;
  recordId: string;
  onBack: () => void;
}

export default function NotificationRecordView({ patientName, recordId, onBack }: NotificationRecordViewProps) {
  const { toast } = useToast();

  // Convert mock data to the format expected by MedicalSummaryView
  const medicalRecord = {
    id: recordId,
    patientId: "1",
    keyFacts: "Patient reports persistent headaches for the past 2 weeks. Pain is described as throbbing, located in the frontal region. Associated with mild nausea and sensitivity to light. No fever or recent trauma reported.",
    medications: [
      {
        id: "1",
        name: "Cefixime",
        morning: 1,
        noon: 0,
        evening: 1,
        night: 0,
        duration: 7,
        timeToTake: "After meals",
        remarks: "Oral antibiotic, 200mg BD, morning one, evening one, for seven days, finish a course. Important to complete full course even if symptoms improve."
      },
      {
        id: "2",
        name: "Drotin", 
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 3,
        timeToTake: "As needed",
        remarks: "Keep Drotin for only three days. After three days, if there is pain, then put it in, otherwise, stop it. Take only when experiencing severe pain."
      },
      {
        id: "3",
        name: "Urimax 0.4",
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        duration: 7,
        timeToTake: "Before bedtime",
        remarks: "Alpha blocker. This is what will help you pass out the stone. This can be kept for seven days. Take consistently at the same time each day."
      }
    ],
    nextSteps: "Follow up in 1 week if symptoms persist. Maintain headache diary to track triggers. Ensure adequate sleep and hydration. Consider stress management techniques.",
    recordDate: "25 Aug 2025"
  };

  const diagnosis = "Primary headache disorder, likely tension-type headache with possible migraine features. Recommend neurological evaluation if symptoms persist.";

  const handleSave = (record: any) => {
    toast({
      title: "Record saved!",
      description: "The medical record has been saved successfully.",
    });
  };

  const handleSend = (record: any, sections: any) => {
    toast({
      title: "Records sent successfully!",
      description: `The medical record has been sent to ${patientName}.`,
    });
  };

  return (
    <MedicalSummaryView
      medicalRecord={medicalRecord}
      diagnosis={diagnosis}
      onBack={onBack}
      onSave={handleSave}
      onSend={handleSend}
      patientName={patientName}
      recordId={recordId}
      date="25 Aug 2025"
      isEditable={true}
      showCreateRx={true}
    />
  );
}