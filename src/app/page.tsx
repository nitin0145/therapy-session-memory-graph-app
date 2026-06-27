import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreatePatientDialog } from "@/components/patients/create-patient-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FolderHeart, Users, ArrowRight, UserPlus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { sessions: true }
      }
    }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Patients</h2>
          <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your patients, their sessions, and track their therapeutic journey.</p>
        </div>
        <CreatePatientDialog />
      </div>

      {patients.length === 0 ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 py-20 px-6 text-center flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-slate-900 shadow-sm rounded-full p-4 mb-4 ring-1 ring-slate-200 dark:ring-slate-800">
            <FolderHeart className="w-10 h-10 text-primary opacity-80" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No patients yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm">
            You don't have any patients in your database. Add your first patient to start analyzing their sessions and generating memory graphs.
          </p>
          <CreatePatientDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`} className="group block">
              <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {patient.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 text-xs px-2.5 py-1 rounded-full font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{patient.fullName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1.5">
                    <span>{patient.age} years old</span>
                    <span>•</span>
                    <span>{patient.gender}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md">
                      <Users className="w-3.5 h-3.5" />
                      <span>{patient._count.sessions} sessions</span>
                    </div>
                    <span className="text-xs">
                      Added {formatDistanceToNow(new Date(patient.createdAt))} ago
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
