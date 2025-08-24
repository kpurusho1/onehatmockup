import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileApp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Smartphone size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">OneHat Medical</CardTitle>
          <p className="text-muted-foreground">Choose your interface</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/mobile')}
            className="w-full flex items-center gap-3 h-12"
            size="lg"
          >
            <Smartphone size={20} />
            Mobile App Interface
          </Button>
          
          <Button 
            onClick={() => navigate('/patient-protocols')}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
            size="lg"
          >
            <Monitor size={20} />
            Desktop Interface
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}