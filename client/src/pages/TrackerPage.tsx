import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import TaskCard from '@/components/TaskCard';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { getTimesheet, createTask, updateTask, submitTimesheet } from '@/lib/api';
import type { Task, Timesheet } from '@shared/schema';

interface LocalTask {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
}

export default function TrackerPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employee, setEmployee] = useState({ id: '', name: '', dbId: '' });
  const [currentTimesheet, setCurrentTimesheet] = useState<Timesheet | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('employee');
    if (!stored) {
      setLocation('/');
      return;
    }
    const emp = JSON.parse(stored);
    setEmployee(emp);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [setLocation]);

  const { data: timesheetData, isLoading } = useQuery({
    queryKey: ['/api/timesheet', employee.id],
    enabled: !!employee.id,
    queryFn: async () => {
      const data = await getTimesheet(employee.id);
      setCurrentTimesheet(data.timesheet);
      return data;
    }
  });

  const localTasks: LocalTask[] = timesheetData?.tasks.map((t: Task) => ({
    id: t.id,
    title: t.title,
    startTime: new Date(t.startTime),
    endTime: t.endTime ? new Date(t.endTime) : undefined,
    isComplete: t.isComplete
  })) || [];

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timesheet', employee.id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timesheet', employee.id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: submitTimesheet,
    onSuccess: () => {
      toast({
        title: 'Timesheet submitted!',
        description: 'Your work has been recorded successfully.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/timesheet', employee.id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit timesheet',
        variant: 'destructive'
      });
    }
  });

  const addTask = () => {
    if (!currentTimesheet) return;
    
    createTaskMutation.mutate({
      timesheetId: currentTimesheet.id,
      title: '',
      startTime: new Date(),
      durationSeconds: 0,
      isComplete: false
    });
  };

  const completeTask = (id: string) => {
    const task = localTasks.find(t => t.id === id);
    if (!task) return;

    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - task.startTime.getTime()) / 1000);

    updateTaskMutation.mutate({
      id,
      data: {
        endTime,
        durationSeconds,
        isComplete: true
      }
    });
  };

  const updateTaskTitle = (id: string, title: string) => {
    updateTaskMutation.mutate({
      id,
      data: { title }
    });
  };

  const handleSubmit = () => {
    if (!currentTimesheet) return;
    submitMutation.mutate({ timesheetId: currentTimesheet.id });
  };

  const totalWorkMinutes = localTasks
    .filter(t => t.isComplete && t.endTime)
    .reduce((sum, t) => {
      const duration = (t.endTime!.getTime() - t.startTime.getTime()) / 1000 / 60;
      return sum + duration;
    }, 0);

  const hours = Math.floor(totalWorkMinutes / 60);
  const minutes = Math.floor(totalWorkMinutes % 60);

  const taskData = localTasks
    .filter(t => t.isComplete && t.title.trim())
    .map(t => ({
      title: t.title || 'Untitled',
      minutes: Math.floor((t.endTime!.getTime() - t.startTime.getTime()) / 1000 / 60)
    }));

  const completedTasks = localTasks.filter(t => t.isComplete && t.endTime);
  const hourlyProductivity = Array(8).fill(0).map((_, hourIndex) => {
    const hourStart = 9 + hourIndex;
    const tasksInHour = completedTasks.filter(t => {
      const taskHour = t.startTime.getHours();
      return taskHour === hourStart;
    });
    
    if (tasksInHour.length === 0) return 0;
    
    const totalMinutesInHour = tasksInHour.reduce((sum, t) => {
      const duration = (t.endTime!.getTime() - t.startTime.getTime()) / 1000 / 60;
      return sum + duration;
    }, 0);
    
    return Math.min(100, Math.round((totalMinutesInHour / 60) * 100));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading timesheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header
        className="h-20 px-8 flex items-center justify-between border-b border-primary/30"
        style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)' }}
      >
        <h1 className="text-xl font-semibold text-primary">
          Knockturn Private Limited
        </h1>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-mono text-primary font-bold" data-testid="text-current-time">
              {format(currentTime, 'HH:mm:ss')}
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-current-date">
              {format(currentTime, 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>

          <Badge
            variant="outline"
            className="px-4 py-2 border-primary/30 bg-card/50"
            data-testid="badge-employee-info"
          >
            <User className="w-4 h-4 mr-2 text-primary" />
            <div className="text-left">
              <p className="font-semibold">{employee.name}</p>
              <p className="text-xs text-muted-foreground font-mono">ID: {employee.id}</p>
            </div>
          </Badge>
        </div>
      </header>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              className="p-8 bg-card/50 border-primary/30"
              style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">Total Working Time</h2>
                    <p className="text-sm text-muted-foreground">Today's progress</p>
                  </div>
                </div>
              </div>
              <p
                className="text-6xl font-mono font-bold text-primary"
                data-testid="text-total-time"
              >
                {hours}h {minutes}m
              </p>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Tasks</h2>
                <Button
                  onClick={addTask}
                  disabled={createTaskMutation.isPending}
                  className="shadow-lg shadow-primary/30"
                  data-testid="button-add-task"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
                </Button>
              </div>

              {localTasks.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-primary/30">
                  <p className="text-muted-foreground">
                    No tasks yet. Click "Add Task" to get started.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {localTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onComplete={completeTask}
                      onTitleChange={updateTaskTitle}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={localTasks.filter(t => t.isComplete).length === 0 || submitMutation.isPending || currentTimesheet?.isSubmitted}
                className="shadow-xl shadow-primary/40 px-8"
                data-testid="button-submit-timesheet"
              >
                <Send className="w-5 h-5 mr-2" />
                {submitMutation.isPending ? 'Submitting...' : currentTimesheet?.isSubmitted ? 'Already Submitted' : 'Final Submit'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Analytics</h2>
            <AnalyticsCharts
              workMinutes={totalWorkMinutes}
              breakMinutes={480 - totalWorkMinutes}
              taskData={taskData}
              hourlyProductivity={hourlyProductivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
