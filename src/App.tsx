import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { MobileLayout } from "./components/mobile/MobileLayout";

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
        
        {/* Redirect to login first */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Mobile App Route */}
        <Route path="/mobile" element={<MobileLayout />} />
        
        {/* Legacy routes redirected to mobile */}
        <Route path="/voice-health" element={<Navigate to="/mobile" replace />} />
        <Route path="/patient-protocols" element={<Navigate to="/mobile" replace />} />
        <Route path="/protocol-templates" element={<Navigate to="/mobile" replace />} />
        <Route path="/prescription" element={<Navigate to="/mobile" replace />} />
        <Route path="/profile" element={<Navigate to="/mobile" replace />} />
        <Route path="/desktop" element={<Navigate to="/mobile" replace />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
