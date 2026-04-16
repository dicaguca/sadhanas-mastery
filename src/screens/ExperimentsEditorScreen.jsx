import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryActions, useMasteryData } from "../store/useMasteryData.jsx";
import {
  formatDateLabel,
  getInterventionById,
  getObstacleById,
} from "../lib/masterySelectors";

export function ExperimentsEditorScreen() {
  const state = useMasteryData();
  const { createExperiment, updateExperiment, updateExperimentReflection } =
    useMasteryActions();
  const experiments = state.experiments || [];
  const interventions = state.interventions || [];
  const [selectedId, setSelectedId] = React.useState(experiments[0]?.id || "");

  React.useEffect(() => {
    if (!experiments.length) {
      setSelectedId("");
      return;
    }

    const exists = experiments.some((row) => row.id === selectedId);
    if (!exists) setSelectedId(experiments[0].id);
  }, [experiments, selectedId]);

  const selectedExperiment =
    experiments.find((row) => row.id === selectedId) || experiments[0] || null;

  return (
    <SectionCard
      title="Experiments"
      description="Experiments will be linked directly to interventions and retain their own history, reflection, and outcomes."
    >
      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="editor-toolbar">
            <button
              type="button"
              className="primary-link button-reset"
              onClick={() => {
                const id = createExperiment();
                setSelectedId(id);
              }}
            >
              New Experiment
            </button>
          </div>

          <div className="stack-list">
            {experiments.map((experiment) => {
              const intervention = getInterventionById(state, experiment.interventionId);
              const obstacle = intervention
                ? getObstacleById(state, intervention.obstacleId)
                : null;
              const isSelected = experiment.id === selectedExperiment?.id;

              return (
                <button
                  key={experiment.id}
                  type="button"
                  className={`entity-card entity-button ${isSelected ? "entity-card-selected" : ""}`}
                  onClick={() => setSelectedId(experiment.id)}
                >
                  <div className="entity-card-header">
                    <div>
                      <h3>{experiment.title || "Untitled experiment"}</h3>
                      <div className="entity-subtle">
                        {[intervention?.title, obstacle?.title].filter(Boolean).join(" - ")}
                      </div>
                    </div>
                    <span className="status-pill">{experiment.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="editor-main">
          {selectedExperiment ? (() => {
            const intervention = getInterventionById(state, selectedExperiment.interventionId);
            const obstacle = intervention
              ? getObstacleById(state, intervention.obstacleId)
              : null;

            return (
              <article className="entity-card editor-card">
                <div className="entity-card-header">
                  <div>
                    <h3>{selectedExperiment.title || "Untitled experiment"}</h3>
                    <div className="entity-subtle">
                      Experiments test interventions and capture what happened.
                    </div>
                  </div>
                  <span className="status-pill">{selectedExperiment.status}</span>
                </div>

                <div className="form-grid">
                  <label className="field-block">
                    <span className="field-label">Title</span>
                    <input
                      className="field-input"
                      type="text"
                      value={selectedExperiment.title || ""}
                      onChange={(e) =>
                        updateExperiment(selectedExperiment.id, { title: e.target.value })
                      }
                    />
                  </label>

                  <label className="field-block">
                    <span className="field-label">Status</span>
                    <select
                      className="field-input"
                      value={selectedExperiment.status || "draft"}
                      onChange={(e) =>
                        updateExperiment(selectedExperiment.id, { status: e.target.value })
                      }
                    >
                      <option value="draft">draft</option>
                      <option value="active">active</option>
                      <option value="completed">completed</option>
                      <option value="archived">archived</option>
                    </select>
                  </label>
                </div>

                <div className="form-grid">
                  <label className="field-block">
                    <span className="field-label">Intervention</span>
                    <select
                      className="field-input"
                      value={selectedExperiment.interventionId || ""}
                      onChange={(e) =>
                        updateExperiment(selectedExperiment.id, {
                          interventionId: e.target.value,
                        })
                      }
                    >
                      {interventions.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field-block">
                    <span className="field-label">Start date</span>
                    <input
                      className="field-input"
                      type="date"
                      value={String(selectedExperiment.startAt || "").slice(0, 10)}
                      onChange={(e) =>
                        updateExperiment(selectedExperiment.id, {
                          startAt: e.target.value ? `${e.target.value}T00:00:00.000Z` : "",
                        })
                      }
                    />
                  </label>
                </div>

                <div className="entity-grid">
                  <div>
                    <div className="entity-label">Linked obstacle</div>
                    <div>{obstacle?.title || "Not set"}</div>
                  </div>
                  <div>
                    <div className="entity-label">Started</div>
                    <div>{formatDateLabel(selectedExperiment.startAt)}</div>
                  </div>
                </div>

                <label className="field-block">
                  <span className="field-label">Hypothesis</span>
                  <textarea
                    className="field-input field-textarea"
                    value={selectedExperiment.hypothesis || ""}
                    onChange={(e) =>
                      updateExperiment(selectedExperiment.id, {
                        hypothesis: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="field-block">
                  <span className="field-label">Expected change</span>
                  <textarea
                    className="field-input field-textarea"
                    value={selectedExperiment.expectedChange || ""}
                    onChange={(e) =>
                      updateExperiment(selectedExperiment.id, {
                        expectedChange: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="entity-label">Reflection</div>
                <div className="stack-list">
                  <div className="sub-card">
                    <label className="field-block">
                      <span className="field-label">What I noticed</span>
                      <textarea
                        className="field-input field-textarea"
                        value={selectedExperiment.reflection?.noticed || ""}
                        onChange={(e) =>
                          updateExperimentReflection(selectedExperiment.id, {
                            noticed: e.target.value,
                          })
                        }
                      />
                    </label>

                    <div className="form-grid">
                      <label className="field-block">
                        <span className="field-label">Outcome</span>
                        <select
                          className="field-input"
                          value={selectedExperiment.reflection?.outcome || ""}
                          onChange={(e) =>
                            updateExperimentReflection(selectedExperiment.id, {
                              outcome: e.target.value,
                              completedAt: e.target.value
                                ? new Date().toISOString()
                                : selectedExperiment.reflection?.completedAt || "",
                            })
                          }
                        >
                          <option value="">Select outcome</option>
                          <option value="keep_as_is">keep_as_is</option>
                          <option value="needs_tweaks">needs_tweaks</option>
                          <option value="needs_more_time">needs_more_time</option>
                        </select>
                      </label>

                      <div>
                        <div className="entity-label">Reflection date</div>
                        <div>{formatDateLabel(selectedExperiment.reflection?.completedAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })() : (
            <div className="entity-card">
              <h3>No experiments yet</h3>
              <div className="entity-copy">
                Create your first experiment to begin testing an intervention.
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
