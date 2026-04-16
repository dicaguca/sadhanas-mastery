export function getObstacleById(state, obstacleId) {
  return (state.obstacles || []).find((row) => row.id === obstacleId) || null;
}

export function getInterventionById(state, interventionId) {
  return (state.interventions || []).find((row) => row.id === interventionId) || null;
}

export function getRecentPracticeLogs(state, limit = 5) {
  return [...(state.practiceLogs || [])]
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, limit);
}

export function getRecentExperimentLogs(state, limit = 5) {
  return [...(state.experimentLogs || [])]
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, limit);
}

export function getDashboardSummary(state) {
  return {
    practicesCount: (state.practices || []).length,
    activePracticesCount: (state.practices || []).filter((row) => row.status === "active").length,
    experienceCount: (state.experienceEntries || []).length,
    obstaclesCount: (state.obstacles || []).length,
    interventionsCount: (state.interventions || []).length,
    activeExperimentsCount: (state.experiments || []).filter((row) => row.status === "active").length,
  };
}

export function formatDateLabel(value) {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

