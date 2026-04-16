import React from "react";
import { sampleMasteryState } from "../data/sampleState";
import { createMasteryStateFromFmp, createImportPreview } from "../lib/fmpImportAdapter";

const STORAGE_KEY = "sadhanas-mastery-data-v1";

const MasteryDataContext = React.createContext(null);

function readInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleMasteryState;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return sampleMasteryState;
    return parsed;
  } catch {
    return sampleMasteryState;
  }
}

function stampUpdatedAt(state) {
  return {
    ...state,
    appMeta: {
      ...(state.appMeta || {}),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function MasteryDataProvider({ children }) {
  const [state, setState] = React.useState(readInitialState);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // no-op for now
    }
  }, [state]);

  const updateIntervention = React.useCallback((interventionId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        interventions: (prev.interventions || []).map((row) =>
          row.id === interventionId
            ? {
                ...row,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : row
        ),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const createIntervention = React.useCallback(() => {
    const id = `int_${Date.now()}`;
    const now = new Date().toISOString();

    setState((prev) => {
      const nextIntervention = {
        id,
        title: "Untitled intervention",
        obstacleId: (prev.obstacles || [])[0]?.id || "",
        practiceText: "",
        timing: "",
        followThroughIndicators: "",
        accountability: "",
        guardrails: [],
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };

      const next = {
        ...prev,
        interventions: [nextIntervention, ...(prev.interventions || [])],
      };

      return stampUpdatedAt(next);
    });

    return id;
  }, []);

  const addGuardrail = React.useCallback((interventionId) => {
    setState((prev) => {
      const next = {
        ...prev,
        interventions: (prev.interventions || []).map((row) => {
          if (row.id !== interventionId) return row;

          const nextGuardrails = [
            ...(row.guardrails || []),
            {
              id: `gr_${Date.now()}`,
              label: "New guardrail",
              response: "",
            },
          ];

          return {
            ...row,
            guardrails: nextGuardrails,
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updateGuardrail = React.useCallback((interventionId, guardrailId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        interventions: (prev.interventions || []).map((row) => {
          if (row.id !== interventionId) return row;

          return {
            ...row,
            guardrails: (row.guardrails || []).map((guardrail) =>
              guardrail.id === guardrailId ? { ...guardrail, ...patch } : guardrail
            ),
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updatePractice = React.useCallback((practiceId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        practices: (prev.practices || []).map((row) =>
          row.id === practiceId
            ? {
                ...row,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : row
        ),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const createPractice = React.useCallback(() => {
    const id = `pr_${Date.now()}`;
    const now = new Date().toISOString();

    setState((prev) => {
      const firstIntervention = (prev.interventions || [])[0] || null;
      const nextPractice = {
        id,
        title: "Untitled practice",
        obstacleId: firstIntervention?.obstacleId || (prev.obstacles || [])[0]?.id || "",
        currentInterventionId: firstIntervention?.id || "",
        interventionHistory: firstIntervention?.id ? [firstIntervention.id] : [],
        skills: [],
        status: "active",
        firstStartedAt: now,
        currentStartedAt: now,
        pausedAt: "",
        stoppedAt: "",
        restartedAt: "",
        createdAt: now,
        updatedAt: now,
      };

      const next = {
        ...prev,
        practices: [nextPractice, ...(prev.practices || [])],
      };

      return stampUpdatedAt(next);
    });

    return id;
  }, []);

  const addSkill = React.useCallback((practiceId) => {
    setState((prev) => {
      const next = {
        ...prev,
        practices: (prev.practices || []).map((row) => {
          if (row.id !== practiceId) return row;

          return {
            ...row,
            skills: [
              ...(row.skills || []),
              {
                id: `sk_${Date.now()}`,
                title: "New skill",
                description: "",
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updateSkill = React.useCallback((practiceId, skillId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        practices: (prev.practices || []).map((row) => {
          if (row.id !== practiceId) return row;

          return {
            ...row,
            skills: (row.skills || []).map((skill) =>
              skill.id === skillId ? { ...skill, ...patch } : skill
            ),
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updateExperiment = React.useCallback((experimentId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        experiments: (prev.experiments || []).map((row) =>
          row.id === experimentId
            ? {
                ...row,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : row
        ),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const createExperiment = React.useCallback(() => {
    const id = `ex_${Date.now()}`;
    const now = new Date().toISOString();

    setState((prev) => {
      const firstIntervention = (prev.interventions || [])[0] || null;
      const nextExperiment = {
        id,
        interventionId: firstIntervention?.id || "",
        title: "Untitled experiment",
        hypothesis: "",
        expectedChange: "",
        startAt: now,
        endAt: "",
        status: "draft",
        reflection: {
          noticed: "",
          outcome: "",
          completedAt: "",
        },
        createdAt: now,
        updatedAt: now,
      };

      const next = {
        ...prev,
        experiments: [nextExperiment, ...(prev.experiments || [])],
      };

      return stampUpdatedAt(next);
    });

    return id;
  }, []);

  const updateExperimentReflection = React.useCallback((experimentId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        experiments: (prev.experiments || []).map((row) => {
          if (row.id !== experimentId) return row;

          return {
            ...row,
            reflection: {
              ...(row.reflection || {}),
              ...patch,
            },
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updateObstacle = React.useCallback((obstacleId, patch) => {
    setState((prev) => {
      const next = {
        ...prev,
        obstacles: (prev.obstacles || []).map((row) =>
          row.id === obstacleId
            ? {
                ...row,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : row
        ),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const createObstacle = React.useCallback(() => {
    const id = `obs_${Date.now()}`;
    const now = new Date().toISOString();

    setState((prev) => {
      const nextObstacle = {
        id,
        title: "Untitled obstacle",
        underlyingCauses: ["New underlying cause"],
        notes: "",
        status: "active",
        createdAt: now,
        updatedAt: now,
      };

      const next = {
        ...prev,
        obstacles: [nextObstacle, ...(prev.obstacles || [])],
      };

      return stampUpdatedAt(next);
    });

    return id;
  }, []);

  const addUnderlyingCause = React.useCallback((obstacleId) => {
    setState((prev) => {
      const next = {
        ...prev,
        obstacles: (prev.obstacles || []).map((row) => {
          if (row.id !== obstacleId) return row;

          return {
            ...row,
            underlyingCauses: [...(row.underlyingCauses || []), "New underlying cause"],
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const updateUnderlyingCause = React.useCallback((obstacleId, index, value) => {
    setState((prev) => {
      const next = {
        ...prev,
        obstacles: (prev.obstacles || []).map((row) => {
          if (row.id !== obstacleId) return row;

          const nextCauses = [...(row.underlyingCauses || [])];
          nextCauses[index] = value;

          return {
            ...row,
            underlyingCauses: nextCauses,
            updatedAt: new Date().toISOString(),
          };
        }),
      };

      return stampUpdatedAt(next);
    });
  }, []);

  const replaceState = React.useCallback((nextState) => {
    setState(stampUpdatedAt(nextState));
  }, []);

  const previewFmpImport = React.useCallback((fmpData) => {
    return createImportPreview(fmpData);
  }, []);

  const importFromFmp = React.useCallback((fmpData) => {
    const imported = createMasteryStateFromFmp(fmpData);
    setState(imported);
    return imported;
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      actions: {
        createIntervention,
        updateIntervention,
        addGuardrail,
        updateGuardrail,
        createPractice,
        updatePractice,
        addSkill,
        updateSkill,
        createExperiment,
        updateExperiment,
        updateExperimentReflection,
        createObstacle,
        updateObstacle,
        addUnderlyingCause,
        updateUnderlyingCause,
        replaceState,
        previewFmpImport,
        importFromFmp,
      },
    }),
    [
      state,
      createIntervention,
      updateIntervention,
      addGuardrail,
      updateGuardrail,
      createPractice,
      updatePractice,
      addSkill,
      updateSkill,
      createExperiment,
      updateExperiment,
      updateExperimentReflection,
      createObstacle,
      updateObstacle,
      addUnderlyingCause,
      updateUnderlyingCause,
      replaceState,
      previewFmpImport,
      importFromFmp,
    ]
  );

  return (
    <MasteryDataContext.Provider value={value}>
      {children}
    </MasteryDataContext.Provider>
  );
}

export function useMasteryData() {
  const context = React.useContext(MasteryDataContext);
  if (!context) {
    throw new Error("useMasteryData must be used within MasteryDataProvider");
  }

  return context.state;
}

export function useMasteryActions() {
  const context = React.useContext(MasteryDataContext);
  if (!context) {
    throw new Error("useMasteryActions must be used within MasteryDataProvider");
  }

  return context.actions;
}
