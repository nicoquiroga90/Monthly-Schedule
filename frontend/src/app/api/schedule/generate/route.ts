import { NextRequest, NextResponse } from "next/server";
import { createSchedule } from "@/lib/scheduler";

export async function POST(req: NextRequest) {
  try {
    const { workers, month, year } = await req.json();

    if (!workers || workers.length === 0) {
      return NextResponse.json({ error: "Workers list is required" }, { status: 400 });
    }

    if (!month || !year) {
      return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
    }

    const schedule = createSchedule(workers, month, year);

    return NextResponse.json(schedule);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error generating schedule" }, { status: 500 });
  }
}
