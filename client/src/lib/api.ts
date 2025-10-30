import type { Employee, Timesheet, Task } from "@shared/schema";

interface LoginRequest {
  employeeId: string;
  name: string;
}

interface TimesheetResponse {
  timesheet: Timesheet;
  tasks: Task[];
}

interface CreateTaskRequest {
  timesheetId: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  isComplete: boolean;
}

interface UpdateTaskRequest {
  title?: string;
  endTime?: Date;
  durationSeconds?: number;
  isComplete?: boolean;
}

interface SubmitTimesheetRequest {
  timesheetId: string;
}

export async function login(data: LoginRequest): Promise<Employee> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

export async function getTimesheet(employeeId: string, date?: string): Promise<TimesheetResponse> {
  const url = date 
    ? `/api/employees/${employeeId}/timesheet?date=${date}`
    : `/api/employees/${employeeId}/timesheet`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch timesheet');
  }
  
  return response.json();
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  
  return response.json();
}

export async function updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  
  return response.json();
}

export async function submitTimesheet(data: SubmitTimesheetRequest): Promise<Timesheet> {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit timesheet');
  }
  
  return response.json();
}
