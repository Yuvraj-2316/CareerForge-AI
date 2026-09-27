
import {
  ArrowRight,
  FolderKanban,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Planned: "bg-indigo-50 text-indigo-700",
};

function RecentProjects({
  projects = [],
  isLoading = false,
  error = "",
}) {
  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Your latest portfolio work
          </p>
        </div>

        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <FolderKanban size={21} />
        </span>
      </div>

      {isLoading ? (
        <div
          role="status"
          className="mt-6 space-y-3"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border border-border-main p-4"
            >
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
            </div>
          ))}

          <span className="sr-only">
            Loading recent projects
          </span>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          Recent projects are temporarily unavailable.
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <FolderKanban size={24} />
          </div>

          <h3 className="mt-4 font-semibold text-navy">
            No projects added yet
          </h3>

          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Showcase your work, technologies and GitHub
            repositories in your CareerForge portfolio.
          </p>

          <Link
            to="/projects"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Plus size={17} />
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {[...projects]
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            )
            .slice(0, 3)
            .map((project) => (
              <div
                key={project.id || project._id}
                className="rounded-xl border border-border-main p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy">
                    {project.title}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[project.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">
                  {project.description}
                </p>

                {project.techStack?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack
                      .slice(0, 3)
                      .map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      <Link
        to="/projects"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        View all projects
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default RecentProjects;