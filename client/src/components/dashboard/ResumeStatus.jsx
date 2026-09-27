
import {
  ArrowRight,
  FileSearch,
  FileUser,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

function ResumeStatus({
  analysis = null,
  isLoading = false,
}) {
  return (
    <section className="rounded-2xl border border-border-main bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">
            Resume Analysis
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Understand and improve your resume
          </p>
        </div>

        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
          <FileUser size={22} />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-7 h-40 animate-pulse rounded-xl bg-slate-100" />
      ) : analysis === null ? (
        <div className="mt-7 flex flex-col items-center rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
            <FileSearch size={29} />
          </span>

          <h3 className="mt-4 text-lg font-bold text-navy">
            No resume analyzed yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
            Upload your resume to receive feedback
            on skills, formatting and job-description
            alignment when Resume Analyzer is available.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-medium text-violet-700">
            <Upload size={17} />
            Resume Analyzer coming soon
          </div>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-sm font-medium text-violet-700">
              Latest analysis
            </p>

            <h3 className="mt-2 text-xl font-bold text-navy">
              {analysis.title || "Resume reviewed"}
            </h3>

            {analysis.matchScore != null && (
              <p className="mt-2 text-sm text-text-muted">
                Estimated job-description match:{" "}
                <span className="font-bold text-violet-700">
                  {analysis.matchScore}%
                </span>
              </p>
            )}
          </div>

          {analysis.summary && (
            <p className="text-sm leading-6 text-text-muted">
              {analysis.summary}
            </p>
          )}
        </div>
      )}

      <Link
        to="/resume"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Explore Resume Builder
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default ResumeStatus;