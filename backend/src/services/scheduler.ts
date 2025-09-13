export interface ScheduleEntry {
  date: string;
  dayOfWeek: string;
  workers: string[];
}

export function createSchedule(workers: string[], month: number, year: number): ScheduleEntry[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule: ScheduleEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // shuffle workers and pick 2
    const shuffled = [...workers].sort(() => 0.5 - Math.random());
    const pair = shuffled.slice(0, 2);

    schedule.push({
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      dayOfWeek,
      workers: pair,
    });
  }

  return schedule;
}
