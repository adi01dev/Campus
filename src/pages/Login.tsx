import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [redirectRole, setRedirectRole] = useState<string | null>(null);

  // ✅ Safe redirect after login
  useEffect(() => {
    if (redirectRole) {
      // Use a micro delay to avoid React Router timing warnings
      const timeout = setTimeout(() => {
        const role = redirectRole;
        let path = "/";

        switch (role) {
          case "Admin":
            path = "/dashboard/admin";
            break;
          case "Faculty":
            path = "/dashboard/faculty";
            break;
          case "Student":
            path = "/dashboard/student";
            break;
          default:
            path = "/";
        }
        console.log(role);
        console.log(path);
        navigate(path);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [redirectRole, navigate]);

  // ✅ LOGIN FUNCTION — Connects to backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // ✅ Save tokens and user data locally
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Login successful!",
        description: `Welcome back, ${data.user.name}`,
      });

      // ✅ Set redirect role (handled safely in useEffect)
      setRedirectRole(data.user.role);

    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Unable to connect to the server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
      

  return (
    <div className="min-h-screen academic-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-glow animate-pulse-glow">
              <GraduationCap className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            CampusConnect
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Educational Excellence Management System
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-effect shadow-elegant border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Select Your Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger className="bg-background/50 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-background/50 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-background/50 border-2 hover:border-primary/50 focus:border-primary transition-colors pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                   
                </div>
              </div>


              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-lg shadow-elegant transition-all duration-300 hover:shadow-glow"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Use your assigned email and password provided by Admin.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help? Contact{" "}
            <Link to="/support" className="text-primary hover:text-primary-hover transition-colors">
              IT Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
