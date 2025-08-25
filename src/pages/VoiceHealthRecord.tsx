import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function VoiceHealthRecord() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Voice Health Record</h1>
        <p className="text-muted-foreground">Voice-based patient data collection and analysis</p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mic size={32} className="text-primary" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Voice health record functionality will be available in the next update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}