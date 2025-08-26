import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  activities: number;
  duration: string;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Knee Surgery Recovery",
    description: "Comprehensive rehabilitation protocol for post-knee surgery patients",
    activities: 3,
    duration: "6 weeks",
  },
  {
    id: 2,
    name: "Diabetes Management", 
    description: "Complete diabetes care protocol with diet and exercise guidance",
    activities: 4,
    duration: "12 weeks",
  },
  {
    id: 3,
    name: "Hypertension Protocol",
    description: "Blood pressure management with lifestyle modifications",
    activities: 2,
    duration: "8 weeks",
  }
];

interface TemplateDropdownProps {
  onSelectTemplate: (template: Template) => void;
  onCreateFromScratch: () => void;
}

export function TemplateDropdown({ onSelectTemplate, onCreateFromScratch }: TemplateDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add New Protocol
          <ChevronDown size={16} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Choose Template</div>
          {templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              className="flex flex-col items-start p-3 cursor-pointer"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {template.activities} activities • {template.duration}
              </div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </div>
            </DropdownMenuItem>
          ))}
          <div className="border-t my-2" />
          <DropdownMenuItem 
            className="font-medium p-3 cursor-pointer"
            onClick={onCreateFromScratch}
          >
            <Plus size={16} className="mr-2" />
            Create from Scratch
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}