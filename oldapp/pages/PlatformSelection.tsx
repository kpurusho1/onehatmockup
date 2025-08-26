import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor } from "lucide-react";

const PlatformSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to 1HAT</h1>
          <p className="text-muted-foreground">Choose your preferred interface</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mobile Interface Card */}
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Mobile Interface</CardTitle>
              <CardDescription>
                Optimized for smartphones and tablets. Perfect for on-the-go patient care.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Voice-powered health records</li>
                <li>• Quick patient management</li>
                <li>• Streamlined prescriptions</li>
                <li>• Touch-friendly interface</li>
              </ul>
              <Button 
                onClick={() => navigate("/login?platform=mobile")}
                className="w-full"
              >
                Choose Mobile
              </Button>
            </CardContent>
          </Card>

          {/* Desktop Interface Card */}
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Desktop Interface</CardTitle>
              <CardDescription>
                Full-featured desktop experience with comprehensive patient management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Advanced treatment planning</li>
                <li>• Detailed patient protocols</li>
                <li>• Protocol templates management</li>
                <li>• Comprehensive analytics</li>
              </ul>
              <Button 
                onClick={() => navigate("/desktop")}
                className="w-full"
              >
                Choose Desktop
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelection;