
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getGoalTasks(goals = []) {
  if (!Array.isArray(goals)) return [];

  return goals
    .filter(
      (goal) =>
        goal.status === "Active" &&
        goal.deadline &&
        goal._id
    )
    .map((goal) => {
      // Extract the calendar date without shifting it
      // because of the student's local time zone.
      const date = goal.deadline.slice(0, 10);

      return {
        id: goal._id,
        title: goal.title,
        date,
        category: goal.category,
        source: "goal",
        goalId: goal._id,
      };
    })
    .filter((task) => {
      const parsed = new Date(`${task.date}T00:00:00Z`);

      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === task.date
      );
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingGoalTasks(goals = []) {
  const today = formatLocalDate(new Date());

  return getGoalTasks(goals).filter(
    (task) => task.date >= today
  );
}