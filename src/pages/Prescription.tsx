import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar,
  Edit,
  Eye,
  Phone,
  Filter
} from "lucide-react";

const prescriptions = [
  {
    id: "215280",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "215272",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "215251",
    date: "05/08/2025",
    patientName: "Kumar",
    mobile: "9488091926",
    doctorAssigned: "Mithra",
    status: "Completed"
  },
  {
    id: "207122",
    date: "01/08/2025",
    patientName: "Parivel",
    mobile: "8954229999",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "197367",
    date: "28/07/2025",
    patientName: "Test Patient S",
    mobile: "3333334444",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "196980",
    date: "26/07/2025",
    patientName: "J Pranav",
    mobile: "9092228810",
    doctorAssigned: "Mithra",
    status: "Completed"
  },
  {
    id: "195729",
    date: "25/07/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "195738",
    date: "25/07/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra",
    status: "Active"
  },
  {
    id: "128382",
    date: "30/06/2025",
    patientName: "Ashwin",
    mobile: "6382214165",
    doctorAssigned: "Mithra",
    status: "Completed"
  },
  {
    id: "70360",
    date: "12/06/2025",
    patientName: "Mahi",
    mobile: "8667082808",
    doctorAssigned: "Mithra",
    status: "Active"
  }
];

export default function Prescription() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Recent");

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.mobile.includes(searchTerm) ||
    prescription.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-success" : "bg-muted";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Prescriptions</h1>
          <p className="text-muted-foreground">Manage and track patient prescriptions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prescriptions</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort By:</span>
              <select 
                className="text-sm border rounded-md px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Recent</option>
                <option>Patient Name</option>
                <option>Date</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by mobile number, patient name or prescription ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-primary text-primary-foreground font-medium text-sm">
            <div>Prescription ID</div>
            <div>Date (DD/MM/YYYY)</div>
            <div>Patient Name</div>
            <div>Mobile</div>
            <div>Doctor Assigned</div>
            <div>Action</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="grid grid-cols-6 gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="font-medium">{prescription.id}</div>
                <div className="text-muted-foreground">{prescription.date}</div>
                <div>{prescription.patientName}</div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Phone size={12} />
                  <span>{prescription.mobile}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{prescription.doctorAssigned}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(prescription.status)}`} />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-info text-info-foreground hover:bg-info/90">
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Items per page: 10
            </div>
            <div className="text-sm text-muted-foreground">
              1 – 10 of {filteredPrescriptions.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}