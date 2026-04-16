import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryActions, useMasteryData } from "../store/useMasteryData";
import { getObstacleById } from "../lib/masterySelectors";

export function InterventionsScreen() {
  const state = useMasteryData();
  const { createIntervention, updateIntervention, addGuardrail, updateGuardrail } =
    useMasteryActions();
  const interventions = state.interventions || [];
  const obstacles = state.obstacles || [];
  const [selectedId, setSelectedId] = React.useState(interventions[0]?.id || "");

  React.useEffect(() => {
    if (!interventions.length) {
      setSelectedId("");
      return;
    }

    const exists = interventions.some((row) => row.id === selectedId);
    if (!exists) setSelectedId(interventions[0].id);
  }, [interventions, selectedId]);

  const selectedIntervention =
    interventions.find((row) => row.id === selectedId) || interventions[0] || null;

  return (
    <SectionCard
      title="Interventions"
      description="Interventions will become first-class records that belong to obstacles and contain editable design, accountability, and guardrails."
    >
      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="editor-toolbar">
            <button
              type="button"
              className="primary-link button-reset"
              onClick={() => {
                const id = createIntervention();
                setSelectedId(id);
              }}
            >
              New Intervention
            </button>
          </div>

          <div className="stack-list">
            {interventions.map((intervention) => {
              const obstacle = getObstacleById(state, intervention.obstacleId);
              const isSelected = intervention.id === selectedIntervention?.id;

              return (
                <button
                  key={intervention.id}
                  type="button"
                  className={`entity-card entity-button ${isSelected ? "entity-card-selected" : ""}`}
                  onClick={() => setSelectedId(intervention.id)}
                >
                  <div className="entity-card-header">
                    <div>
                      <h3>{intervention.title || "Untitled intervention"}</h3>
                      <div className="entity-subtle">
                        {obstacle?.title || "No obstacle linked"}
                      </div>
                    </div>
                    <span className="status-pill">{intervention.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="editor-main">
          {selectedIntervention ? (
            <article className="entity-card editor-card">
              <div className="entity-card-header">
                <div>
                  <h3>{selectedIntervention.title || "Untitled intervention"}</h3>
                  <div className="entity-subtle">
                    Edit the current intervention design and linked obstacle.
                  </div>
                </div>
                <span className="status-pill">{selectedIntervention.status}</span>
              </div>

              <div className="form-grid">
                <label className="field-block">
                  <span className="field-label">Title</span>
                  <input
                    className="field-input"
                    type="text"
                    value={selectedIntervention.title || ""}
                    onChange={(e) =>
                      updateIntervention(selectedIntervention.id, { title: e.target.value })
                    }
                  />
                </label>

                <label className="field-block">
                  <span className="field-label">Obstacle</span>
                  <select
                    className="field-input"
                    value={selectedIntervention.obstacleId || ""}
                    onChange={(e) =>
                      updateIntervention(selectedIntervention.id, { obstacleId: e.target.value })
                    }
                  >
                    {obstacles.map((obstacle) => (
                      <option key={obstacle.id} value={obstacle.id}>
                        {obstacle.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field-block">
                <span className="field-label">Practice / Method</span>
                <textarea
                  className="field-input field-textarea"
                  value={selectedIntervention.practiceText || ""}
                  onChange={(e) =>
                    updateIntervention(selectedIntervention.id, {
                      practiceText: e.target.value,
                    })
                  }
                />
              </label>

              <div className="form-grid">
                <label className="field-block">
                  <span className="field-label">Timing</span>
                  <textarea
                    className="field-input field-textarea"
                    value={selectedIntervention.timing || ""}
                    onChange={(e) =>
                      updateIntervention(selectedIntervention.id, { timing: e.target.value })
                    }
                  />
                </label>

                <label className="field-block">
                  <span className="field-label">Follow-through indicators</span>
                  <textarea
                    className="field-input field-textarea"
                    value={selectedIntervention.followThroughIndicators || ""}
                    onChange={(e) =>
                      updateIntervention(selectedIntervention.id, {
                        followThroughIndicators: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label className="field-block">
                <span className="field-label">Accountability</span>
                <textarea
                  className="field-input field-textarea"
                  value={selectedIntervention.accountability || ""}
                  onChange={(e) =>
                    updateIntervention(selectedIntervention.id, {
                      accountability: e.target.value,
                    })
                  }
                />
              </label>

              <div className="entity-label">Guardrails</div>
              <div className="stack-list">
                {(selectedIntervention.guardrails || []).map((row) => (
                  <div key={row.id} className="sub-card">
                    <label className="field-block">
                      <span className="field-label">Guardrail label</span>
                      <input
                        className="field-input"
                        type="text"
                        value={row.label || ""}
                        onChange={(e) =>
                          updateGuardrail(selectedIntervention.id, row.id, {
                            label: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="field-block">
                      <span className="field-label">Response</span>
                      <textarea
                        className="field-input field-textarea"
                        value={row.response || ""}
                        onChange={(e) =>
                          updateGuardrail(selectedIntervention.id, row.id, {
                            response: e.target.value,
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
                  onClick={() => addGuardrail(selectedIntervention.id)}
                >
                  Add Guardrail
                </button>
              </div>
            </article>
          ) : (
            <div className="entity-card">
              <h3>No interventions yet</h3>
              <div className="entity-copy">
                Create your first intervention to begin shaping this section.
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
