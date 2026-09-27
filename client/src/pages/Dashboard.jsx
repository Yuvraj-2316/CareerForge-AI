
import { useEffect, useState } from "react";
import {
  Code2,
  FileUser,
  UsersRound,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ProjectStatsCard from "../components/dashboard/ProjectStatsCard";
import { useAuth } from "../context/AuthContext";
import {
  getGoalTasks,
  getUpcomingGoalTasks,
} from "../utils/goalTasks";
import ProgressCard from "../components/dashboard/ProgressCard";
import CodeActivity from "../components/dashboard/CodeActivity";
import DSAProgress from "../components/dashboard/DSAProgress";
import RecentProjects from "../components/dashboard/RecentProjects";
import ResumeStatus from "../components/dashboard/ResumeStatus";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import GoalsPanel from "../components/dashboard/GoalsPanel";
import WeeklyCalendar from "../components/dashboard/WeeklyCalendar";
import CareerCoachCard from "../components/dashboard/CareerCoachCard";

const PROJECTS_API =
  "http://localhost:5001/api/projects";

const GOALS_API =
  "http://localhost:5001/api/goals";

function Dashboard() {
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectsError, setProjectsError] =
    useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Goals state
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] =
    useState(true);
  const [goalsError, setGoalsError] =
    useState("");
  const [goalsRetryCount, setGoalsRetryCount] =
    useState(0);

  const firstName =
    user?.name?.split(" ")[0] || "Student";

  // Fetch the logged-in student's projects
  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setIsLoading(true);
      setProjectsError("");

      try {
        const token = sessionStorage.getItem(
          "careerforge_token"
        );

        if (!token) {
          throw new Error(
            "Please log in again to view your projects."
          );
        }

        const response = await fetch(
          PROJECTS_API,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session expired. Please log in again."
            );
          }

          throw new Error(
            data.message ||
              "Unable to load projects."
          );
        }

        if (!Array.isArray(data.projects)) {
          throw new Error(
            "Unexpected projects response from server."
          );
        }

        const normalizedProjects =
          data.projects.map((project) => ({
            ...project,
            id: project._id,
          }));

        if (!controller.signal.aborted) {
          setProjects(normalizedProjects);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setProjectsError(
          error.message ||
            "Unable to load projects."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, [retryCount]);

  // Fetch the logged-in student's goals
  useEffect(() => {
    const controller = new AbortController();

    async function loadGoals() {
      setGoalsLoading(true);
      setGoalsError("");

      try {
        const token = sessionStorage.getItem(
          "careerforge_token"
        );

        if (!token) {
          throw new Error(
            "Please log in again to view your goals."
          );
        }

        const response = await fetch(
          GOALS_API,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session expired. Please log in again."
            );
          }

          throw new Error(
            data.message ||
              "Unable to load goals."
          );
        }

        if (!Array.isArray(data.goals)) {
          throw new Error(
            "Unexpected goals response from server."
          );
        }

        if (!controller.signal.aborted) {
          setGoals(data.goals);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setGoalsError(
          error.message ||
            "Unable to load goals."
        );
      } finally {
        if (!controller.signal.aborted) {
          setGoalsLoading(false);
        }
      }
    }

    loadGoals();

    return () => controller.abort();
  }, [goalsRetryCount]);

  // Actual project statistics
  const projectCount = projects.length;

  const completedProjects = projects.filter(
    (project) =>
      project.status === "Completed"
  ).length;

  const inProgressProjects = projects.filter(
    (project) =>
      project.status === "In Progress"
  ).length;

  const hasProjectData =
    !isLoading && !projectsError;

  // Task tracking is not connected yet
  const tasks = goalsError
  ? []
  : getGoalTasks(goals);

const upcomingTasks = goalsError
  ? []
  : getUpcomingGoalTasks(goals);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() =>
          setIsSidebarOpen(false)
        }
      />

      <div className="min-h-screen lg:ml-60">
        <Topbar
          onMenuClick={() =>
            setIsSidebarOpen(true)
          }
        />

        <main className="mx-auto max-w-[1800px] p-5 sm:p-6 lg:p-8">
          {/* Welcome section */}
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-navy">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-2 text-text-muted">
              Keep going! You're building a
              great future.
            </p>
          </div>

          {/* Projects error */}
          {projectsError && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm text-red-700">
                {projectsError}
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
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          )}

          {/* Goals error */}
          {goalsError && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <p className="text-sm text-amber-800">
                {goalsError}
              </p>

              <button
                type="button"
                onClick={() =>
                  setGoalsRetryCount(
                    (count) => count + 1
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
              >
                <RefreshCw size={15} />
                Retry Goals
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* Main dashboard content */}
            <div className="min-w-0 space-y-5">
              {/* Overview cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2">
                <ProjectStatsCard
                  total={projectCount}
                  completed={completedProjects}
                  isLoading={isLoading}
                  hasError={Boolean(
                    projectsError
                  )}
                />

                <ProgressCard
                  title="DSA Practice"
                  value="Not started"
                  description="Your solved problems will appear here"
                  icon={Code2}
                  iconColor="text-blue-600"
                  iconBackground="bg-blue-50"
                  to="/dsa"
                />

                <ProgressCard
                  title="Resume Analysis"
                  value="Not analyzed"
                  description="Resume analysis coming soon"
                  icon={FileUser}
                  iconColor="text-violet-600"
                  iconBackground="bg-violet-50"
                  to="/resume"
                />

                <ProgressCard
                  title="Mock Interviews"
                  value="Not started"
                  description="Your completed sessions will appear here"
                  icon={UsersRound}
                  iconColor="text-amber-600"
                  iconBackground="bg-amber-50"
                  to="/interviews"
                />
              </div>

              {/* Coding activity */}
              <CodeActivity />

              {/* DSA and projects */}
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-1">
                <DSAProgress />

                <RecentProjects
                  projects={
                    hasProjectData
                      ? projects
                      : []
                  }
                  isLoading={isLoading}
                  error={projectsError}
                />
              </div>

              {/* Resume and tasks */}
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-1">
                <ResumeStatus />

                <UpcomingTasks
  tasks={tasks}
  isLoading={goalsLoading}
  error={goalsError}
/>
              </div>
            </div>

            {/* Right sidebar */}
            <aside
              aria-label="Goals and schedule"
              className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 2xl:grid-cols-1"
            >
              <GoalsPanel
  goals={goals}
  isLoading={goalsLoading}
  error={goalsError}
  projectStats={
    hasProjectData
      ? {
          total: projectCount,
          completed: completedProjects,
          inProgress: inProgressProjects,
        }
      : null
  }
/>

            <WeeklyCalendar
  tasks={tasks}
  isLoading={goalsLoading}
  error={goalsError}
/>

              <CareerCoachCard />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;