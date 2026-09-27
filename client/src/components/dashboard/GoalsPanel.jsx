
import {
  ArrowRight,
  Code2,
  FolderKanban,
  FileUser,
  MessagesSquare,
  Target,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "DSA",
    title: "DSA Mastery",
    icon: Code2,
    color: "text-indigo-600",
    background: "bg-indigo-50",
  },
  {
    name: "Projects",
    title: "Build Portfolio",
    icon: FolderKanban,
    color: "text-sky-600",
    background: "bg-sky-50",
  },
  {
    name: "Resume",
    title: "Resume Development",
    icon: FileUser,
    color: "text-violet-600",
    background: "bg-violet-50",
  },
  {
    name: "Interviews",
    title: "Interview Preparation",
    icon: MessagesSquare,
    color: "text-amber-600",
    background: "bg-amber-50",
  },
  {
    name: "Custom",
    title: "Personal Goals",
    icon: Sparkles,
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },
];

function GoalsPanel({
  goals = [],
  projectStats = null,
  isLoading = false,
  error = "",
}) {
  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">
            Your Goals
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Your personalized preparation journey
          </p>
        </div>

        <span className="rounded-xl bg-indigo-50 p-3 text-primary">
          <Target size={21} />
        </span>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-text-muted">
          Loading your goals...
        </p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {categories.map((category) => {
            const categoryGoals = goals.filter(
              (goal) =>
                goal.category === category.name
            );

            return (
              <div key={category.name}>
                <div className="mb-3 flex items-center gap-2">
                  <category.icon
                    size={18}
                    className={category.color}
                  />
                  <h3 className="text-sm font-bold text-navy">
                    {category.title}
                  </h3>
                </div>

                {category.name === "Projects" &&
                  projectStats && (
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "Total",
                          value: projectStats.total,
                        },
                        {
                          label: "Completed",
                          value: projectStats.completed,
                        },
                        {
                          label: "In Progress",
                          value: projectStats.inProgress,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-lg bg-sky-50 p-2 text-center"
                        >
                          <p className="text-lg font-bold text-navy">
                            {stat.value}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                {categoryGoals.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-xs text-text-muted">
                    No personal target set
                  </p>
                ) : (
                  <div className="space-y-3">
                    {categoryGoals.map((goal) => {
                      let completed = null;

                      if (
                        goal.category === "Projects" &&
                        projectStats
                      ) {
                        completed =
                          projectStats.completed;
                      } else if (
                        goal.category === "Custom"
                      ) {
                        completed =
                          goal.manualProgress ?? 0;
                      }

                      const percentage =
                        completed !== null &&
                        goal.target > 0
                          ? Math.min(
                              100,
                              Math.round(
                                (completed /
                                  goal.target) *
                                  100
                              )
                            )
                          : null;

                      return (
                        <div
                          key={goal._id}
                          className="rounded-xl border border-border-main p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-navy">
                              {goal.title}
                            </p>
                            <span className="text-xs text-text-muted">
                              {goal.status}
                            </span>
                          </div>

                          {percentage !== null ? (
                            <>
                              <div className="mt-3 flex justify-between text-xs text-text-muted">
                                <span>
                                  {completed} /{" "}
                                  {goal.target}
                                </span>
                                <span>
                                  {percentage}%
                                </span>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <p className="mt-2 text-xs text-text-muted">
                              Target: {goal.target} ·
                              Activity tracking coming soon
                            </p>
                          )}

                          {goal.deadline && (
                            <p className="mt-3 text-xs text-text-muted">
                              Due:{" "}
                              {new Date(
                                goal.deadline
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  timeZone: "UTC",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link
        to="/goals"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-primary hover:bg-indigo-100"
      >
        <Plus size={17} />
        Manage Personal Goals
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default GoalsPanel;