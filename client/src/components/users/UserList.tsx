import React, {useEffect, useState} from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";

type UserListProps = {
    userAPI: IUserAPI;
};

const backgroundImage = new URL("../../helpers/pictures/pozadina.png", import.meta.url).href;
const defaultProfileImage = new URL("../../helpers/pictures/user.png", import.meta.url).href;

export const UserList: React.FC<UserListProps> = ({ userAPI }) => {
    const {user: authUser, token} = useAuth();
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if(!token) return;
            try {
                const allUsers = await userAPI.getAllUsers(token);
                setUsers(allUsers);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [token, userAPI]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start"
              style={{backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backdropFilter: "blur(3px)",
                      padding: "2rem",
                    }}  
        >
            {authUser && (
                <div className="w-full max-w-4xl p-6 rounded-xl flex flex-col gap-2 text-white mb-6"
                style={{ backgroundColor: "rgba(10, 25, 60, 0.85)" }}
                >
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">{authUser.username}</h2>
                        <p className="text-sm text-blue-200">{authUser.role}</p>
                    </div>
                </div>

            )}

            <div className="w-full max-w-4xl flex flex-col gap-4">
                {isLoading ? (
                    <p className="text-white">Loading users...</p>
                ) : (
                    users.map((u) => (
                        <div key={u.id}
                            className="flex items-center gap-4 p-4 rounded-lg"
                            style={{ backgroundColor: "rgba(20, 40, 90, 0.85)" }}
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden text-black font-bold"
                                style={{ backgroundColor: u.profileImage ? "transparent" : "#8faad4" }}  
                            >
                                {u.profileImage ? (
                                    <img src={u.profileImage} alt={u.username} className="w-full h-full object-cover" />
                                ) : (
                                    <img src= {defaultProfileImage} alt="default profile picture" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex flex-col text-white">
                                 <span className="font-semibold">{u.username}</span>
                                 <span className="text-sm text-blue-200">{u.role}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>     
    );
};

export default UserList;

