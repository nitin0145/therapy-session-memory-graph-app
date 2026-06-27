import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSessionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  title: z.string().min(1, "Title is required"),
  transcript: z.string().min(1, "Transcript is required"),
  sessionDate: z.string().transform(str => new Date(str)),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    const sessions = await prisma.therapySession.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { sessionDate: 'desc' },
      include: {
        patient: {
          select: { fullName: true }
        }
      }
    });
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const session = await prisma.therapySession.create({
      data: parsed.data,
    });
    
    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
