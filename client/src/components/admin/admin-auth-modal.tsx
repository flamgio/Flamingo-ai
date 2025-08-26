import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin access code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey }),
      });

      if (response.success) {
        // Store admin token in sessionStorage (not localStorage for security)
        sessionStorage.setItem('admin_session', 'authenticated');
        sessionStorage.setItem('admin_timestamp', Date.now().toString());
        
        toast({
          title: "Access Granted",
          description: "Welcome to the admin panel",
        });
        
        onSuccess();
        onClose();
        setAdminKey('');
      }
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid admin access code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAdminKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            <i className="fas fa-shield-alt mr-2"></i>
            Admin Access
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Access Code
            </label>
            <Input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin access code"
              className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This area is restricted to authorized administrators only
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !adminKey.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-key mr-2"></i>
                  Access Panel
                </>
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <i className="fas fa-info-circle mr-1"></i>
            This system requires valid administrator credentials
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}