import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-4 md:px-6 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg hidden sm:block">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
          NR
        </div>
      </div>
    </header>
  );
}
