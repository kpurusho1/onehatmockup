import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { MobileLayout } from "./components/mobile/MobileLayout";
import MobileApp from "./pages/MobileApp";
import Login from "./pages/Login";
import VoiceHealthRecord from "./pages/VoiceHealthRecord";
import PatientProtocols from "./pages/PatientProtocols";
import ProtocolTemplates from "./pages/ProtocolTemplates";
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
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* App Selector */}
        <Route path="/" element={<MobileApp />} />
        
        {/* Mobile App Route */}
        <Route path="/mobile" element={<MobileLayout />} />
        
        {/* Desktop Routes */}
        <Route path="/desktop" element={<Layout />}>
          <Route index element={<Navigate to="/desktop/patient-protocols" replace />} />
          <Route path="voice-health" element={<VoiceHealthRecord />} />
          <Route path="patient-protocols" element={<PatientProtocols />} />
          <Route path="protocol-templates" element={<ProtocolTemplates />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Legacy desktop routes for backward compatibility */}
        <Route path="/voice-health" element={<Navigate to="/desktop/voice-health" replace />} />
        <Route path="/patient-protocols" element={<Navigate to="/desktop/patient-protocols" replace />} />
        <Route path="/protocol-templates" element={<Navigate to="/desktop/protocol-templates" replace />} />
        <Route path="/prescription" element={<Navigate to="/desktop/prescription" replace />} />
        <Route path="/profile" element={<Navigate to="/desktop/profile" replace />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
