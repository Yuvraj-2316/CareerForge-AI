
import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Flame,
  BarChart3,
} from "lucide-react";

const days = [
  "Mon", "Tue", "Wed", "Thu",
  "Fri", "Sat", "Sun",
];

function CodeActivity({
  stats = null,
  isLoading = false,
}) {
  const [activeDay, setActiveDay] = useState(null);

  const activity = days.map((_, index) =>
    Math.max(
      0,
      Number(stats?.weeklyActivity?.[index]) || 0
    )
  );

  const maxActivity = Math.max(1, ...activity);
  const hasActivity = activity.some(
    (count) => count > 0
  );

  const points = activity.map((count, index) => ({
    x: 22 + index * 43,
    y: 112 - (count / maxActivity) * 83,
    count,
  }));

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    `${linePath} L 280 112 L 22 112 Z`;

  return (
    <section className="overflow-hidden rounded-2xl bg-navy p-5 text-white shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/25">
            <Code2
              size={25}
              className="text-indigo-300"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Your Code Activity
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Your coding practice at a glance
            </p>
          </div>
        </div>

        <a
          href="https://leetcode.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition hover:text-white"
        >
          Open LeetCode
          <ArrowUpRight size={16} />
        </a>
      </div>

      {isLoading ? (
        <div className="mt-8 h-44 animate-pulse rounded-xl bg-white/5" />
      ) : stats === null ? (
        <div className="mt-7 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center">
          <Code2
            size={32}
            className="text-indigo-300"
          />

          <h3 className="mt-4 font-semibold">
            Your coding activity will appear here
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            Once DSA tracking is available, your
            solved problems, streak and weekly activity
            will be displayed automatically.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-end">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              label="Solved"
              value={stats.solved ?? 0}
              icon={CheckCircle2}
              iconColor="text-emerald-400"
            />

            <Stat
              label="Current Streak"
              value={`${stats.streak ?? 0} days`}
              icon={Flame}
              iconColor="text-orange-400"
            />

            <Stat
              label="Attempted"
              value={stats.attempted ?? 0}
              icon={BarChart3}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Weekly Activity
              </h3>

              <span className="text-xs text-slate-400">
                Problems solved
              </span>
            </div>

            <div className="relative">
              <svg
                viewBox="0 0 302 143"
                role="img"
                aria-label={`Weekly problems solved: ${activity.join(", ")}`}
                className="w-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#818CF8"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="#818CF8"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[29, 70, 112].map((y) => (
                  <line
                    key={y}
                    x1="22"
                    y1={y}
                    x2="280"
                    y2={y}
                    stroke="#FFFFFF"
                    strokeOpacity="0.09"
                    strokeDasharray="4 5"
                  />
                ))}

                {hasActivity && (
                  <>
                    <path
                      d={areaPath}
                      fill="url(#activityGradient)"
                    />

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {points.map((point, index) => (
                  <g key={days[index]}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={activeDay === index ? 6 : 4}
                      fill="#818CF8"
                      stroke="#C7D2FE"
                      strokeWidth="1.5"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setActiveDay(index)
                      }
                      onMouseLeave={() =>
                        setActiveDay(null)
                      }
                      onClick={() =>
                        setActiveDay(
                          activeDay === index
                            ? null
                            : index
                        )
                      }
                    />

                    <text
                      x={point.x}
                      y="134"
                      fill="#CBD5E1"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {days[index]}
                    </text>
                  </g>
                ))}
              </svg>

              {activeDay !== null && (
                <div className="absolute right-0 top-0 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs shadow-lg">
                  <span className="font-semibold">
                    {days[activeDay]}
                  </span>

                  <span className="ml-2 text-indigo-300">
                    {activity[activeDay]} solved
                  </span>
                </div>
              )}
            </div>

            {!hasActivity && (
              <p className="mt-1 text-center text-xs text-slate-400">
                No problems logged this week.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  iconColor = "text-indigo-300",
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
      <p className="text-xs text-slate-300">
        {label}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xl font-bold">
          {value}
        </span>

        <Icon
          size={19}
          className={iconColor}
        />
      </div>
    </div>
  );
}

export default CodeActivity;