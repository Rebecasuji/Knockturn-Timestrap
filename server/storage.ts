import { db } from "./db";
import { employees, timesheets, tasks } from "@shared/schema";
import type { Employee, InsertEmployee, Timesheet, InsertTimesheet, Task, InsertTask } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  
  getTimesheetByEmployeeAndDate(employeeId: string, date: string): Promise<Timesheet | undefined>;
  createTimesheet(timesheet: InsertTimesheet): Promise<Timesheet>;
  updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | undefined>;
  
  getTasksByTimesheetId(timesheetId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, data: Partial<Task>): Promise<Task | undefined>;
}

export class DbStorage implements IStorage {
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return result[0];
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(employee).returning();
    return result[0];
  }

  async getTimesheetByEmployeeAndDate(employeeId: string, date: string): Promise<Timesheet | undefined> {
    const result = await db.select().from(timesheets)
      .where(and(eq(timesheets.employeeId, employeeId), eq(timesheets.date, date)));
    return result[0];
  }

  async createTimesheet(timesheet: InsertTimesheet): Promise<Timesheet> {
    const result = await db.insert(timesheets).values(timesheet).returning();
    return result[0];
  }

  async updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | undefined> {
    const result = await db.update(timesheets)
      .set(data)
      .where(eq(timesheets.id, id))
      .returning();
    return result[0];
  }

  async getTasksByTimesheetId(timesheetId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.timesheetId, timesheetId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
    const result = await db.update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
