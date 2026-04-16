export const MASTERY_SCHEMA_VERSION = 1;

export const ENTITY_STATUS = {
  obstacle: ["active", "resolved", "dormant"],
  intervention: ["draft", "active", "archived"],
  experiment: ["draft", "active", "completed", "archived"],
  practice: ["active", "paused", "stopped", "completed"],
};

export const createEmptyExperienceEntry = () => ({
  id: "",
  createdAt: "",
  currentExperience: "",
  desiredExperience: "",
  changeNotes: "",
});

export const createEmptyObstacle = () => ({
  id: "",
  title: "",
  underlyingCauses: [],
  notes: "",
  status: "active",
  createdAt: "",
  updatedAt: "",
});

export const createEmptyIntervention = () => ({
  id: "",
  title: "",
  obstacleId: "",
  practiceText: "",
  timing: "",
  followThroughIndicators: "",
  accountability: "",
  guardrails: [],
  status: "draft",
  createdAt: "",
  updatedAt: "",
});

export const createEmptyExperiment = () => ({
  id: "",
  interventionId: "",
  title: "",
  hypothesis: "",
  expectedChange: "",
  startAt: "",
  endAt: "",
  status: "draft",
  reflection: {
    noticed: "",
    outcome: "",
    completedAt: "",
  },
  createdAt: "",
  updatedAt: "",
});

export const createEmptyPractice = () => ({
  id: "",
  title: "",
  obstacleId: "",
  currentInterventionId: "",
  interventionHistory: [],
  skills: [],
  status: "active",
  firstStartedAt: "",
  currentStartedAt: "",
  pausedAt: "",
  stoppedAt: "",
  restartedAt: "",
  createdAt: "",
  updatedAt: "",
});

export const createEmptyPracticeLog = () => ({
  id: "",
  practiceId: "",
  type: "observation",
  text: "",
  createdAt: "",
});

export const createEmptyExperimentLog = () => ({
  id: "",
  experimentId: "",
  text: "",
  createdAt: "",
});

export const createEmptyImportRecord = () => ({
  id: "",
  sourceApp: "fmp",
  sourceVersion: "",
  importedAt: "",
  notes: "",
});

export const createEmptyMasteryState = () => ({
  schemaVersion: MASTERY_SCHEMA_VERSION,
  appMeta: {
    createdAt: "",
    updatedAt: "",
    lastImportedAt: "",
  },
  imports: [],
  experienceEntries: [],
  obstacles: [],
  interventions: [],
  experiments: [],
  practices: [],
  practiceLogs: [],
  experimentLogs: [],
  settings: {
    theme: "sadhanas-mastery",
  },
});

