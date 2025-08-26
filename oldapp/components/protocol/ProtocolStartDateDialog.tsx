import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";

interface ProtocolStartDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDay: number) => void;
  templateName: string;
}

export function ProtocolStartDateDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  templateName 
}: ProtocolStartDateDialogProps) {
  const [startDay, setStartDay] = useState(0);

  const handleConfirm = () => {
    onConfirm(startDay);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Set Protocol Start Day</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Configure when "{templateName}" should begin for this patient
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CalendarIcon className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium">Protocol Start Configuration</p>
              <p className="text-xs text-muted-foreground mt-1">
                This will adjust activity durations and timelines accordingly
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDay">Start Protocol from Day</Label>
              <Input
                id="startDay"
                type="number"
                min="0"
                max="365"
                value={startDay}
                onChange={(e) => setStartDay(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="h-12 text-center text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Day 0 = Start immediately. Day 1+ = Start after specified days.
              </p>
            </div>

            {startDay > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Protocol will start {startDay} day{startDay !== 1 ? 's' : ''} from now. 
                  All activity durations and schedules will be adjusted accordingly.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Continue to Personalization
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}