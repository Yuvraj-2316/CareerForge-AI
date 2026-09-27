
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

function getMonday(date) {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(
    result.getDate() - ((day + 6) % 7)
  );
  result.setHours(12, 0, 0, 0);

  return result;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function WeeklyCalendar({
  tasks = [],
  isLoading = false,
  error = "",
}) {
  const [weekStart, setWeekStart] = useState(
    () => getMonday(new Date())
  );

  const [selectedDate, setSelectedDate] = useState(
    () => toDateKey(new Date())
  );

  const todayKey = toDateKey(new Date());

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(weekStart);
      date.setDate(
        weekStart.getDate() + index
      );
      return date;
    }
  );

  const weekEnd = weekDays[6];

  const monthLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? weekStart.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        })
      : `${weekStart.toLocaleDateString(
          "en-IN",
          { month: "short" }
        )} – ${weekEnd.toLocaleDateString(
          "en-IN",
          {
            month: "short",
            year: "numeric",
          }
        )}`;

  const selectedTasks = tasks.filter(
    (task) =>
      task.date === selectedDate &&
      !task.completed
  );

  function changeWeek(direction) {
    const nextMonday = new Date(weekStart);

    nextMonday.setDate(
      nextMonday.getDate() +
        direction * 7
    );

    setWeekStart(nextMonday);
    setSelectedDate(
      toDateKey(nextMonday)
    );
  }

  function goToToday() {
    const today = new Date();

    setWeekStart(getMonday(today));
    setSelectedDate(toDateKey(today));
  }

  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">
            This Week
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Your goal deadlines
          </p>
        </div>

        <span className="rounded-xl bg-indigo-50 p-3 text-primary">
          <CalendarDays size={21} />
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-navy">
          {monthLabel}
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg px-2 py-2 text-xs font-semibold text-primary hover:bg-indigo-50"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => changeWeek(-1)}
            aria-label="Previous week"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => changeWeek(1)}
            aria-label="Next week"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {weekDays.map((date) => {
          const dateKey = toDateKey(date);
          const isSelected =
            dateKey === selectedDate;
          const isToday =
            dateKey === todayKey;

          const hasTasks = tasks.some(
            (task) =>
              task.date === dateKey &&
              !task.completed
          );

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() =>
                setSelectedDate(dateKey)
              }
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl transition-colors ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-indigo-200"
                  : isToday
                    ? "bg-indigo-50 text-navy"
                    : "text-navy hover:bg-slate-100"
              }`}
            >
              <span
                className={`text-xs ${
                  isSelected
                    ? "text-indigo-100"
                    : "text-text-muted"
                }`}
              >
                {date.toLocaleDateString(
                  "en-IN",
                  { weekday: "short" }
                )}
              </span>

              <span className="text-sm font-bold">
                {date.getDate()}
              </span>

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasTasks
                    ? isSelected
                      ? "bg-white"
                      : "bg-primary"
                    : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-border-main pt-5">
        <h3 className="text-sm font-semibold text-navy">
          {new Date(
            `${selectedDate}T12:00:00`
          ).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
          })}
        </h3>

        {isLoading ? (
          <p className="mt-4 text-sm text-text-muted">
            Loading your schedule...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            Unable to load your schedule.
          </p>
        ) : selectedTasks.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <CalendarDays
              size={27}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 text-sm font-medium text-navy">
              No deadlines scheduled
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Goals due on this date will
              appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedTasks.map((task) => (
              <Link
                key={task.id}
                to="/goals"
                className="flex items-center justify-between gap-3 rounded-xl border border-border-main p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">
                    {task.title}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                    <Clock3 size={13} />
                    {task.category} deadline
                  </p>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-primary"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WeeklyCalendar;