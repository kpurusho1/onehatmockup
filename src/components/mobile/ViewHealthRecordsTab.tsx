import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function ViewHealthRecordsTab() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">View Health Records</h2>
        <p className="text-muted-foreground">Patient health records and history</p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Eye size={32} className="text-primary" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Health records viewing functionality will be available in the next update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}