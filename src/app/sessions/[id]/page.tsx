import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnalyzeButton } from "@/components/sessions/analyze-button";

export const dynamic = 'force-dynamic';

export default async function SessionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await prisma.therapySession.findUnique({
    where: { id },
    include: {
      patient: true,
      memories: true,
    }
  });

  if (!session) notFound();

  // Group memory entities by type for easier rendering
  const memoryGroups = session.memories.reduce((acc, memory) => {
    if (!acc[memory.type]) acc[memory.type] = [];
    acc[memory.type].push(memory.value);
    return acc;
  }, {} as Record<string, string[]>);

  const categories = [
    { label: "Emotions", type: "Emotion" },
    { label: "People", type: "Person" },
    { label: "Medications", type: "Medication" },
    { label: "Diagnoses", type: "Diagnosis" },
    { label: "Coping Strategies", type: "Coping Strategy" },
    { label: "Risk Flags", type: "Risk Flag" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link 
          href={`/patients/${session.patientId}`} 
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to {session.patient.fullName}
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{session.title}</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(session.sessionDate), "PPP")}</span>
            </p>
          </div>
          <AnalyzeButton sessionId={session.id} transcript={session.transcript} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {session.summary ? (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {session.summary}
                </p>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Click &quot;Analyze Transcript&quot; to generate a summary.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {session.transcript}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {categories.map(({ label, type }) => {
            const values = memoryGroups[type] || [];
            return (
              <Card key={label}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {values.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">None detected</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {values.map((val, idx) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center before:content-['•'] before:mr-2 before:text-slate-300">
                          {val}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
