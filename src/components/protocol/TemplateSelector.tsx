import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowLeft,
  FileText,
  Clock,
  Activity
} from "lucide-react";

const protocolTemplates = [
  {
    id: 1,
    name: "Knee Surgery Recovery",
    description: "Comprehensive recovery protocol for knee surgery patients",
    duration: "8 weeks",
    activities: 12,
    category: "Orthopedic",
    events: [
      {
        id: "1",
        activity: "Physiotherapy",
        subActivity: "Physiotherapy Knee Exercises",
        frequency: "Daily",
        duration: "30",
        description: "Range of motion exercises to improve knee flexibility",
        instructions: "Perform 3 sets of 10 repetitions, hold each position for 5 seconds",
        patientAction: "complete-exercise",
        doctorAction: "review-report"
      },
      {
        id: "2",
        activity: "Consultation",
        subActivity: "Follow-up",
        frequency: "Weekly",
        duration: "30",
        description: "Regular check-up to monitor recovery progress",
        instructions: "Come prepared with any concerns or questions",
        patientAction: "book-appointment",
        doctorAction: "provide-feedback"
      }
    ]
  },
  {
    id: 2,
    name: "Post-Operative Care",
    description: "Standard post-operative monitoring and recovery protocol",
    duration: "4 weeks",
    activities: 8,
    category: "General Surgery",
    events: []
  },
  {
    id: 3,
    name: "Diabetes Management",
    description: "Comprehensive diabetes care and monitoring protocol",
    duration: "12 weeks",
    activities: 15,
    category: "Endocrinology",
    events: []
  },
  {
    id: 4,
    name: "Cardiac Rehabilitation",
    description: "Heart health recovery and lifestyle modification program",
    duration: "16 weeks",
    activities: 20,
    category: "Cardiology",
    events: []
  },
  {
    id: 5,
    name: "Physical Therapy - General",
    description: "General physical therapy protocol for mobility improvement",
    duration: "6 weeks",
    activities: 10,
    category: "Physiotherapy",
    events: []
  }
];

interface TemplateSelectorProps {
  onSelect: (template: any) => void;
  onCancel: () => void;
}

export function TemplateSelector({ onSelect, onCancel }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(protocolTemplates.map(t => t.category))];

  const filteredTemplates = protocolTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Protocol Builder
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Choose Protocol Template</h2>
            <p className="text-muted-foreground">Select a template to customize for your patient</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {template.category}
                  </Badge>
                </div>
                <FileText className="text-muted-foreground" size={20} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock size={14} />
                  <span>{template.duration}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Activity size={14} />
                  <span>{template.activities} activities</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => onSelect(template)}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No templates found matching your search</p>
        </div>
      )}
    </div>
  );
}