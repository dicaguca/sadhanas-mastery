import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryActions, useMasteryData } from "../store/useMasteryData.jsx";
import { formatDateLabel, getInterventionById, getObstacleById } from "../lib/masterySelectors";

export function PracticesScreen() {
  const state = useMasteryData();
  const { createPractice, updatePractice, addSkill, updateSkill } = useMasteryActions();
  const practices = state.practices || [];
  const interventions = state.interventions || [];
  const obstacles = state.obstacles || [];
  const [selectedId, setSelectedId] = React.useState(practices[0]?.id || "");

  React.useEffect(() => {
    if (!practices.length) {
      setSelectedId("");
      return;
    }

    const exists = practices.some((row) => row.id === selectedId);
    if (!exists) setSelectedId(practices[0].id);
  }, [practices, selectedId]);

  const selectedPractice =
    practices.find((row) => row.id === selectedId) || practices[0] || null;

  return (
    <SectionCard
      title="Practices"
      description="Practices will be the central ongoing records: linked obstacle, current intervention, lifecycle state, skills, and review history."
    >
      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="editor-toolbar">
            <button
              type="button"
              className="primary-link button-reset"
              onClick={() => {
                const id = createPractice();
                setSelectedId(id);
              }}
            >
              New Practice
            </button>
          </div>

          <div className="stack-list">
            {practices.map((practice) => {
              const obstacle = getObstacleById(state, practice.obstacleId);
              const intervention = getInterventionById(state, practice.currentInterventionId);
              const isSelected = practice.id === selectedPractice?.id;

              return (
                <button
                  key={practice.id}
                  type="button"
                  className={`entity-card entity-button ${isSelected ? "entity-card-selected" : ""}`}
                  onClick={() => setSelectedId(practice.id)}
                >
                  <div className="entity-card-header">
                    <div>
                      <h3>{practice.title || "Untitled practice"}</h3>
                      <div className="entity-subtle">
                        {[obstacle?.title, intervention?.title].filter(Boolean).join(" - ")}
                      </div>
                    </div>
                    <span className="status-pill">{practice.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="editor-main">
          {selectedPractice ? (() => {
            const obstacle = getObstacleById(state, selectedPractice.obstacleId);
            const intervention = getInterventionById(state, selectedPractice.currentInterventionId);

            return (
              <article className="entity-card editor-card">
                <div className="entity-card-header">
                  <div>
                    <h3>{selectedPractice.title || "Untitled practice"}</h3>
                    <div className="entity-subtle">
                      Practices are ongoing records linked to obstacles, interventions, and skills.
                    </div>
                  </div>
                  <span className="status-pill">{selectedPractice.status}</span>
                </div>

                <div className="form-grid">
                  <label className="field-block">
                    <span className="field-label">Title</span>
                    <input
                      className="field-input"
                      type="text"
                      value={selectedPractice.title || ""}
                      onChange={(e) =>
                        updatePractice(selectedPractice.id, { title: e.target.value })
                      }
                    />
                  </label>

                  <label className="field-block">
                    <span className="field-label">Status</span>
                    <select
                      className="field-input"
                      value={selectedPractice.status || "active"}
                      onChange={(e) =>
                        updatePractice(selectedPractice.id, { status: e.target.value })
                      }
                    >
                      <option value="active">active</option>
                      <option value="paused">paused</option>
                      <option value="stopped">stopped</option>
                      <option value="completed">completed</option>
                    </select>
                  </label>
                </div>

                <div className="form-grid">
                  <label className="field-block">
                    <span className="field-label">Obstacle</span>
                    <select
                      className="field-input"
                      value={selectedPractice.obstacleId || ""}
                      onChange={(e) =>
                        updatePractice(selectedPractice.id, { obstacleId: e.target.value })
                      }
                    >
                      {obstacles.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field-block">
                    <span className="field-label">Current intervention</span>
                    <select
                      className="field-input"
                      value={selectedPractice.currentInterventionId || ""}
                      onChange={(e) =>
                        updatePractice(selectedPractice.id, {
                          currentInterventionId: e.target.value,
                          interventionHistory: e.target.value
                            ? Array.from(
                                new Set([
                                  ...(selectedPractice.interventionHistory || []),
                                  e.target.value,
                                ])
                              )
                            : selectedPractice.interventionHistory || [],
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
                </div>

                <div className="entity-grid">
                  <div>
                    <div className="entity-label">Started</div>
                    <div>{formatDateLabel(selectedPractice.currentStartedAt || selectedPractice.firstStartedAt)}</div>
                  </div>
                  <div>
                    <div className="entity-label">Current link</div>
                    <div>{[obstacle?.title, intervention?.title].filter(Boolean).join(" - ") || "Not set"}</div>
                  </div>
                </div>

                <div className="entity-label">Skills</div>
                <div className="stack-list">
                  {(selectedPractice.skills || []).map((skill) => (
                    <div key={skill.id} className="sub-card">
                      <label className="field-block">
                        <span className="field-label">Skill title</span>
                        <input
                          className="field-input"
                          type="text"
                          value={skill.title || ""}
                          onChange={(e) =>
                            updateSkill(selectedPractice.id, skill.id, { title: e.target.value })
                          }
                        />
                      </label>

                      <label className="field-block">
                        <span className="field-label">Description</span>
                        <textarea
                          className="field-input field-textarea"
                          value={skill.description || ""}
                          onChange={(e) =>
                            updateSkill(selectedPractice.id, skill.id, {
                              description: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="editor-toolbar">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => addSkill(selectedPractice.id)}
                  >
                    Add Skill
                  </button>
                </div>
              </article>
            );
          })() : (
            <div className="entity-card">
              <h3>No practices yet</h3>
              <div className="entity-copy">
                Create your first practice to begin shaping the core of the app.
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
