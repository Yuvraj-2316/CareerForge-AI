
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  FolderKanban,
  FileUser,
  Sparkles,
  MessagesSquare,
  Target,
  UsersRound,
  Settings,
  LogOut,
  Rocket,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "DSA Practice", icon: Code2, path: "/dsa" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Resume Builder", icon: FileUser, path: "/resume" },
  { label: "AI Career Coach", icon: Sparkles, path: "/ai-coach" },
  { label: "Interview Prep", icon: MessagesSquare, path: "/interviews" },
  { label: "Goals & Progress", icon: Target, path: "/goals" },
  { label: "Community", icon: UsersRound, path: "/community" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    onClose();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-60
          flex-col bg-navy text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between px-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Rocket size={23} className="text-indigo-300" />
            </span>

            <span className="text-lg font-extrabold tracking-tight">
              CareerForge{" "}
              <span className="text-indigo-400">AI</span>
            </span>
          </NavLink>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 overflow-y-auto px-4 py-3"
        >
          {navigation.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `
                flex min-h-11 items-center gap-3
                rounded-xl px-3 py-3 text-sm font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-indigo-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="shrink-0 space-y-4 p-4">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm font-medium text-white">
              Better skills.
              <br />
              Bigger opportunities.
            </p>

            <Rocket
              size={42}
              strokeWidth={1.3}
              className="mt-5 text-indigo-400"
            />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;