import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StartDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (startDate: Date | number) => void;
  frequency: string;
  mode?: 'date' | 'day';
}

export function StartDateDialog({ 
  open, 
  onOpenChange, 
  onSave,
  frequency,
  mode = 'date'
}: StartDateDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDay, setStartDay] = useState<number>(1);

  const handleSave = () => {
    if (mode === 'day') {
      onSave(startDay);
    } else {
      onSave(selectedDate);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const getTitle = () => {
    if (mode === 'day') {
      if (frequency.includes("Weekly")) {
        return "Select Start Week";
      }
      return "Select Start Day";
    } else {
      if (frequency.includes("Weekly")) {
        return "Select Start Week";
      }
      return "Select Start Date";
    }
  };

  const getDescription = () => {
    if (mode === 'day') {
      if (frequency.includes("Weekly")) {
        return "Choose which week this activity should start";
      }
      return "Choose which day this activity should start";
    } else {
      if (frequency.includes("Weekly")) {
        return "Choose the week when this activity should start";
      }
      return "Choose the date when this activity should start";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{getTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'day' ? (
            <div className="space-y-2">
              <Label htmlFor="startDay">
                {frequency.includes("Weekly") ? "Start Week" : "Start Day"}
              </Label>
              <Input
                id="startDay"
                type="number"
                min="1"
                max="365"
                value={startDay}
                onChange={(e) => setStartDay(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="1"
                className="h-12 text-center text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground">
                {frequency.includes("Weekly") 
                  ? "Week 1 = Start immediately. Week 2+ = Start after specified weeks." 
                  : "Day 1 = Start immediately. Day 2+ = Start after specified days."
                }
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {mode === 'day' 
                ? (frequency.includes("Weekly") ? "Confirm Start Week" : "Confirm Start Day")
                : "Confirm Start Date"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}