
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import "../styles/new-theme-toggle.css";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flamgio-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flamgio-theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-gray-600 shadow-lg">
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <button
              onClick={() => setLocation('/')}
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Flamingo AI
            </button>
            <div className="flex items-center space-x-1 ml-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Running</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="switch-small">
              <input type="checkbox" onChange={handleThemeToggle} />
              <span className="slider"></span>
            </label>
            <Button
              variant="outline"
              onClick={() => setLocation('/signup')}
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300">Sign in to your Flamingo AI account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation('/signup')}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
