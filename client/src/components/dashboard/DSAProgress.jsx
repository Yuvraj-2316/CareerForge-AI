
import {
  ArrowRight,
  Code2,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const difficultyStyles = {
  Easy: {
    text: "text-emerald-600",
    background: "bg-emerald-50",
  },
  Medium: {
    text: "text-amber-600",
    background: "bg-amber-50",
  },
  Hard: {
    text: "text-rose-600",
    background: "bg-rose-50",
  },
};

function DSAProgress({
  stats = null,
  isLoading = false,
}) {
  const difficulties = [
    {
      label: "Easy",
      solved: stats?.easy ?? 0,
    },
    {
      label: "Medium",
      solved: stats?.medium ?? 0,
    },
    {
      label: "Hard",
      solved: stats?.hard ?? 0,
    },
  ];

  const totalSolved = stats?.solved ??
    difficulties.reduce(
      (sum, item) => sum + item.solved,
      0
    );

  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">
            DSA Progress
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Your problem-solving journey
          </p>
        </div>

        <span className="rounded-xl bg-primary-light p-2.5 text-primary">
          <Code2 size={21} />
        </span>
      </div>

      {isLoading ? (
        <div className="mt-8 animate-pulse space-y-4">
          <div className="h-8 w-24 rounded bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      ) : stats === null ? (
        <div className="mt-7 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <BookOpen size={27} />
          </span>

          <h3 className="mt-4 font-semibold text-navy">
            Start your DSA journey
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
            Your solved problems and difficulty-wise
            statistics will appear here once DSA
            tracking is available.
          </p>
        </div>
      ) : (
        <div className="mt-7">
          <div className="rounded-xl bg-indigo-50 p-5">
            <p className="text-sm font-medium text-indigo-700">
              Total problems solved
            </p>

            <p className="mt-2 text-4xl font-extrabold text-navy">
              {totalSolved}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {difficulties.map((item) => {
              const style = difficultyStyles[item.label];

              return (
                <div
                  key={item.label}
                  className={`rounded-xl p-3 text-center ${style.background}`}
                >
                  <p className={`text-xs font-semibold ${style.text}`}>
                    {item.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-navy">
                    {item.solved}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Link
        to="/dsa"
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Explore DSA Practice
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default DSAProgress;