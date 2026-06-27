import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, Calendar, BrainCircuit, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreateSessionDialog } from "@/components/sessions/create-session-dialog";
import { MemoryGraph } from "@/components/patients/memory-graph";

import { TherapySession, MemoryEntity } from "@prisma/client";

export const dynamic = 'force-dynamic';

type SessionWithMemories = TherapySession & { memories: MemoryEntity[] };

// Simple rule-based contradiction detection
function detectContradictions(sessions: SessionWithMemories[]) {
  const contradictions: string[] = [];
  
  // Sort oldest to newest for chronological rules
  const chrono = [...sessions].sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
  
  let previousMeds: string[] = [];
  let previousRisks: string[] = [];

  for (let i = 0; i < chrono.length; i++) {
    const currentSession = chrono[i];
    const meds = currentSession.memories.filter(m => m.type === "Medication").map(m => m.value.toLowerCase());
    const risks = currentSession.memories.filter(m => m.type === "Risk Flag").map(m => m.value.toLowerCase());
    const emotions = currentSession.memories.filter(m => m.type === "Emotion").map(m => m.value.toLowerCase());

    // Rule 1: Medication Stopped Unpredictably
    if (previousMeds.length > 0 && meds.length > 0) {
      if (meds.some(m => m.includes("none") || m.includes("stopped"))) {
        contradictions.push(`In "${currentSession.title}", medication was noted as stopped/none, but previously they were on: ${previousMeds.join(", ")}`);
      }
    }

    // Rule 2: Escalation of Risk Flags
    if (risks.some(r => r.includes("suicide") || r.includes("harm") || r.includes("ideation"))) {
      if (!previousRisks.some(r => r.includes("suicide") || r.includes("harm") || r.includes("ideation"))) {
        contradictions.push(`Risk escalation detected in "${currentSession.title}": New self-harm or severe risk flags appeared.`);
      }
    }

    // Rule 3: Emotion Shift (Positive to Negative)
    if (i > 0) {
      const prevEmotions = chrono[i - 1].memories.filter(m => m.type === "Emotion").map(m => m.value.toLowerCase());
      if (prevEmotions.some(e => e.includes("happy") || e.includes("stable") || e.includes("good"))) {
        if (emotions.some(e => e.includes("depressed") || e.includes("anxious") || e.includes("sad"))) {
          contradictions.push(`Sudden emotional shift in "${currentSession.title}" compared to the previously stable/happy session.`);
        }
      }
    }

    // Rule 4: Coping Strategy vs Substance Use Relapse
    const coping = currentSession.memories.filter(m => m.type === "Coping Strategy").map(m => m.value.toLowerCase());
    if (coping.some(c => c.includes("relapse") || c.includes("drinking again") || c.includes("using again"))) {
      contradictions.push(`Potential substance relapse noted in "${currentSession.title}".`);
    }

    if (meds.length > 0) previousMeds = meds;
    if (risks.length > 0) previousRisks = risks;
  }
  
  return contradictions;
}

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { sessionDate: 'desc' },
        include: { memories: true }
      }
    }
  });

  if (!patient) notFound();

  const contradictions = detectContradictions(patient.sessions);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Patient Information */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Patients
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{patient.fullName}</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span>{patient.age} years old</span>
              <span>•</span>
              <span>{patient.gender}</span>
            </p>
          </div>
          <CreateSessionDialog patientId={patient.id} />
        </div>
      </div>

      {/* Potential Contradictions */}
      {contradictions.length > 0 && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              Potential Contradictions & Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {contradictions.map((c, idx) => (
                <li key={idx} className="text-sm text-amber-800 dark:text-amber-400 flex items-start gap-2">
                  <span className="mt-1 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Memory Graph */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Memory Graph</h3>
        <MemoryGraph data={{ patient, sessions: patient.sessions }} />
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Therapy Timeline</h3>
        {patient.sessions.length === 0 ? (
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-slate-500">
            No sessions recorded yet.
          </div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
            {patient.sessions.map((session) => (
              <div key={session.id} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[8.5px] top-1.5 ring-4 ring-white dark:ring-slate-950" />
                
                <Link href={`/sessions/${session.id}`} className="block">
                  <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <div className="flex items-center text-sm text-slate-500 gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(session.sessionDate), "PPP")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {session.summary ? (
                        <p className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <BrainCircuit className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                          <span>{session.summary}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No summary generated.</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
