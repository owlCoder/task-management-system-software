import React, { useState, useEffect } from "react";
import { ProjectUserDTO } from "../../models/project/ProjectUserDTO";
import { toast } from 'react-hot-toast';
import type { Props } from "../../types/props/ManageProjectUserModalProps";

export const ManageProjectUsersModal: React.FC<Props> = ({
    projectId,
    projectName,
    weeklyHoursPerWorker,
    isOpen,
    onClose,
    onUsersUpdated,
    projectAPI,
}) => {
    const [assignedUsers, setAssignedUsers] = useState<ProjectUserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen && projectId) {
            loadAssignedUsers();
        }
    }, [isOpen, projectId]);

    useEffect(() => {
        if (!isOpen) {
            setNewUsername("");
            setError("");
            setAssignedUsers([]);
        }
    }, [isOpen]);

    const loadAssignedUsers = async () => {
        if (!projectId) return;
        setIsLoading(true);
        setError("");
        try {
            const users = await projectAPI.getProjectUsers(projectId);
            setAssignedUsers(users);
        } catch (err) {
            console.error("Failed to load assigned users:", err);
            setError("Failed to load users. Please try again.");
        }
        setIsLoading(false);
    };

    const handleAddUser = async () => {
        if (!projectId) return;
        
        const username = newUsername.trim();

        if (!username) {
            setError("Please enter a username");
            return;
        }

        if (username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        setIsAdding(true);
        setError("");

        try {
            const newUser = await projectAPI.assignUserToProject(
                projectId,
                username,  // Sada šaljemo username
                weeklyHoursPerWorker
            );
            setAssignedUsers(prev => [...prev, newUser]);
            setNewUsername("");
            onUsersUpdated?.();
            toast.success("User added to project successfully!");
        } catch (err: any) {
            console.error("Failed to assign user:", err);
            const errorMessage = err.response?.data?.message || "Failed to add user. Check if user exists and has available hours.";
            setError(errorMessage);
        }
        setIsAdding(false);
    };

    const handleRemoveUser = async (userId: number) => {
        if (!projectId) return;
        
        try {
            const success = await projectAPI.removeUserFromProject(projectId, userId);
            if (success) {
                setAssignedUsers(prev => prev.filter(u => u.user_id !== userId));
                onUsersUpdated?.();
                toast.success("User removed from project successfully!");
            }
        } catch (err) {
            console.error("Failed to remove user:", err);
            setError("Failed to remove user. Please try again.");
        }
    };

    if (!isOpen || !projectId) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="
                    bg-white/10 border border-white/20 rounded-2xl shadow-2xl
                    max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden text-white
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                    <div>
                        <h2
                            className="text-2xl font-semibold"
                            style={{ fontFamily: "var(--font-secondary)" }}
                        >
                            Manage Users
                        </h2>
                        <p className="text-sm text-white/60 mt-1">
                            {projectName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 styled-scrollbar space-y-4">
                    {/* Info banner */}
                    <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                        <p className="text-sm text-white/80">
                            Each worker will be assigned <span className="font-semibold text-white">{weeklyHoursPerWorker} hours/week</span>.
                        </p>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-white/60">Loading users...</div>
                        </div>
                    )}

                    {/* Assigned Users List */}
                    {!isLoading && (
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">
                                Assigned Users ({assignedUsers.length})
                            </h3>
                            
                            {assignedUsers.length === 0 ? (
                                <div className="bg-white/5 rounded-lg px-4 py-6 text-center">
                                    <p className="text-white/50 text-sm">
                                        No users assigned yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto styled-scrollbar">
                                    {assignedUsers.map((user) => (
                                        <div
                                            key={user.user_id}
                                            className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium uppercase">
                                                    {user.image_url ? (
                                                        <img
                                                            src={user.image_url}
                                                            alt={user.username || "User"}
                                                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/default-avatar.png"; }} // fallback na default sliku
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium uppercase">
                                                            {user.username?.charAt(0) || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-sm text-white font-medium">
                                                        {user.username || `User ${user.user_id}`}
                                                    </span>
                                                    <p className="text-xs text-white/50">
                                                        {user. role_name || "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                            {user.role_name !== "Project Manager" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveUser(user.user_id)}
                                                    className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer transition px-3 py-1 rounded hover:bg-red-500/10"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add User Form */}
                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">
                            Add New User
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Username"
                                value={newUsername}
                                onChange={(e) => {
                                    setNewUsername(e.target.value);
                                    setError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddUser();
                                    }
                                }}
                                className="
                                    flex-1 px-4 py-2 rounded-lg 
                                    bg-white/10 border border-white/20 
                                    focus:outline-none focus:border-white/40
                                    text-white placeholder-white/40
                                "
                                disabled={isAdding}
                            />
                            <button
                                type="button"
                                onClick={handleAddUser}
                                disabled={isAdding || !newUsername.trim()}
                                className={`
                                    px-6 py-2 rounded-lg font-medium transition
                                    ${isAdding || !newUsername.trim()
                                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                                        : "bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                                    }
                                `}
                            >
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                        </div>
                        
                        {error && (
                            <p className="text-red-400 text-sm mt-2">{error}</p>
                        )}
                        
                        <p className="text-white/40 text-xs mt-2">
                            Enter the exact username of the user you want to add.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-center">
                    <button
                        onClick={onClose}
                        className="
                            px-8 py-2 rounded-lg font-semibold
                            bg-gradient-to-t
                            from-[var(--palette-medium-blue)]
                            to-[var(--palette-deep-blue)]
                            cursor-pointer transition hover:opacity-90
                        "
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageProjectUsersModal;