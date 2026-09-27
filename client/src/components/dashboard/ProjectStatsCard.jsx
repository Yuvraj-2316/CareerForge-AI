
import {
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

function ProjectStatsCard({
  total = 0,
  completed = 0,
  isLoading = false,
  hasError = false,
}) {
  return (
    <Link
      to="/projects"
      className="
        group flex min-h-[230px] flex-col
        justify-between rounded-2xl
        border border-border-main bg-white
        p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-lg
        hover:shadow-indigo-100/50
      "
    >
      {/* Icon and navigation arrow */}
      <div className="flex items-start justify-between">
        <div
          className="
            flex h-11 w-11 items-center
            justify-center rounded-xl
            bg-blue-50 text-blue-600
          "
        >
          <FolderKanban size={23} />
        </div>

        <ArrowUpRight
          size={18}
          className="
            text-slate-300
            transition-all duration-300
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:text-primary
          "
        />
      </div>

      {/* Project statistics */}
      <div className="mt-5">
        <p className="text-sm font-medium text-text-muted">
          Total Projects
        </p>

        <p className="mt-2 text-3xl font-extrabold text-navy">
          {isLoading || hasError ? "—" : total}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
          {isLoading ? (
            <span>Loading projects...</span>
          ) : hasError ? (
            <span>Projects unavailable</span>
          ) : (
            <>
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />

              <span>
                {completed} completed
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProjectStatsCard;