# Monthly Schedule Generator

A simple web app to generate fair worker schedules, display them in a calendar format, and export to PDF.  
Built with **Next.js, React, jsPDF, and html2canvas**.

## Features
- Input workers (one per line, max 30 chars).
- Generate monthly schedule with **fair distribution**:
  - Each worker gets at least one shift before repeats.
  - Repeated workers are highlighted in **red**.
  - Unassigned workers are listed as **"free"** for the month.
- Calendar view (classic grid, Monday start).
- Export schedule to **PDF** (clean format, no buttons included).

## Tech Stack
- [Next.js](https://nextjs.org/) – frontend framework
- [React](https://reactjs.org/) – UI
- [jsPDF](https://github.com/parallax/jsPDF) – PDF generation
- [html2canvas](https://github.com/niklasvh/html2canvas) – HTML to canvas

## Local Development
```bash
# install dependencies
npm install

# run in dev mode
npm run dev

# build for production
npm run build
npm run start
