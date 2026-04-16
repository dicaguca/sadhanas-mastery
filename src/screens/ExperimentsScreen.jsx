import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryData } from "../store/useMasteryData";
import {
  formatDateLabel,
  getInterventionById,
  getObstacleById,
} from "../lib/masterySelectors";

export function ExperimentsScreen() {
  const state = useMasteryData();

  return (
    <SectionCard
      title="Experiments"
      description="Experiments will be linked directly to interventions and retain their own history, reflection, and outcomes."
    >
      <div className="entity-list">
        {(state.experiments || []).map((experiment) => {
          const intervention = getInterventionById(state, experiment.interventionId);
          const obstacle = intervention
            ? getObstacleById(state, intervention.obstacleId)
            : null;

          return (
            <article key={experiment.id} className="entity-card">
              <div className="entity-card-header">
                <div>
                  <h3>{experiment.title}</h3>
                  <div className="entity-subtle">
                    {[intervention?.title, obstacle?.title].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <span className="status-pill">{experiment.status}</span>
              </div>

              <div className="entity-label">Hypothesis</div>
              <div className="entity-copy">{experiment.hypothesis}</div>

              <div className="entity-grid">
                <div>
                  <div className="entity-label">Expected change</div>
                  <div>{experiment.expectedChange || "Not set"}</div>
                </div>
                <div>
                  <div className="entity-label">Started</div>
                  <div>{formatDateLabel(experiment.startAt)}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}
