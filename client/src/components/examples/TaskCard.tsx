import TaskCard from '../TaskCard';
import { useState } from 'react';

export default function TaskCardExample() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Review code documentation',
      startTime: new Date(2025, 0, 30, 9, 0),
      endTime: undefined,
      isComplete: false
    },
    {
      id: '2',
      title: 'Team standup meeting',
      startTime: new Date(2025, 0, 30, 10, 0),
      endTime: new Date(2025, 0, 30, 10, 30),
      isComplete: true
    }
  ]);

  const handleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, endTime: new Date(), isComplete: true }
        : task
    ));
  };

  const handleTitleChange = (id: string, title: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title } : task
    ));
  };

  return (
    <div className="p-8 space-y-4 max-w-4xl">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          {...task}
          onComplete={handleComplete}
          onTitleChange={handleTitleChange}
        />
      ))}
    </div>
  );
}
