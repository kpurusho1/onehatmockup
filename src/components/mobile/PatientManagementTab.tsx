import { useState } from "react";
import PatientProtocols from "@/pages/PatientProtocols";

export default function PatientManagementTab() {
  return (
    <div className="h-full">
      <PatientProtocols />
    </div>
  );
}