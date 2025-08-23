import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StartDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (startDate: Date) => void;
  frequency: string;
}

export function StartDateDialog({ 
  open, 
  onOpenChange, 
  onSave,
  frequency 
}: StartDateDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSave = () => {
    onSave(selectedDate);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const getTitle = () => {
    if (frequency.includes("Weekly")) {
      return "Select Start Week";
    }
    return "Select Start Day";
  };

  const getDescription = () => {
    if (frequency.includes("Weekly")) {
      return "Choose the week when this activity should start";
    }
    return "Choose the day when this activity should start";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{getTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("rounded-md border pointer-events-auto")}
              initialFocus
            />
          </div>

          {selectedDate && (
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">
                Selected: {format(selectedDate, "PPPP")}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Confirm Start Date
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}