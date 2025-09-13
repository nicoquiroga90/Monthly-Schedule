import { createSchedule } from "../services/scheduler.js";

export const generateSchedule = (req, res) => {
  try {
    const { workers, month, year } = req.body;

    if (!workers || !Array.isArray(workers) || workers.length === 0) {
      return res.status(400).json({ error: "Workers list is required" });
    }

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const schedule = createSchedule(workers, month, year);
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating schedule" });
  }
};
