export const FMP_IMPORT_PLAN = {
  sourceStorageKey: "fm-productivity-data-v2",
  notes: [
    "Import should be one-time and transformational, not a live sync.",
    "The importer should preserve source identifiers when possible for traceability.",
    "Missing sections should not block import of available sections.",
  ],
  sections: [
    {
      source: "w1",
      target: "experienceEntries",
      strategy: "Create first experience snapshot from current and desired experience reflections.",
    },
    {
      source: "w2",
      target: "obstacles",
      strategy: "Create one obstacle per imported obstacle, carrying underlying causes as-is.",
    },
    {
      source: "w5-w7",
      target: "interventions",
      strategy: "Create interventions from intervention design, accountability, and safeguards renamed to guardrails.",
    },
    {
      source: "w8",
      target: "experiments",
      strategy: "Create experiments linked to imported interventions, preserving hypothesis, run history, and reflection history when present.",
    },
    {
      source: "w10-w15",
      target: "practices",
      strategy: "Create practices from committed interventions and later lifecycle state updates.",
    },
    {
      source: "w11",
      target: "practices.skills",
      strategy: "Attach imported skills to the corresponding practice records.",
    },
    {
      source: "practiceLogsByPracticeId",
      target: "practiceLogs",
      strategy: "Flatten all practice logs into standalone records keyed by imported practice ids.",
    },
    {
      source: "experimentLogsByExperimentId",
      target: "experimentLogs",
      strategy: "Flatten all experiment logs into standalone records keyed by imported experiment ids.",
    },
  ],
};

export const FMP_IMPORT_OBJECT_MAP = {
  experienceEntry: {
    sourceWeeks: ["w1", "w14"],
    targetFields: [
      "currentExperience",
      "desiredExperience",
      "changeNotes",
      "createdAt",
    ],
  },
  obstacle: {
    sourceWeeks: ["w2"],
    targetFields: [
      "title",
      "underlyingCauses",
      "notes",
      "status",
    ],
  },
  intervention: {
    sourceWeeks: ["w5", "w6", "w7"],
    targetFields: [
      "title",
      "obstacleId",
      "practiceText",
      "timing",
      "followThroughIndicators",
      "accountability",
      "guardrails",
    ],
  },
  experiment: {
    sourceWeeks: ["w8"],
    targetFields: [
      "interventionId",
      "title",
      "hypothesis",
      "expectedChange",
      "startAt",
      "endAt",
      "reflection",
      "status",
    ],
  },
  practice: {
    sourceWeeks: ["w10", "w11", "w12", "w15"],
    targetFields: [
      "title",
      "obstacleId",
      "currentInterventionId",
      "skills",
      "status",
      "firstStartedAt",
      "currentStartedAt",
      "pausedAt",
      "stoppedAt",
      "restartedAt",
    ],
  },
};

