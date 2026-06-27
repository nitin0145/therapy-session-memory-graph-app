import Link from "next/link";
import { Brain, Users, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <Brain className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">TherapyGraph</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <Users className="w-4 h-4" />
          <span className="font-medium text-sm">Patients</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 w-full text-left">
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
