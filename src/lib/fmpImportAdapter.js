import { createEmptyMasteryState } from "../data/masterySchema";
import { FMP_IMPORT_PLAN } from "./fmpImportPlan";

function makeId(prefix, sourceId, fallbackIndex) {
  const safe = String(sourceId || fallbackIndex || Date.now())
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${prefix}_${safe}`;
}

export function createImportPreview(fmpData = {}) {
  return {
    sourceStorageKey: FMP_IMPORT_PLAN.sourceStorageKey,
    importedWeeks: Object.keys(fmpData?.answers || {}),
    hasPracticeLogs:
      !!fmpData?.practiceLogsByPracticeId &&
      Object.keys(fmpData.practiceLogsByPracticeId).length > 0,
    hasLegacyLog:
      Array.isArray(fmpData?.log) && fmpData.log.length > 0,
    notes: FMP_IMPORT_PLAN.notes,
    counts: {
      answers: Object.keys(fmpData?.answers || {}).length,
      practiceLogs: Object.keys(fmpData?.practiceLogsByPracticeId || {}).length,
    },
  };
}

export function createMasteryStateFromFmp(fmpData = {}) {
  const base = createEmptyMasteryState();
  const now = new Date().toISOString();
  const answers = fmpData?.answers || {};
  const practice2Data = answers.w2 || {};
  const practice4Data = answers.w5 || {};
  const practice5Data = answers.w6 || {};
  const practice6Data = answers.w7 || {};
  const practice7Data = answers.w8 || {};
  const practice8Data = answers.w10 || {};
  const practice9Data = answers.w11 || {};
  const practice12Data = answers.w15 || {};

  const sourceObstacles = Array.isArray(practice2Data?.obstacles)
    ? practice2Data.obstacles
    : [];

  const obstacles = sourceObstacles.map((obstacle, index) => ({
    id: makeId("obs", obstacle?.id, index + 1),
    title: String(obstacle?.label || obstacle?.title || `Obstacle ${index + 1}`).trim(),
    underlyingCauses: Array.isArray(obstacle?.chain) ? obstacle.chain.filter(Boolean) : [],
    notes: "",
    status: "active",
    createdAt: now,
    updatedAt: now,
  }));

  const obstacleIdMap = Object.fromEntries(
    sourceObstacles.map((obstacle, index) => [
      String(obstacle?.id || `obs_${index + 1}`),
      makeId("obs", obstacle?.id, index + 1),
    ])
  );

  const interventions = sourceObstacles
    .map((obstacle, index) => {
      const sourceId = String(obstacle?.id || `obs_${index + 1}`);
      const plan = practice4Data?.plansByObstacleId?.[sourceId] || {};
      const accountability = practice5Data?.accountabilityByObstacleId?.[sourceId] || {};
      const safeguards = practice6Data?.safeguardsByObstacleId?.[sourceId] || {};

      const hasMeaningfulData =
        String(plan?.interventionText || "").trim() ||
        String(plan?.practiceText || "").trim() ||
        String(accountability?.method || "").trim() ||
        (Array.isArray(safeguards?.disruptors) && safeguards.disruptors.length);

      if (!hasMeaningfulData) return null;

      return {
        id: makeId("int", sourceId, index + 1),
        title: String(plan?.interventionText || `Intervention ${index + 1}`).trim(),
        obstacleId: obstacleIdMap[sourceId] || "",
        practiceText: String(plan?.practiceText || "").trim(),
        timing: String(plan?.timing || "").trim(),
        followThroughIndicators: String(plan?.success || "").trim(),
        accountability: String(accountability?.method || "").trim(),
        guardrails: (Array.isArray(safeguards?.disruptors) ? safeguards.disruptors : []).map(
          (row, guardrailIndex) => ({
            id: makeId("gr", row?.id, `${sourceId}_${guardrailIndex + 1}`),
            label: String(row?.disruptor || `Guardrail ${guardrailIndex + 1}`).trim(),
            response: String(row?.response || "").trim(),
          })
        ),
        status: "active",
        createdAt: now,
        updatedAt: now,
      };
    })
    .filter(Boolean);

  const interventionIdMap = Object.fromEntries(
    interventions.map((row) => [
      row.obstacleId,
      row.id,
    ])
  );

  const experiments = sourceObstacles
    .map((obstacle, index) => {
      const sourceId = String(obstacle?.id || `obs_${index + 1}`);
      const p7 = practice7Data?.experimentsByObstacleId?.[sourceId] || {};
      const currentExperiment = p7?.exp || {};
      const reflection = p7?.reflection || {};
      const hasExperimentData =
        String(currentExperiment?.expected || currentExperiment?.hypothesis || "").trim() ||
        currentExperiment?.startAt ||
        currentExperiment?.state;

      if (!hasExperimentData) return null;

      const importedInterventionId = interventions.find(
        (row) => row.obstacleId === obstacleIdMap[sourceId]
      )?.id || "";

      return {
        id: makeId("ex", sourceId, index + 1),
        interventionId: importedInterventionId,
        title: String(
          interventions.find((row) => row.id === importedInterventionId)?.title ||
            `Experiment ${index + 1}`
        ).trim(),
        hypothesis: String(currentExperiment?.expected || currentExperiment?.hypothesis || "").trim(),
        expectedChange: String(currentExperiment?.expected || "").trim(),
        startAt: String(currentExperiment?.startAt || ""),
        endAt: String(currentExperiment?.endAt || ""),
        status:
          currentExperiment?.state === "active"
            ? "active"
            : currentExperiment?.state === "ended"
              ? "completed"
              : "draft",
        reflection: {
          noticed: String(reflection?.noticed || "").trim(),
          outcome: String(reflection?.outcome || "").trim(),
          completedAt: String(reflection?.completedAt || ""),
        },
        createdAt: now,
        updatedAt: now,
      };
    })
    .filter(Boolean);

  const sourcePractices = practice8Data?.practicesByObstacleId || {};
  const sourceSkills = practice9Data?.skillsByObstacleId || {};

  const practices = Object.keys(sourcePractices).map((sourceId, index) => {
    const p8 = sourcePractices[sourceId] || {};
    const importedObstacleId = obstacleIdMap[sourceId] || "";
    const matchingInterventions = interventions.filter(
      (row) => row.obstacleId === importedObstacleId
    );
    const currentInterventionId = matchingInterventions[0]?.id || "";
    const skills = Array.isArray(sourceSkills[sourceId]) ? sourceSkills[sourceId] : [];
    const status =
      practice12Data?.practiceStatusesByObstacleId?.[sourceId] ||
      (p8?.currentStartedAt || p8?.startedAt ? "active" : "active");

    return {
      id: makeId("pr", sourceId, index + 1),
      title: String(
        matchingInterventions[0]?.title || `Practice ${index + 1}`
      ).trim(),
      obstacleId: importedObstacleId,
      currentInterventionId,
      interventionHistory: currentInterventionId ? [currentInterventionId] : [],
      skills: skills.map((skill, skillIndex) => ({
        id: makeId("sk", skill?.id, `${sourceId}_${skillIndex + 1}`),
        title: String(skill?.title || `Skill ${skillIndex + 1}`).trim(),
        description: String(skill?.description || "").trim(),
      })),
      status: String(status || "active"),
      firstStartedAt: String(p8?.firstStartedAt || p8?.startedAt || ""),
      currentStartedAt: String(p8?.currentStartedAt || p8?.startedAt || ""),
      pausedAt: "",
      stoppedAt: "",
      restartedAt: "",
      createdAt: now,
      updatedAt: now,
    };
  });

  const practiceIdMap = Object.fromEntries(
    Object.keys(sourcePractices).map((sourceId, index) => [
      sourceId,
      makeId("pr", sourceId, index + 1),
    ])
  );

  const practiceLogs = Object.entries(fmpData?.practiceLogsByPracticeId || {}).flatMap(
    ([sourcePracticeId, logs]) =>
      (Array.isArray(logs) ? logs : []).map((log, index) => ({
        id: makeId("pl", log?.id, `${sourcePracticeId}_${index + 1}`),
        practiceId: practiceIdMap[sourcePracticeId] || "",
        type: String(log?.type || "observation"),
        text: String(log?.text || "").trim(),
        createdAt: String(log?.createdAt || now),
      }))
  );

  const experimentIdByObstacleId = Object.fromEntries(
    experiments.map((row) => {
      const intervention = interventions.find((i) => i.id === row.interventionId);
      return [intervention?.obstacleId || "", row.id];
    })
  );

  const experimentLogs = Object.entries(fmpData?.experimentLogsByExperimentId || {}).flatMap(
    ([sourceExperimentId, logs]) =>
      (Array.isArray(logs) ? logs : []).map((log, index) => ({
        id: makeId("el", log?.id, `${sourceExperimentId}_${index + 1}`),
        experimentId:
          experimentIdByObstacleId[obstacleIdMap[sourceExperimentId] || ""] || "",
        text: String(log?.text || "").trim(),
        createdAt: String(log?.createdAt || now),
      }))
  );

  const experienceEntries = [];
  if (answers.w1) {
    experienceEntries.push({
      id: "exp_imported_w1",
      createdAt: now,
      currentExperience: [
        answers.w1.currentLook,
        answers.w1.currentFeel,
        answers.w1.currentOpen,
      ]
        .filter(Boolean)
        .join("\n\n"),
      desiredExperience: [
        answers.w1.desiredLook,
        answers.w1.desiredFeel,
        answers.w1.desiredOpen,
      ]
        .filter(Boolean)
        .join("\n\n"),
      changeNotes: "Imported from Week 1 reflections.",
    });
  }

  return {
    ...base,
    appMeta: {
      ...base.appMeta,
      createdAt: now,
      updatedAt: now,
      lastImportedAt: now,
    },
    experienceEntries,
    obstacles,
    interventions,
    experiments,
    practices,
    practiceLogs,
    experimentLogs,
    imports: [
      {
        id: `import_${Date.now()}`,
        sourceApp: "fmp",
        sourceVersion: String(fmpData?.version || ""),
        importedAt: now,
        notes: "Imported from Fearless Mastery Productivity local backup shape.",
      },
    ],
  };
}
