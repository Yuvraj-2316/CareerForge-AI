
import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Pause,
  Play,
  CheckCircle2,
  RefreshCw,
  X,
  FolderKanban,
  Code2,
  FileUser,
  MessagesSquare,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const API_URL = "http://localhost:5001/api/goals";

const categories = [
  "DSA",
  "Projects",
  "Resume",
  "Interviews",
  "Custom",
];

const categoryStyles = {
  DSA: {
    icon: Code2,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  Projects: {
    icon: FolderKanban,
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  Resume: {
    icon: FileUser,
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  Interviews: {
    icon: MessagesSquare,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  Custom: {
    icon: Sparkles,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
};

const emptyForm = {
  title: "",
  category: "DSA",
  target: "",
  manualProgress: "0",
  deadline: "",
  status: "Active",
};

function Goals() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);
const [projectsLoading, setProjectsLoading] = useState(true);
const [projectsError, setProjectsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [filter, setFilter] = useState("All");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGoals() {
      setIsLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem(
          "careerforge_token"
        );

        if (!token) {
          throw new Error(
            "Please log in to view your goals."
          );
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load goals."
          );
        }

        if (!Array.isArray(data.goals)) {
          throw new Error(
            "Unexpected response from the server."
          );
        }

        if (!controller.signal.aborted) {
          setGoals(data.goals);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchGoals();

    return () => controller.abort();
  }, [retryCount]);


useEffect(() => {
  const controller = new AbortController();

  async function loadProjects() {
    setProjectsLoading(true);
    setProjectsError("");

    try {
      const token = sessionStorage.getItem(
        "careerforge_token"
      );

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        "http://localhost:5001/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load projects."
        );
      }

      if (!Array.isArray(data.projects)) {
        throw new Error("Unexpected projects response.");
      }

      if (!controller.signal.aborted) {
        setProjects(data.projects);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setProjectsError(error.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setProjectsLoading(false);
      }
    }
  }

  loadProjects();

  return () => controller.abort();
}, []);

  function getToken() {
    return sessionStorage.getItem(
      "careerforge_token"
    );
  }

  function openCreateModal() {
    setEditingGoal(null);
    setForm({ ...emptyForm });
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(goal) {
    setEditingGoal(goal);

    setForm({
      title: goal.title,
      category: goal.category,
      target: String(goal.target),
      manualProgress: String(
        goal.manualProgress ?? 0
      ),
      deadline: goal.deadline
        ? goal.deadline.slice(0, 10)
        : "",
      status: goal.status,
    });

    setFormError("");
    setShowModal(true);
  }

  function closeModal() {
    if (isSaving) return;

    setShowModal(false);
    setEditingGoal(null);
    setFormError("");
  }

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "category" &&
      value !== "Custom"
        ? { manualProgress: "0" }
        : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const target = Number(form.target);
    const manualProgress = Number(
      form.manualProgress
    );

    if (!form.title.trim()) {
      setFormError("Please enter a goal title.");
      return;
    }

    if (
      !Number.isSafeInteger(target) ||
      target < 1
    ) {
      setFormError(
        "Target must be a positive whole number."
      );
      return;
    }

    if (
      form.category === "Custom" &&
      (!Number.isSafeInteger(manualProgress) ||
        manualProgress < 0)
    ) {
      setFormError(
        "Progress must be a non-negative whole number."
      );
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      target,
      manualProgress:
        form.category === "Custom"
          ? manualProgress
          : 0,
      deadline: form.deadline || null,
      status: form.status,
    };

    setIsSaving(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Please log in again."
        );
      }

      const url = editingGoal
        ? `${API_URL}/${editingGoal._id}`
        : API_URL;

      const response = await fetch(url, {
        method: editingGoal ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save goal."
        );
      }

      if (editingGoal) {
        setGoals((previous) =>
          previous.map((goal) =>
            goal._id === editingGoal._id
              ? data.goal
              : goal
          )
        );
      } else {
        setGoals((previous) => [
          data.goal,
          ...previous,
        ]);
      }

      setShowModal(false);
      setEditingGoal(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(goal) {
    const confirmed = window.confirm(
      `Delete "${goal.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/${goal._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete goal."
        );
      }

      setGoals((previous) =>
        previous.filter(
          (item) => item._id !== goal._id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeStatus(goal, status) {
    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Please log in again."
        );
      }

      const payload = {
        title: goal.title,
        category: goal.category,
        target: goal.target,
        manualProgress:
          goal.category === "Custom"
            ? goal.manualProgress ?? 0
            : 0,
        deadline: goal.deadline,
        status,
      };

      const response = await fetch(
        `${API_URL}/${goal._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update goal status."
        );
      }

      setGoals((previous) =>
        previous.map((item) =>
          item._id === goal._id
            ? data.goal
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredGoals =
    filter === "All"
      ? goals
      : goals.filter(
          (goal) => goal.status === filter
        );

    const completedProjects = projects.filter(
  (project) => project.status === "Completed"
).length;

  const activeCount = goals.filter(
    (goal) => goal.status === "Active"
  ).length;

  const completedCount = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-60">
        <Topbar
          onMenuClick={() =>
            setIsSidebarOpen(true)
          }
        />

        <main className="mx-auto max-w-[1800px] p-5 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                My preparation
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
                Goals & Progress
              </h1>

              <p className="mt-2 text-text-muted">
                Set your own targets and track
                your career preparation.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              <Plus size={19} />
              Add Goal
            </button>
          </div>

          {/* API error */}
          {error && (
            <div
              role="alert"
              className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setRetryCount(
                    (count) => count + 1
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

          {/* Overview statistics */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <SummaryCard
              label="Total Goals"
              value={isLoading || error ? "—" : goals.length}
              icon={Target}
              color="text-indigo-600"
              background="bg-indigo-50"
            />

            <SummaryCard
              label="Active Goals"
              value={isLoading || error ? "—" : activeCount}
              icon={Play}
              color="text-blue-600"
              background="bg-blue-50"
            />

            <SummaryCard
              label="Completed"
              value={isLoading || error ? "—" : completedCount}
              icon={CheckCircle2}
              color="text-emerald-600"
              background="bg-emerald-50"
            />
          </div>

          {/* Status filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "All",
              "Active",
              "Paused",
              "Completed",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === item
                    ? "bg-primary text-white"
                    : "border border-border-main bg-white text-text-muted hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Goals grid */}
          {isLoading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-border-main bg-white p-8 text-center text-text-muted">
              Unable to display your goals.
              Please retry.
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
              <span className="rounded-2xl bg-indigo-50 p-4 text-primary">
                <Target size={32} />
              </span>

              <h2 className="mt-5 text-xl font-bold text-navy">
                {filter === "All"
                  ? "Set your first goal"
                  : `No ${filter.toLowerCase()} goals`}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
                Choose your own targets and
                deadlines. Your goals belong
                to your personal account.
              </p>

              {filter === "All" && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <Plus size={18} />
                  Create Goal
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredGoals.map((goal) => (
                <GoalCard
  key={goal._id}
  goal={goal}
  completedProjects={completedProjects}
  projectsLoading={projectsLoading}
  projectsError={projectsError}
  onEdit={() => openEditModal(goal)}
  onDelete={() => handleDelete(goal)}
  onStatusChange={(status) =>
    changeStatus(goal, status)
  }
/>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="goal-modal-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id="goal-modal-title"
                className="text-xl font-bold text-navy"
              >
                {editingGoal
                  ? "Edit Goal"
                  : "Create a Goal"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Close"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="goal-title"
                  className="mb-2 block text-sm font-semibold text-navy"
                >
                  Goal Title
                </label>

                <input
                  id="goal-title"
                  type="text"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Solve 50 DSA problems"
                  className="w-full rounded-xl border border-border-main px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="goal-category"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Category
                  </label>

                  <select
                    id="goal-category"
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-border-main bg-white px-4 py-3 outline-none focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="goal-target"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Your Target
                  </label>

                  <input
                    id="goal-target"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.target}
                    onChange={(event) =>
                      updateForm(
                        "target",
                        event.target.value
                      )
                    }
                    placeholder="Your target"
                    className="w-full rounded-xl border border-border-main px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {form.category === "Custom" && (
                <div>
                  <label
                    htmlFor="goal-progress"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Current Progress
                  </label>

                  <input
                    id="goal-progress"
                    type="number"
                    min="0"
                    step="1"
                    value={form.manualProgress}
                    onChange={(event) =>
                      updateForm(
                        "manualProgress",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-border-main px-4 py-3 outline-none focus:border-primary"
                  />

                  <p className="mt-2 text-xs text-text-muted">
                    Manual progress is available
                    for custom goals only.
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="goal-deadline"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Deadline (optional)
                  </label>

                  <input
                    id="goal-deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(event) =>
                      updateForm(
                        "deadline",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-border-main px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="goal-status"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Status
                  </label>

                  <select
                    id="goal-status"
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-border-main bg-white px-4 py-3 outline-none focus:border-primary"
                  >
                    <option value="Active">
                      Active
                    </option>
                    <option value="Paused">
                      Paused
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              {form.category !== "Custom" && (
                <p className="rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-700">
                  Your target will be saved now.
                  Automatic progress tracking
                  for this category will be
                  connected to its module later.
                </p>
              )}

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-border-main px-5 py-3 text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving..."
                    : editingGoal
                      ? "Save Changes"
                      : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  background,
}) {
  return (
    <div className="rounded-2xl border border-border-main bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${background} ${color}`}
      >
        <Icon size={22} />
      </div>

      <p className="mt-5 text-sm font-medium text-text-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-navy">
        {value}
      </p>
    </div>
  );
}

function GoalCard({
  goal,
  completedProjects,
  projectsLoading,
  projectsError,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const style =
    categoryStyles[goal.category] ||
    categoryStyles.Custom;

  const Icon = style.icon;

  const isCustom =
    goal.category === "Custom";

  const isProjects = goal.category === "Projects";

const projectDataAvailable =
  !projectsLoading && !projectsError;

const progress = isCustom
  ? goal.manualProgress ?? 0
  : isProjects && projectDataAvailable
    ? completedProjects
    : null;

  const percentage =
    progress !== null && goal.target > 0
      ? Math.min(
          100,
          Math.round(
            (progress / goal.target) * 100
          )
        )
      : null;

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }
      )
    : null;

  return (
    <article className="flex flex-col rounded-2xl border border-border-main bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
        >
          <Icon size={23} />
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            goal.status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : goal.status === "Paused"
                ? "bg-amber-50 text-amber-700"
                : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {goal.status}
        </span>
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-primary">
        {goal.category}
      </p>

      <h2 className="mt-2 text-lg font-bold text-navy">
        {goal.title}
      </h2>

      <div className="mt-5">
        {progress !== null ? (
          <>
            <div className="flex items-end justify-between">
              <p className="text-sm text-text-muted">
                {progress} / {goal.target}
              </p>

              <span className="text-sm font-bold text-navy">
                {percentage}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-navy">
              Your target: {goal.target}
            </p>

            <p className="mt-1 text-xs leading-5 text-text-muted">
  {isProjects
    ? projectsLoading
      ? "Loading your project progress..."
      : projectsError
        ? "Project progress is temporarily unavailable."
        : "Project progress unavailable."
    : "Automatic progress tracking coming soon."}
</p>
          </div>
        )}
      </div>

      {formattedDeadline && (
        <div className="mt-5 flex items-center gap-2 text-sm text-text-muted">
          <CalendarDays size={16} />
          {formattedDeadline}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border-main pt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${goal.title}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-primary"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${goal.title}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>

        {goal.status === "Active" ? (
          <button
            type="button"
            onClick={() =>
              onStatusChange("Paused")
            }
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700"
          >
            <Pause size={15} />
            Pause
          </button>
        ) : goal.status === "Paused" ? (
          <button
            type="button"
            onClick={() =>
              onStatusChange("Active")
            }
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary"
          >
            <Play size={15} />
            Resume
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default Goals;