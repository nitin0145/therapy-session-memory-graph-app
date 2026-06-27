import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreatePatientDialog } from "@/components/patients/create-patient-dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your patients and therapy sessions.</p>
        </div>
        <CreatePatientDialog />
      </div>

      {patients.length === 0 ? (
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-2">No patients found</h3>
          <p className="text-slate-500 mb-6 max-w-sm text-sm">
            Get started by adding your first patient.
          </p>
          <CreatePatientDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{patient.fullName}</CardTitle>
                  <CardDescription>
                    {patient.age} years old • {patient.gender}
                    <br />
                    Added {formatDistanceToNow(new Date(patient.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
