import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

export default function PrescriptionsTab() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">All Prescriptions</h2>
        <p className="text-muted-foreground">Manage and view all patient prescriptions</p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Pill size={32} className="text-primary" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Prescription management functionality will be available in the next update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}