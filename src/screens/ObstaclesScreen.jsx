import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryActions, useMasteryData } from "../store/useMasteryData.jsx";

export function ObstaclesScreen() {
  const state = useMasteryData();
  const { createObstacle, updateObstacle, addUnderlyingCause, updateUnderlyingCause } =
    useMasteryActions();
  const obstacles = state.obstacles || [];
  const [selectedId, setSelectedId] = React.useState(obstacles[0]?.id || "");

  React.useEffect(() => {
    if (!obstacles.length) {
      setSelectedId("");
      return;
    }

    const exists = obstacles.some((row) => row.id === selectedId);
    if (!exists) setSelectedId(obstacles[0].id);
  }, [obstacles, selectedId]);

  const selectedObstacle =
    obstacles.find((row) => row.id === selectedId) || obstacles[0] || null;

  return (
    <SectionCard
      title="Obstacles"
      description="Obstacles will remain editable living records with underlying causes, without leverage-point selection."
    >
      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="editor-toolbar">
            <button
              type="button"
              className="primary-link button-reset"
              onClick={() => {
                const id = createObstacle();
                setSelectedId(id);
              }}
            >
              New Obstacle
            </button>
          </div>

          <div className="stack-list">
            {obstacles.map((obstacle) => {
              const linkedInterventions = (state.interventions || []).filter(
                (row) => row.obstacleId === obstacle.id
              );
              const isSelected = obstacle.id === selectedObstacle?.id;

              return (
                <button
                  key={obstacle.id}
                  type="button"
                  className={`entity-card entity-button ${isSelected ? "entity-card-selected" : ""}`}
                  onClick={() => setSelectedId(obstacle.id)}
                >
                  <div className="entity-card-header">
                    <div>
                      <h3>{obstacle.title || "Untitled obstacle"}</h3>
                      <div className="entity-subtle">
                        {linkedInterventions.length} linked intervention
                        {linkedInterventions.length === 1 ? "" : "s"}
                      </div>
                    </div>
                    <span className="status-pill">{obstacle.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="editor-main">
          {selectedObstacle ? (
            <article className="entity-card editor-card">
              <div className="entity-card-header">
                <div>
                  <h3>{selectedObstacle.title || "Untitled obstacle"}</h3>
                  <div className="entity-subtle">
                    Obstacles remain living records with editable underlying causes.
                  </div>
                </div>
                <span className="status-pill">{selectedObstacle.status}</span>
              </div>

              <div className="form-grid">
                <label className="field-block">
                  <span className="field-label">Title</span>
                  <input
                    className="field-input"
                    type="text"
                    value={selectedObstacle.title || ""}
                    onChange={(e) =>
                      updateObstacle(selectedObstacle.id, { title: e.target.value })
                    }
                  />
                </label>

                <label className="field-block">
                  <span className="field-label">Status</span>
                  <select
                    className="field-input"
                    value={selectedObstacle.status || "active"}
                    onChange={(e) =>
                      updateObstacle(selectedObstacle.id, { status: e.target.value })
                    }
                  >
                    <option value="active">active</option>
                    <option value="resolved">resolved</option>
                    <option value="dormant">dormant</option>
                  </select>
                </label>
              </div>

              <label className="field-block">
                <span className="field-label">Notes</span>
                <textarea
                  className="field-input field-textarea"
                  value={selectedObstacle.notes || ""}
                  onChange={(e) =>
                    updateObstacle(selectedObstacle.id, { notes: e.target.value })
                  }
                />
              </label>

              <div className="entity-label">Underlying causes</div>
              <div className="stack-list">
                {(selectedObstacle.underlyingCauses || []).map((cause, index) => (
                  <div key={`${selectedObstacle.id}_${index}`} className="sub-card">
                    <label className="field-block">
                      <span className="field-label">Cause {index + 1}</span>
                      <textarea
                        className="field-input field-textarea"
                        value={cause || ""}
                        onChange={(e) =>
                          updateUnderlyingCause(selectedObstacle.id, index, e.target.value)
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
                  onClick={() => addUnderlyingCause(selectedObstacle.id)}
                >
                  Add Underlying Cause
                </button>
              </div>
            </article>
          ) : (
            <div className="entity-card">
              <h3>No obstacles yet</h3>
              <div className="entity-copy">
                Create your first obstacle to start mapping what gets in the way.
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
