export function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Selamat datang di panel admin.</p>
      
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-lg">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Statistik Sistem</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pemantauan sistem akan hadir di sini.</p>
        </div>
      </div>
    </div>
  );
}
