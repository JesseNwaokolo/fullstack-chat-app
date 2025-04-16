import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

function Navbar() {
  const { authUser, logout } = useAuthStore();

  const pathname = useLocation().pathname;

  return (
    <header className="border-b border-gray-900 fixed w-full top-0 z-40 backdrop-blur-lg bg-primary-foreground transition-colors">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat</h1>
            </Link>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={
                pathname.split("/")[1] === "settings"
                  ? "flex items-center gap-1 mx-2 hover:text-primary text-secondary-foreground underline underline-offset-4"
                  : "flex items-center gap-1 mx-2 hover:text-primary"
              }
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className={
                    pathname.split("/")[1] === "profile"
                      ? "flex items-center gap-1 mx-2 hover:text-primary text-secondary-foreground underline underline-offset-4"
                      : "flex items-center gap-1 mx-2 hover:text-primary"
                  }
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center mx-2 hover:text-primary"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
