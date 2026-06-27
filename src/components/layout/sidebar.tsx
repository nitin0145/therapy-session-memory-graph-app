"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Users, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const isPatientsActive = pathname === "/" || pathname.startsWith("/patients");

  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-xl">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">TherapyGraph</span>
      </div>
      
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Menu</p>
        <nav className="flex-1 space-y-1">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
              isPatientsActive 
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
            )}
          >
            <Users className="w-4 h-4" />
            <span>Patients</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white opacity-50 cursor-not-allowed">
            <Activity className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white w-full text-left">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
