import {
  MASTERY_SCHEMA_VERSION,
  createEmptyMasteryState,
} from "./masterySchema";

const now = "2026-04-16T00:00:00.000Z";

export const sampleMasteryState = {
  ...createEmptyMasteryState(),
  schemaVersion: MASTERY_SCHEMA_VERSION,
  appMeta: {
    createdAt: now,
    updatedAt: now,
    lastImportedAt: "",
  },
  experienceEntries: [
    {
      id: "exp_1",
      createdAt: now,
      currentExperience: "I often feel scattered and hesitant when starting important work.",
      desiredExperience: "I want work to feel steadier, clearer, and less emotionally loaded.",
      changeNotes: "Initial imported entry from the original program.",
    },
  ],
  obstacles: [
    {
      id: "obs_1",
      title: "Difficulty starting meaningful work",
      underlyingCauses: [
        "Fear of doing it badly",
        "Low clarity about the first step",
      ],
      notes: "",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  interventions: [
    {
      id: "int_1",
      title: "Start with a 10-minute opening block",
      obstacleId: "obs_1",
      practiceText: "Begin each work block by setting a 10-minute timer and only focus on opening the task.",
      timing: "Weekdays in the first work block of the day",
      followThroughIndicators: "I begin within five minutes of sitting down.",
      accountability: "Send a short update after completing the opening block.",
      guardrails: [
        {
          id: "gr_1",
          label: "If I feel resistance",
          response: "Reduce the block to 5 minutes and begin anyway.",
        },
      ],
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  experiments: [
    {
      id: "ex_1",
      interventionId: "int_1",
      title: "5-day opening-block experiment",
      hypothesis: "If I reduce the threshold for starting, I will begin more consistently.",
      expectedChange: "Less delay and less emotional friction at the start of work.",
      startAt: now,
      endAt: "",
      status: "active",
      reflection: {
        noticed: "",
        outcome: "",
        completedAt: "",
      },
      createdAt: now,
      updatedAt: now,
    },
  ],
  practices: [
    {
      id: "pr_1",
      title: "Opening meaningful work gently",
      obstacleId: "obs_1",
      currentInterventionId: "int_1",
      interventionHistory: ["int_1"],
      skills: [
        {
          id: "sk_1",
          title: "Beginning before I feel ready",
          description: "Practice starting before motivation fully arrives.",
        },
      ],
      status: "active",
      firstStartedAt: now,
      currentStartedAt: now,
      pausedAt: "",
      stoppedAt: "",
      restartedAt: "",
      createdAt: now,
      updatedAt: now,
    },
  ],
  practiceLogs: [
    {
      id: "pl_1",
      practiceId: "pr_1",
      type: "observation",
      text: "Starting with only 10 minutes reduced the feeling of dread.",
      createdAt: now,
    },
  ],
  experimentLogs: [
    {
      id: "el_1",
      experimentId: "ex_1",
      text: "Day 1 felt easier once I removed the expectation of momentum.",
      createdAt: now,
    },
  ],
};

