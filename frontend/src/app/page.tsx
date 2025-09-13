"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Home() {
  const [workersText, setWorkersText] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [schedule, setSchedule] = useState<any[]>([]);
  const [allWorkers, setAllWorkers] = useState<string[]>([]);

  // Generar el calendario con reparto justo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workers = workersText
      .split("\n")
      .map((w) => w.trim().slice(0, 30))
      .filter(Boolean);

    setAllWorkers(workers);

    const daysInMonth = new Date(year, month, 0).getDate();
    const scheduleArray: { date: string; workers: string[] }[] = [];

    let day = 1;

    // Lista mutable de trabajadores sin turno aún
    let remaining = [...workers];

    while (day <= daysInMonth) {
      const assigned: string[] = [];

      // 2 trabajadores por día
      for (let i = 0; i < 2; i++) {
        if (remaining.length > 0) {
          assigned.push(remaining.shift()!);
        } else {
          // si ya todos tuvieron turno, asignamos repetidos
          const w = workers[(day + i - 1) % workers.length];
          assigned.push(w);
        }
      }

      scheduleArray.push({
        date: new Date(year, month - 1, day).toISOString(),
        workers: assigned,
      });

      day++;
    }

    setSchedule(scheduleArray);
  };

  // Detectar repetidos
  const getRepeatedWorkers = () => {
    const count: Record<string, number> = {};
    schedule.forEach((d) =>
      d.workers.forEach((w: string) => {
        count[w] = (count[w] || 0) + 1;
      })
    );
    return Object.keys(count).filter((w) => count[w] > 1);
  };

  // Detectar libres
  const getFreeWorkers = () => {
    const assigned = new Set(schedule.flatMap((d) => d.workers));
    return allWorkers.filter((w) => !assigned.has(w));
  };

  const repeatedWorkers = getRepeatedWorkers();
  const freeWorkers = getFreeWorkers();

  // Render calendario con huecos iniciales
  const renderCalendar = () => {
    if (!schedule.length) return [];

    const firstDayIndex = new Date(schedule[0].date).getDay(); // 0=Sunday
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // ajustar lunes=0

    const emptyCells = Array(offset).fill(null);
    return [...emptyCells, ...schedule];
  };

  const handleExportPDF = async () => {
    const input = document.getElementById("calendar-section");
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`clean-schedule-${month}-${year}.pdf`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Clean Schedule Generator</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <label>Workers (one per line, max 30 chars):</label>
        <br />
        <textarea
          rows={6}
          value={workersText}
          onChange={(e) => setWorkersText(e.target.value)}
          style={{ width: "300px" }}
        />
        <br />

        <label>Month:</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ margin: "0 8px" }}
        >
          {months.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>

        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <br />

        <button type="submit" style={{ marginTop: "1rem" }}>
          Generate Schedule
        </button>
      </form>

      {schedule.length > 0 && (
        <div>
          <div id="calendar-section">
            <h2>Schedule for {months[month - 1]} {year}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "8px",
                marginTop: "1rem",
              }}
            >
              {weekDays.map((day) => (
                <div
                  key={day}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottom: "2px solid black",
                  }}
                >
                  {day}
                </div>
              ))}

              {renderCalendar().map((entry, idx) =>
                entry ? (
                  <div
                    key={entry.date}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      minHeight: "80px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "white",
                    }}
                  >
                    <div style={{ textAlign: "right", fontWeight: "bold" }}>
                      {new Date(entry.date).getDate()}
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                      {entry.workers.map((w: string, i: number) => (
                        <span
                          key={i}
                          style={{
                            display: "block",
                            color: repeatedWorkers.includes(w) ? "red" : "black",
                            fontWeight: repeatedWorkers.includes(w) ? "bold" : "normal",
                          }}
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={idx} />
                )
              )}
            </div>

            {freeWorkers.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3>Free this month</h3>
                <ul>
                  {freeWorkers.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button onClick={handleExportPDF} style={{ marginTop: "1rem" }}>
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
}
