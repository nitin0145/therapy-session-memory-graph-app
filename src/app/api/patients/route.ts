import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPatientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().int().positive("Age must be a positive number"),
  gender: z.string().min(1, "Gender is required"),
});

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createPatientSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const patient = await prisma.patient.create({
      data: parsed.data,
    });
    
    return NextResponse.json(patient, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
