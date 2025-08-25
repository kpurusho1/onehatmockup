import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Building2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "mithra",
    password: "admin",
    hospital: "guru"
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate to mobile app
    navigate("/mobile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'hsl(var(--brand-teal))' }}>
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/src/assets/1hat-logo.png" alt="1hat" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to 1hat</h1>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-foreground">
              Sign in to your doctor account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Hospital */}
              <div className="space-y-2">
                <label htmlFor="hospital" className="text-sm font-medium text-foreground">
                  Hospital
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" size={20} />
                  <Select
                    value={credentials.hospital}
                    onValueChange={(value) => setCredentials(prev => ({ ...prev, hospital: value }))}
                    required
                  >
                    <SelectTrigger className="pl-10 h-12">
                      <SelectValue placeholder="Select your hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guru">Guru Hospital</SelectItem>
                      <SelectItem value="giri">Giri Hospital</SelectItem>
                      <SelectItem value="women-child">Women and Child Clinic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold"
                style={{ backgroundColor: 'hsl(var(--brand-navy))', color: 'white' }}
              >
                Sign In
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              <button className="text-sm text-primary hover:underline">
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground">
                Need help? Contact support at{" "}
                <a href="mailto:support@1hat.in" className="text-primary hover:underline">
                  support@1hat.in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}