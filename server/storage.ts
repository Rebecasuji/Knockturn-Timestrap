export interface Employee {
  id: string;
  employeeId: string;
  name: string;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  date: string;
  totalWorkSeconds: number;
  isSubmitted: boolean;
  submittedAt: Date | null;
}

export interface Task {
  id: string;
  timesheetId: string;
  title: string;
  startTime: Date;
  endTime: Date | null;
  durationSeconds: number;
  isComplete: boolean;
}

export interface InsertEmployee extends Omit<Employee, "id"> {}
export interface InsertTimesheet extends Omit<Timesheet, "id"> {}
export interface InsertTask extends Omit<Task, "id"> {}

export class DbStorage {
  private employees: Employee[] = [];
  private timesheets: Timesheet[] = [];
  private tasks: Task[] = [];

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return this.employees.find((e) => e.employeeId === employeeId);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const newEmployee: Employee = { id: String(Date.now()), ...employee };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async getTimesheetByEmployeeAndDate(employeeId: string, date: string): Promise<Timesheet | undefined> {
    return this.timesheets.find((t) => t.employeeId === employeeId && t.date === date);
  }

  async createTimesheet(timesheet: InsertTimesheet): Promise<Timesheet> {
    const newTimesheet: Timesheet = { id: String(Date.now()), ...timesheet };
    this.timesheets.push(newTimesheet);
    return newTimesheet;
  }

  async updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | undefined> {
    const index = this.timesheets.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.timesheets[index] = { ...this.timesheets[index], ...data };
    return this.timesheets[index];
  }

  async getTasksByTimesheetId(timesheetId: string): Promise<Task[]> {
    return this.tasks.filter((t) => t.timesheetId === timesheetId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask: Task = { id: String(Date.now()), ...task };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...data };
    return this.tasks[index];
  }
}

export const storage = new DbStorage();
