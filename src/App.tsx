import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import VoiceHealthRecord from "./pages/VoiceHealthRecord";
import PatientTreatmentPlans from "./pages/PatientTreatmentPlans";
import TreatmentPlanTemplates from "./pages/TreatmentPlanTemplates";
import Prescription from "./pages/Prescription";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/patient-treatment-plans" replace />} />
          <Route path="voice-health" element={<VoiceHealthRecord />} />
          <Route path="patient-treatment-plans" element={<PatientTreatmentPlans />} />
          <Route path="treatment-plan-templates" element={<TreatmentPlanTemplates />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
