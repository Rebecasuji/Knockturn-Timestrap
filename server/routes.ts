import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, insertTaskSchema } from "@shared/schema";
import { format } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/login", async (req, res) => {
    try {
      const { employeeId, name } = req.body;
      
      if (!employeeId || !name || typeof employeeId !== 'string' || typeof name !== 'string') {
        return res.status(400).json({ error: "Employee ID and name are required" });
      }
      
      let employee = await storage.getEmployeeByEmployeeId(employeeId.trim());
      
      if (!employee) {
        employee = await storage.createEmployee({ 
          employeeId: employeeId.trim(), 
          name: name.trim() 
        });
      }
      
      res.json(employee);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Failed to process login" });
    }
  });

  app.get("/api/employees/:employeeId/timesheet", async (req, res) => {
    try {
      const { employeeId } = req.params;
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      
      const employee = await storage.getEmployeeByEmployeeId(employeeId);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      let timesheet = await storage.getTimesheetByEmployeeAndDate(employee.id, date);
      
      if (!timesheet) {
        timesheet = await storage.createTimesheet({
          employeeId: employee.id,
          date,
          totalWorkSeconds: 0,
          isSubmitted: false,
          submittedAt: null
        });
      }
      
      const timesheetTasks = await storage.getTasksByTimesheetId(timesheet.id);
      
      res.json({ timesheet, tasks: timesheetTasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timesheet" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const { timesheetId, title, startTime, endTime, durationSeconds, isComplete } = req.body;
      
      const task = await storage.createTask({
        timesheetId,
        title: title || '',
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        durationSeconds: durationSeconds || 0,
        isComplete: isComplete || false
      });
      
      res.json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates: any = {};
      
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.endTime !== undefined) updates.endTime = new Date(req.body.endTime);
      if (req.body.durationSeconds !== undefined) updates.durationSeconds = req.body.durationSeconds;
      if (req.body.isComplete !== undefined) updates.isComplete = req.body.isComplete;
      
      const task = await storage.updateTask(id, updates);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.post("/api/submit", async (req, res) => {
    try {
      const { timesheetId } = req.body;
      
      const timesheetTasks = await storage.getTasksByTimesheetId(timesheetId);
      
      const totalSeconds = timesheetTasks.reduce((sum, task) => sum + task.durationSeconds, 0);
      
      const updatedTimesheet = await storage.updateTimesheet(timesheetId, {
        totalWorkSeconds: totalSeconds,
        isSubmitted: true,
        submittedAt: new Date()
      });
      
      res.json(updatedTimesheet);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit timesheet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
