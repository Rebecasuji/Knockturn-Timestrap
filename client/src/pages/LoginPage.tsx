import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LampAnimation from '@/components/LampAnimation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLampPull = async () => {
    if (!employeeId.trim() || !employeeName.trim()) {
      setFormError('Please fill in all fields before pulling the lamp');
      return;
    }

    setIsLoading(true);
    
    try {
      const employee = await login({
        employeeId: employeeId.trim(),
        name: employeeName.trim()
      });

      localStorage.setItem('employee', JSON.stringify({
        id: employee.employeeId,
        name: employee.name,
        dbId: employee.id
      }));
      
      toast({
        title: 'Login successful',
        description: `Welcome, ${employee.name}!`
      });
      
      setLocation('/tracker');
    } catch (error) {
      setFormError('Failed to login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
        }}
      />
      
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Knockturn Private Limited
          </h1>
          <p className="text-xl text-muted-foreground">Employee Timestrap</p>
        </div>

        {!isLoading && <LampAnimation onPullComplete={handleLampPull} />}
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Logging in...</p>
          </div>
        )}

        <Card
          className="p-8 bg-card/80 backdrop-blur-sm border-primary/30"
          style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employee-id" className="text-sm font-medium">
                Employee ID
              </Label>
              <Input
                id="employee-id"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  setFormError('');
                }}
                placeholder="Enter your employee ID"
                className="bg-background/50 border-primary/20 font-mono"
                data-testid="input-employee-id"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-name" className="text-sm font-medium">
                Employee Name
              </Label>
              <Input
                id="employee-name"
                value={employeeName}
                onChange={(e) => {
                  setEmployeeName(e.target.value);
                  setFormError('');
                }}
                placeholder="Enter your full name"
                className="bg-background/50 border-primary/20"
                data-testid="input-employee-name"
                disabled={isLoading}
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive" data-testid="text-form-error">
                {formError}
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Fill in your details, then pull the lamp string above to login
            </p>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
