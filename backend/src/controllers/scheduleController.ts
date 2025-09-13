import { Request, Response } from "express";
import { createSchedule } from "../services/scheduler.js";

export const generateSchedule = (req: Request, res: Response): void => {
  try {
    const { workers, month, year } = req.body as {
      workers: string[];
      month: number;
      year: number;
    };

    if (!workers || workers.length === 0) {
      res.status(400).json({ error: "Workers list is required" });
      return;
    }

    if (!month || !year) {
      res.status(400).json({ error: "Month and year are required" });
      return;
    }

    const schedule = createSchedule(workers, month, year);
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating schedule" });
  }
};
