import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, ChevronRight } from "lucide-react";
import { CreatePrescription } from "./CreatePrescription";

interface PrescriptionRecord {
  id: string;
  date: string;
  patientName: string;
  mobile: string;
  doctorAssigned: string;
}

// Mock prescription records data for table view
const prescriptionRecords: PrescriptionRecord[] = [
  {
    id: "215280",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra"
  },
  {
    id: "215272",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra"
  },
  {
    id: "215251",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra"
  },
  {
    id: "207122",
    date: "01/08/2025",
    patientName: "Parivel",
    mobile: "8954229999",
    doctorAssigned: "Mithra"
  },
  {
    id: "197367",
    date: "28/07/2025",
    patientName: "Test Patient 5",
    mobile: "3333334444",
    doctorAssigned: "Mithra"
  },
  {
    id: "196980",
    date: "26/07/2025",
    patientName: "J Pranav",
    mobile: "9092228810",
    doctorAssigned: "Mithra"
  },
  {
    id: "195729",
    date: "25/07/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra"
  },
  {
    id: "195738",
    date: "25/07/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra"
  },
  {
    id: "128382",
    date: "30/06/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra"
  },
  {
    id: "70360",
    date: "12/06/2025",
    patientName: "Mahi",
    mobile: "8667082808",
    doctorAssigned: "Mithra"
  }
];

export default function Prescription() {
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);

  const handleView = (record: PrescriptionRecord) => {
    setSelectedPrescription(record);
    setViewMode('view');
  };

  const handleEdit = (record: PrescriptionRecord) => {
    setSelectedPrescription(record);
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedPrescription(null);
  };

  if (viewMode !== 'list' && selectedPrescription) {
    return (
      <CreatePrescription
        patientName={selectedPrescription.patientName}
        patientPhone={selectedPrescription.mobile}
        onBack={handleBack}
        mode={viewMode}
        prescriptionData={{
          id: selectedPrescription.id,
          date: selectedPrescription.date,
          doctorAssigned: selectedPrescription.doctorAssigned
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to 1hat, Mithra</h1>
          <p className="text-muted-foreground mt-2">All Prescription <ChevronRight size={16} className="inline" /></p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input 
                placeholder="Search by mobile number" 
                className="w-64"
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm">Sort By</span>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-primary-foreground hover:bg-primary/90">
                <TableHead className="text-primary-foreground">Prescription ID</TableHead>
                <TableHead className="text-primary-foreground">Date (DD/MM/YYYY)</TableHead>
                <TableHead className="text-primary-foreground">Patient Name</TableHead>
                <TableHead className="text-primary-foreground">Mobile</TableHead>
                <TableHead className="text-primary-foreground">Doctor Assigned</TableHead>
                <TableHead className="text-primary-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptionRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.mobile}</TableCell>
                  <TableCell>{record.doctorAssigned}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Items per page: 10</span>
            <span>1 - 10 of 90</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}