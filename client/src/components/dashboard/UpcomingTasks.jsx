
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  return new Date(
    `${dateKey}T12:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function UpcomingTasks({
  tasks = [],
  isLoading = false,
  error = "",
}) {
  const today = localDateKey();

  const activeTasks = tasks.filter(
    (task) => task.date && !task.completed
  );

  const overdueTasks = activeTasks
    .filter((task) => task.date < today)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  const upcomingTasks = activeTasks
    .filter((task) => task.date >= today)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  const visibleTasks = [
    ...overdueTasks,
    ...upcomingTasks,
  ].slice(0, 4);

  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">
            Upcoming Tasks
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Your goals and upcoming deadlines
          </p>
        </div>

        <span className="rounded-xl bg-amber-50 p-3 text-amber-600">
          <CalendarDays size={22} />
        </span>
      </div>

      {isLoading ? (
        <p className="mt-7 text-sm text-text-muted">
          Loading your deadlines...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          Unable to load deadlines. {error}
        </p>
      ) : visibleTasks.length === 0 ? (
        <div className="mt-7 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={25} />
          </div>

          <h3 className="mt-4 font-semibold text-navy">
            No upcoming deadlines
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">
            Add a deadline to an active goal.
            It will appear here automatically.
          </p>

          <Link
            to="/goals"
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Manage goals
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {visibleTasks.map((task) => {
              const isOverdue = task.date < today;
              const isToday = task.date === today;

              return (
                <Link
                  key={task.id}
                  to="/goals"
                  className={`flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 ${
                    isOverdue
                      ? "border-red-200 bg-red-50/40"
                      : "border-border-main"
                  }`}
                >
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      isOverdue
                        ? "bg-red-500"
                        : "bg-primary"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-navy">
                      {task.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                      {isOverdue ? (
                        <AlertCircle
                          size={13}
                          className="text-red-600"
                        />
                      ) : (
                        <Clock3 size={13} />
                      )}

                      {isOverdue
                        ? `Overdue · ${formatDate(task.date)}`
                        : isToday
                          ? "Due today"
                          : formatDate(task.date)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-primary">
                      {task.category}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="text-slate-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            to="/goals"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all goals
            <ArrowUpRight size={15} />
          </Link>
        </>
      )}
    </section>
  );
}

export default UpcomingTasks;