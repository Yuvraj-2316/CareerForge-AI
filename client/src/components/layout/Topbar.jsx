
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Student";

  function handleLogout() {
    logout();
    setShowProfile(false);
    navigate("/login", { replace: true });
  }

  function handleSearch(e) {
    e.preventDefault();

    const query = search.trim().toLowerCase();

    const pages = [
      { keyword: "dashboard", path: "/dashboard" },
      { keyword: "dsa", path: "/dsa" },
      { keyword: "project", path: "/projects" },
      { keyword: "resume", path: "/resume" },
      { keyword: "goal", path: "/goals" },
    ];

    const match = pages.find((page) =>
      query.includes(page.keyword)
    );

    if (match) {
      navigate(match.path);
      setSearch("");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-border-main bg-white px-4 sm:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="rounded-xl p-2 text-navy hover:bg-slate-100 lg:hidden"
      >
        <Menu size={23} />
      </button>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="flex h-11 min-w-0 max-w-2xl flex-1 items-center gap-3 rounded-xl bg-slate-100 px-4"
      >
        <Search
          size={19}
          className="shrink-0 text-slate-500"
        />

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search DSA, projects, resume..."
          aria-label="Search pages"
          className="w-full min-w-0 bg-transparent text-sm text-navy outline-none placeholder:text-slate-400"
        />
      </form>

      {/* Right controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <Bell size={20} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-border-main bg-white p-4 shadow-xl">
              <h3 className="font-bold text-navy">
                Notifications
              </h3>

              <p className="mt-3 text-sm text-text-muted">
                You're all caught up! Your reminders
                will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={showProfile}
            aria-label="Open profile menu"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {firstName.charAt(0).toUpperCase()}
            </span>

            <span className="hidden text-sm font-semibold text-navy sm:block">
              {firstName}
            </span>

            <ChevronDown
              size={15}
              className="hidden text-slate-500 sm:block"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-xl border border-border-main bg-white shadow-xl">
              <div className="border-b border-border-main p-4">
                <p className="font-semibold text-navy">
                  {user?.name}
                </p>

                <p className="mt-1 break-all text-xs text-text-muted">
                  {user?.email}
                </p>
              </div>

              <div className="p-2">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted">
                  <UserRound size={17} />
                  Student account
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;