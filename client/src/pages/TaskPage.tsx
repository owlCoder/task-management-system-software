import React from "react";
import Sidebar from "../components/dashboard/navbar/Sidebar";

const TaskPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Tasks</h1>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm bg-brand text-white"
            >
              Create Task
            </button>
          </div>
        </header>

        <section className="bg-white/5 rounded-lg p-6 min-h-[360px] text-white/80">
          <p className="mb-4">Task Page — under construction.</p>

          {/* Add your tasks list / components here */}
        </section>
      </main>
    </div>
  );
};

export default TaskPage;
