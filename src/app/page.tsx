"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SchedulePDFDocument from "./components/SchedulePDFDocument";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

interface ScheduleEntry {
  date: string;
  workers: string[];
}

export default function Home() {
  const [workersText, setWorkersText] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [allWorkers, setAllWorkers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workers = workersText
      .split("\n")
      .map((w) => w.trim().slice(0, 30))
      .filter(Boolean);

    if (workers.length === 0) {
      alert("Please enter at least one worker.");
      return;
    }

    setAllWorkers(workers);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const scheduleArray: ScheduleEntry[] = [];

    let day = 1;
    const remaining = [...workers];

    while (day <= daysInMonth) {
      const assigned: string[] = [];

      for (let i = 0; i < 2; i++) {
        if (remaining.length > 0) {
          assigned.push(remaining.shift()!);
        } else {
          const w = workers[(day + i - 1) % workers.length];
          assigned.push(w);
        }
      }

      scheduleArray.push({
        date: new Date(year, month, day).toISOString(),
        workers: assigned,
      });

      day++;
    }

    setSchedule(scheduleArray);
  };

  const getRepeatedWorkers = () => {
    const count: Record<string, number> = {};
    schedule.forEach((d) => d.workers.forEach((w) => {
      count[w] = (count[w] || 0) + 1;
    }));
    return Object.keys(count).filter((w) => count[w] > 1);
  };

  const getFreeWorkers = () => {
    const assigned = new Set(schedule.flatMap((d) => d.workers));
    return allWorkers.filter((w) => !assigned.has(w));
  };

  const repeatedWorkers = getRepeatedWorkers();
  const freeWorkers = getFreeWorkers();

  const renderCalendar = () => {
    if (!schedule.length) return [];

    const firstDayIndex = new Date(schedule[0].date).getDay(); // 0=Sunday
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const emptyCells = Array(offset).fill(null);
    return [...emptyCells, ...schedule];
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <label className="block font-semibold">Workers (one per line, max 30 chars):</label>
        <textarea
          rows={6}
          value={workersText}
          onChange={(e) => setWorkersText(e.target.value)}
          className="w-full border rounded p-2"
        />

        <div className="flex items-center gap-4">
          <label>Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded p-1"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>

        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Generate Schedule
        </button>
      </form>

      {schedule.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">{months[month]} {year}</h2>

            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day) => (
                <div key={day} className="font-bold border-b py-1">{day}</div>
              ))}

              {renderCalendar().map((entry, idx) =>
                entry ? (
                  <div key={entry.date} className="border min-h-[80px] p-1 flex flex-col justify-between bg-white">
                    <div className="text-right font-bold">{new Date(entry.date).getDate()}</div>
                    <div className="text-sm">
                      {entry.workers.map((w:string) => (
                        <div
                          key={w}
                          className={`${repeatedWorkers.includes(w) ? "text-red-600 font-bold" : ""}`}
                        >
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={idx} />
                )
              )}
            </div>

            {freeWorkers.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Free this month</h3>
                <ul className="list-disc list-inside">
                  {freeWorkers.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>

          <PDFDownloadLink
            document={<SchedulePDFDocument schedule={schedule} month={months[month]} year={year} />}
            fileName={`schedule-${month+1}-${year}.pdf`}
          >
            {({ loading }) => (
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </>
      )}
    </div>
  );
}
