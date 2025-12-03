import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuthHook";
import { UserDTO } from "../../../models/users/UserDTO";
import { DashboardNavbarProps } from "../../../types/DashboardNavbarType";

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userAPI,
}) => {
  const { user: authUser, logout, token } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser?.id && userAPI) {
        try {
          const userData = await userAPI.getUserById(token ?? "", authUser.id);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // No userAPI provided or no auth user — stop loading
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [authUser, userAPI, token]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleLogin = () => {
    console.log("Navigating to /auth");
    navigate("/auth"); // Navigate to the login page
  };

  const handleRegister = () => {
    console.log("Navigating to /register");
    navigate("/register"); // Navigate to the register page
  };

  return (
    <nav
      className="w-full backdrop-blur-md bg-white/10"
      style={{
        WebkitBackdropFilter: "blur(10px)",
        height: "50px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <div className="flex items-center text-white">
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--win11-text-primary)",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Task Management
            </Link>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div
              className="spinner"
              style={{ width: "20px", height: "20px", borderWidth: "2px" }}
            ></div>
          ) : user ? (
            <>
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--win11-divider)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--win11-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#000",
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col" style={{ gap: 0 }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--win11-text-primary)",
                  }}
                >
                  {user.email}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--win11-text-tertiary)",
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button
                className="text-white font-semibold hover:text-red-400 cursor-pointer"
                onClick={handleLogout}
                style={{ padding: "8px 16px" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M6 2v2H3v8h3v2H2V2h4zm4 3l4 3-4 3V9H6V7h4V5z" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="text-white font-semibold hover:text-blue-400 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="text-white font-semibold hover:text-blue-400 cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;