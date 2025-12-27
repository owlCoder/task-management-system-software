import React from "react";
import { TaskDTO } from "../../models/task/TaskDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import TaskListItem from "./TaskListItem";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskDTO[];
  onSelect: (taskId: number) => void;
  selectedTaskId: number | null;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onSelect, 
  selectedTaskId,
  onStatusChange
}) => {
  
  const columnTasks = tasks.filter((task) => task.task_status === status);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if(taskId) {
      onStatusChange(Number(taskId), status);
    }
  };

  return (
    <div 
     onDragOver={handleDragOver}
     onDrop={handleDrop}
     className="flex flex-col w-[320px] min-w-[320px] bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 h-full max-h-full overflow-hidden shadow-2xl">
      
      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status === TaskStatus.IN_PROGRESS ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
            status === TaskStatus.PENDING     ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
            status === TaskStatus.COMPLETED   ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
            status === TaskStatus.CREATED     ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
            status === TaskStatus.CANCELLED   ? 'bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.5)]' :
            'bg-white/20'
        }`} />
          <h3 className="text-white font-black uppercase tracking-widest text-[11px]">{title}</h3>
        </div>
        
        <span className="bg-white/10 text-white/40 px-2 py-0.5 rounded-md text-[10px] font-mono border border-white/5">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3 styled-scrollbar bg-gradient-to-b from-transparent to-black/5">
        {columnTasks.length > 0 ? (
          columnTasks.map((task) => (
            <div 
              key={task.task_id}
              draggable = {true}
              onDragStart={(e) => e.dataTransfer.setData("taskId", task.task_id.toString())}
              className={`transition-all duration-300 ${
                selectedTaskId === task.task_id ? 'ring-2 ring-blue-500/50 scale-[1.02] z-10' : ''
              }`}
            >
              <TaskListItem 
                task={task} 
                onSelect={onSelect}
              />
            </div>
          ))
        ) : (
          <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;