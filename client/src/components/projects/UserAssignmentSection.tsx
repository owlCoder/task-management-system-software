import React, { useState } from "react";

type AssignedUser = {
    user_id: number;
    weekly_hours: number;
    pu_id?: number;
};

type Props = {
    assignedUsers: AssignedUser[];
    weeklyHoursPerWorker: number; // NOVO: sati koji se dodeljuju radnicima
    onAddUser: (userId: number) => Promise<boolean>; // IZMENJENO: bez weeklyHours parametra
    onRemoveUser: (userId: number) => Promise<boolean>;
    isLoading?: boolean;
};

export const UserAssignmentSection: React.FC<Props> = ({
    assignedUsers,
    weeklyHoursPerWorker,
    onAddUser,
    onRemoveUser,
    isLoading = false,
}) => {
    const [newUserId, setNewUserId] = useState("");
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        const userId = parseInt(newUserId, 10);

        if (isNaN(userId) || userId <= 0) {
            setError("Please enter a valid user ID");
            return;
        }
        if (assignedUsers.some(u => u.user_id === userId)) {
            setError("User is already assigned to this project");
            return;
        }

        setAdding(true);
        setError("");
        
        const success = await onAddUser(userId);
        if (success) {
            setNewUserId("");
        } else {
            setError("Failed to add user. Check if user exists and has available hours.");
        }
        setAdding(false);
    };

    const handleRemove = async (userId: number) => {
        await onRemoveUser(userId);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                Assign Workers (each will receive {weeklyHoursPerWorker} hrs/week)
            </h3>
            
            {/* Lista assignovanih korisnika */}
            {assignedUsers.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto styled-scrollbar">
                    {assignedUsers.map((user) => (
                        <div
                            key={user.user_id}
                            className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                        >
                            <span className="text-sm text-white/80">
                                User ID: {user.user_id} ({user.weekly_hours} hrs/week)
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRemove(user.user_id)}
                                className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                                disabled={isLoading}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Form za dodavanje novog korisnika - IZMENJENO: samo User ID */}
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="User ID"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={adding || isLoading}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                    {adding ? "..." : "Add"}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
};

export default UserAssignmentSection;