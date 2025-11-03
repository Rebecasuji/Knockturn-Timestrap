import type { Employee, Timesheet, Task } from "@shared/schema";

export class MockStorage {
  private employees: Employee[] = [
    {
      id: "1",
      employeeId: "EMP001",
      name: "Rebeca Suji",
      password: "rebeca@13",
    },
  ];

  private timesheets: Timesheet[] = [];
  private tasks: Task[] = [];

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return this.employees.find((emp) => emp.employeeId === employeeId);
  }

  async createEmployee(employee: any): Promise<Employee> {
    const newEmployee = { ...employee, id: String(this.employees.length + 1) };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async getTimesheetByEmployeeAndDate(employeeId: string, date: string): Promise<Timesheet | undefined> {
    return this.timesheets.find((t) => t.employeeId === employeeId && t.date === date);
  }

  async createTimesheet(timesheet: any): Promise<Timesheet> {
    const newTs = { ...timesheet, id: String(this.timesheets.length + 1) };
    this.timesheets.push(newTs);
    return newTs;
  }

  async updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | undefined> {
    const ts = this.timesheets.find((t) => t.id === id);
    if (ts) Object.assign(ts, data);
    return ts;
  }

  async getTasksByTimesheetId(timesheetId: string): Promise<Task[]> {
    return this.tasks.filter((t) => t.timesheetId === timesheetId);
  }

  async createTask(task: any): Promise<Task> {
    const newTask = { ...task, id: String(this.tasks.length + 1) };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.find((t) => t.id === id);
    if (task) Object.assign(task, data);
    return task;
  }
}

export const storage = new MockStorage();
