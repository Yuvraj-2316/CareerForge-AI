import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const API_URL = "http://localhost:5001/api/projects";

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  status: "In Progress",
};

const statusStyles = {
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Planned: "bg-indigo-50 text-indigo-700",
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const token = sessionStorage.getItem("careerforge_token");
        if (!token) throw new Error("Please log in to view your projects.");

        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load projects.");
        if (!Array.isArray(data.projects)) throw new Error("Unexpected projects response.");
        setProjects(data.projects.map((project) => ({ ...project, id: project._id })));
        setLoadError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setLoadError(err.message || "Could not connect to the backend.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  const completedCount = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const inProgressCount = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(query)
      );

    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      status: project.status,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Project title and description are required.");
      return;
    }

    for (const url of [form.githubUrl, form.liveUrl]) {
      if (!url.trim()) continue;
      try {
        const parsed = new URL(url.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        setError("Please enter valid HTTP or HTTPS URLs.");
        return;
      }
    }

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      techStack: [...new Set(form.techStack.split(",").map((tech) => tech.trim()).filter(Boolean))],
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      status: form.status,
    };

    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("careerforge_token");
      if (!token) throw new Error("Your session has expired. Please log in again.");
      const response = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save project.");
      if (!data.project?._id) throw new Error("Unexpected response from backend.");
      const saved = { ...data.project, id: data.project._id };
      if (editingId) {
        setProjects((previous) => previous.map((project) => project.id === editingId ? saved : project));
      } else {
        setProjects((previous) => [saved, ...previous]);
      }
      closeForm();
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      const token = sessionStorage.getItem("careerforge_token");
      if (!token) throw new Error("Your session has expired. Please log in again.");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete project.");
      setProjects((previous) => previous.filter((project) => project.id !== id));
    } catch (err) {
      window.alert(err.message || "Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-60">
        <Topbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="mx-auto max-w-[1500px] p-5 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                MY PORTFOLIO
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
                My Projects
              </h1>

              <p className="mt-2 text-sm text-text-muted sm:text-base">
                Showcase what you've built and track your
                project journey.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-indigo-200"
            >
              <Plus size={19} />
              Add Project
            </button>
          </div>

          {/* Overview */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total Projects"
              value={projects.length}
              icon={FolderKanban}
              iconBackground="bg-indigo-50"
              iconColor="text-indigo-600"
            />

            <SummaryCard
              title="Completed"
              value={completedCount}
              icon={Code2}
              iconBackground="bg-emerald-50"
              iconColor="text-emerald-600"
            />

            <SummaryCard
              title="In Progress"
              value={inProgressCount}
              icon={ArrowUpRight}
              iconBackground="bg-amber-50"
              iconColor="text-amber-600"
            />
          </div>

          {/* Search and filter */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-border-main bg-white px-4 sm:max-w-md">
              <Search size={19} className="text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects or technologies..."
                aria-label="Search projects"
                className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter by project status"
              className="h-11 rounded-xl border border-border-main bg-white px-4 text-sm font-medium text-navy outline-none focus:border-primary"
            >
              <option value="All">All Projects</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
            </select>
          </div>

          {loadError && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {loadError} Check that your backend is running and you are logged in.
            </div>
          )}

          {/* Project list */}
          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-border-main bg-white p-10 text-center text-text-muted">
              Loading your projects...
            </div>
          ) : loadError ? null : filteredProjects.length === 0 ? (
            <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <FolderKanban size={31} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-navy">
                {projects.length === 0
                  ? "Your portfolio starts here"
                  : "No matching projects"}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                {projects.length === 0
                  ? "Add your first project and start building a portfolio that showcases your skills."
                  : "Try a different search or change the status filter."}
              </p>

              {projects.length === 0 && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <Plus size={18} />
                  Add Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
<article
  key={project.id}
  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
>
  {/* Premium navy header */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#111D3B] via-[#172554] to-[#312E81] p-6">
    {/* Decorative background */}
    <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-indigo-400/10 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="flex h-13 w-13 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-indigo-200 transition-transform duration-300 group-hover:scale-105">
        <FolderKanban size={25} />
      </div>

      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
          statusStyles[project.status] ||
          "bg-slate-100 text-slate-700"
        }`}
      >
        {project.status}
      </span>
    </div>

    <div className="relative mt-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-300">
        Portfolio Project
      </p>

      <h2 className="mt-2 break-words text-xl font-bold tracking-tight text-white">
        {project.title}
      </h2>

      <p className="mt-3 line-clamp-3 min-h-[60px] break-words text-sm leading-5 text-slate-300">
        {project.description}
      </p>
    </div>
  </div>

  {/* Card body */}
  <div className="flex flex-1 flex-col p-5">
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Tech Stack
      </h3>

      <div className="mt-3 flex min-h-10 flex-wrap content-start gap-2">
        {project.techStack?.length > 0 ? (
          project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:border-indigo-200 hover:bg-indigo-100"
            >
              {tech}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">
            No technologies added
          </span>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
      <div className="flex items-center gap-2">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            title="View GitHub repository"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-primary"
          >
            <GitBranch size={19} />
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View live demo of ${project.title}`}
            title="View live demo"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-primary"
          >
            <ExternalLink size={19} />
          </a>
        )}

        {!project.githubUrl && !project.liveUrl && (
          <span className="text-xs text-slate-400">
            No links added
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openEditForm(project)}
          aria-label={`Edit ${project.title}`}
          title="Edit project"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-primary"
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleDelete(project.id)}
          aria-label={`Delete ${project.title}`}
          title="Delete project"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
</article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Project modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="project-form-title"
                  className="text-xl font-bold text-navy"
                >
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Share the details of what you've built.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close project form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField
                label="Project Title"
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="e.g. University FAQ Assistant"
                required
              />

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-2 block text-sm font-semibold text-navy"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  required
                  placeholder="What does your project do?"
                  className="w-full resize-y rounded-xl border border-border-main px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <FormField
                label="Tech Stack"
                name="techStack"
                value={form.techStack}
                onChange={updateField}
                placeholder="React, Node.js, MongoDB"
                hint="Separate technologies with commas."
              />

              <FormField
                label="GitHub URL"
                name="githubUrl"
                value={form.githubUrl}
                onChange={updateField}
                placeholder="https://github.com/username/project"
                type="url"
              />

              <FormField
                label="Live Demo URL"
                name="liveUrl"
                value={form.liveUrl}
                onChange={updateField}
                placeholder="https://your-project.vercel.app"
                type="url"
              />

              <div>
                <label
                  htmlFor="project-status"
                  className="mb-2 block text-sm font-semibold text-navy"
                >
                  Project Status
                </label>

                <select
                  id="project-status"
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="w-full rounded-xl border border-border-main bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-border-main pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-border-main px-5 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Project"}
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
  title,
  value,
  icon: Icon,
  iconBackground,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-border-main bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}
      >
        <Icon size={22} className={iconColor} />
      </div>

      <p className="mt-4 text-sm font-medium text-text-muted">
        {title}
      </p>

      <p className="mt-1 text-3xl font-extrabold text-navy">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={`project-${name}`}
        className="mb-2 block text-sm font-semibold text-navy"
      >
        {label}
      </label>

      <input
        id={`project-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-border-main px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-indigo-100"
      />

      {hint && (
        <p className="mt-1 text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Projects;