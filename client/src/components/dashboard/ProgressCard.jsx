
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function ProgressCard({
  title,
  value,
  total,
  percentage,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBackground = "bg-primary-light",
  progressColor = "bg-primary",
  to,
}) {
  const hasProgress =
    typeof percentage === "number" &&
    Number.isFinite(percentage);

  const safePercentage = hasProgress
    ? Math.min(100, Math.max(0, percentage))
    : 0;

  const content = (
    <>
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}
        >
          {Icon && <Icon size={23} className={iconColor} />}
        </div>

        {to && (
          <ArrowUpRight
            size={18}
            className="text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-text-muted">
          {title}
        </p>

        <div className="mt-2 flex flex-wrap items-baseline gap-1">
          <span
            className={`font-extrabold text-navy ${
              typeof value === "number"
                ? "text-3xl"
                : "text-xl"
            }`}
          >
            {value ?? "Not started"}
          </span>

          {total != null && (
            <span className="text-sm text-text-muted">
              / {total}
            </span>
          )}
        </div>
      </div>

      {hasProgress && (
        <div
          role="progressbar"
          aria-label={`${title} progress`}
          aria-valuenow={safePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${safePercentage}%` }}
          />
        </div>
      )}

      <p
        className={`text-xs leading-5 text-text-muted ${
          hasProgress ? "mt-3" : "mt-5"
        }`}
      >
        {description}
      </p>
    </>
  );

  const className =
    "group flex min-h-[230px] flex-col justify-between rounded-2xl border border-border-main bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50";

  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default ProgressCard;