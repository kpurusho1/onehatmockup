import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CustomActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  activityOptions: string[];
}

export function CustomActivitySelect({ value, onChange, activityOptions }: CustomActivitySelectProps) {
  const [isCustom, setIsCustom] = useState(!activityOptions.includes(value) && value !== "");
  const [customValue, setCustomValue] = useState(isCustom ? value : "");

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setIsCustom(true);
      setCustomValue("");
      onChange("");
    } else {
      setIsCustom(false);
      setCustomValue("");
      onChange(selectedValue);
    }
  };

  const handleCustomChange = (customInput: string) => {
    setCustomValue(customInput);
    onChange(customInput);
  };

  if (isCustom) {
    return (
      <div className="space-y-2">
        <Input
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="Enter custom activity..."
          className="h-9"
        />
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Or select preset" />
          </SelectTrigger>
          <SelectContent>
            {activityOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder="Activity" />
      </SelectTrigger>
      <SelectContent>
        {activityOptions.map((option) => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
        <SelectItem value="custom">Custom Activity</SelectItem>
      </SelectContent>
    </Select>
  );
}