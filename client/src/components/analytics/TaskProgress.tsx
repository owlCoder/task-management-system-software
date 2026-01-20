import { useEffect, useState } from "react";

interface TaskProgressProps {
    task_id: number;
    ideal: number;
    real: number;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ task_id, ideal, real }) => {
    const [idealWidth, setIdealWidth] = useState(0);
    const [realWidth, setRealWidth] = useState(0);

    useEffect(() => {
        // animiraj nakon mount-a
        const timeout = setTimeout(() => {
            setIdealWidth(Math.min(ideal, 100));
            setRealWidth(Math.min(real, 100));
        }, 50);

        return () => clearTimeout(timeout);
    }, [ideal, real]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow">
            <h3 className="text-white font-semibold mb-4">Task #{task_id}</h3>

            {/* IDEAL */}
            <div className="mb-3">
                <p className="text-sm text-white/60 mb-1">Ideal progress</p>
                <div
                    className="h-4 bg-blue-400 rounded-full transition-all duration-1000 ease-out opacity-50"
                    style={{ width: `${idealWidth}%` }}
                />
            </div>

            {/* REAL */}
            <div>
                <p className="text-sm text-white/60 mb-1">Real progress</p>
                <div
                    className="h-4 bg-yellow-400 rounded-full transition-all duration-1000 ease-out opacity-50"
                    style={{ width: `${realWidth}%` }}
                />
            </div>
        </div>
    );
};
