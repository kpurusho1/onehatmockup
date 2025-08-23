import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ManualFrequencyData {
  startMonth: number;
  selectedDates: number[];
  dayFrequency: number;
  timeUnit: "hours" | "days";
}

interface ManualFrequencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ManualFrequencyData) => void;
  initialData?: ManualFrequencyData;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export function ManualFrequencyDialog({ 
  open, 
  onOpenChange, 
  onSave,
  initialData 
}: ManualFrequencyDialogProps) {
  const [startMonth, setStartMonth] = useState(initialData?.startMonth || 1);
  const [selectedDates, setSelectedDates] = useState<number[]>(initialData?.selectedDates || []);
  const [dayFrequency, setDayFrequency] = useState(initialData?.dayFrequency || 2);
  const [timeUnit, setTimeUnit] = useState<"hours" | "days">(initialData?.timeUnit || "hours");

  // Generate days for the month (simplified - using 31 days)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleDate = (date: number) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    onSave({
      startMonth,
      selectedDates,
      dayFrequency,
      timeUnit
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Manual Frequency</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Choose Frequency */}
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Choose Frequency</h3>
            
            {/* Start Month */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Enter start Month:
              </label>
              <Select value={startMonth.toString()} onValueChange={(value) => setStartMonth(Number(value))}>
                <SelectTrigger className="w-full h-12 border-2 border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Dates */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Select date:
              </label>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDate(day)}
                    className={cn(
                      "h-12 w-12 rounded-full border text-sm font-medium",
                      selectedDates.includes(day)
                        ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Days Frequency */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground">Days frequency</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Every</span>
                  <Select value={dayFrequency.toString()} onValueChange={(value) => setDayFrequency(Number(value))}>
                    <SelectTrigger className="w-20 h-8 border-2 border-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeUnit} onValueChange={(value: "hours" | "days") => setTimeUnit(value)}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-8"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}