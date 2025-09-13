export function createSchedule(workers, month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // pick 2 random workers
    const pair = workers.sort(() => 0.5 - Math.random()).slice(0, 2);

    schedule.push({
      date: `${year}-${month}-${day}`,
      dayOfWeek,
      workers: pair,
    });
  }

  return schedule;
}
