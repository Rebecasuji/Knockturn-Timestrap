import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import TaskCard from '@/components/TaskCard';
import AnalyticsCharts from '@/components/AnalyticsCharts';

interface Task {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
}

export default function TrackerPage() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employee, setEmployee] = useState({ id: '', name: '' });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('employee');
    if (!stored) {
      setLocation('/');
      return;
    }
    setEmployee(JSON.parse(stored));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [setLocation]);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      startTime: new Date(),
      isComplete: false
    };
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, endTime: new Date(), isComplete: true }
        : task
    ));
  };

  const updateTaskTitle = (id: string, title: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title } : task
    ));
  };

  const totalWorkMinutes = tasks
    .filter(t => t.isComplete && t.endTime)
    .reduce((sum, t) => {
      const duration = (t.endTime!.getTime() - t.startTime.getTime()) / 1000 / 60;
      return sum + duration;
    }, 0);

  const hours = Math.floor(totalWorkMinutes / 60);
  const minutes = Math.floor(totalWorkMinutes % 60);

  const taskData = tasks
    .filter(t => t.isComplete && t.title.trim())
    .map(t => ({
      title: t.title || 'Untitled',
      minutes: Math.floor((t.endTime!.getTime() - t.startTime.getTime()) / 1000 / 60)
    }));

  const hourlyProductivity = [20, 45, 60, 75, 85, 90, 88, 70];

  const handleSubmit = () => {
    console.log('Submitting timesheet:', {
      employee,
      tasks,
      totalMinutes: totalWorkMinutes
    });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

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
                  className="shadow-lg shadow-primary/30"
                  data-testid="button-add-task"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {tasks.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-primary/30">
                  <p className="text-muted-foreground">
                    No tasks yet. Click "Add Task" to get started.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {tasks.map(task => (
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
                disabled={tasks.filter(t => t.isComplete).length === 0 || isSubmitted}
                className="shadow-xl shadow-primary/40 px-8"
                data-testid="button-submit-timesheet"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitted ? 'Submitted!' : 'Final Submit'}
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
