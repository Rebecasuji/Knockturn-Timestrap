import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
  onComplete?: (id: string) => void;
  onTitleChange?: (id: string, title: string) => void;
}

export default function TaskCard({
  id,
  title,
  startTime,
  endTime,
  isComplete,
  onComplete,
  onTitleChange
}: TaskCardProps) {
  const duration = endTime && startTime
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : 0;

  return (
    <div
      className="rounded-lg border border-primary/30 bg-card p-6 transition-all hover-elevate"
      style={{
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
      }}
      data-testid={`task-card-${id}`}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            value={title}
            onChange={(e) => onTitleChange?.(id, e.target.value)}
            className="bg-background/50 border-primary/20 text-lg font-medium"
            placeholder="Task title..."
            disabled={isComplete}
            data-testid={`input-task-title-${id}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs" data-testid={`badge-start-time-${id}`}>
            <Clock className="w-3 h-3 mr-1" />
            {format(startTime, 'HH:mm')}
          </Badge>
          
          {endTime && (
            <>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="font-mono text-xs" data-testid={`badge-end-time-${id}`}>
                <Clock className="w-3 h-3 mr-1" />
                {format(endTime, 'HH:mm')}
              </Badge>
              <Badge className="bg-primary/20 text-primary font-mono" data-testid={`badge-duration-${id}`}>
                {duration}m
              </Badge>
            </>
          )}
        </div>

        <Button
          onClick={() => onComplete?.(id)}
          disabled={isComplete}
          variant={isComplete ? "secondary" : "default"}
          size="sm"
          data-testid={`button-complete-${id}`}
        >
          {isComplete ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            'Complete'
          )}
        </Button>
      </div>
    </div>
  );
}
