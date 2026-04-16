import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryData } from "../store/useMasteryData.jsx";
import { formatDateLabel } from "../lib/masterySelectors";

export function ExperienceScreen() {
  const state = useMasteryData();

  return (
    <SectionCard
      title="Experience"
      description="Experience entries will replace the one-time week-based reflection with a longitudinal timeline."
    >
      <div className="entity-list">
        {(state.experienceEntries || []).map((entry) => (
          <article key={entry.id} className="entity-card">
            <div className="entity-card-header">
              <h3>Experience Entry</h3>
              <span className="entity-subtle">{formatDateLabel(entry.createdAt)}</span>
            </div>

            <div className="entity-label">Current experience</div>
            <div className="entity-copy">{entry.currentExperience}</div>

            <div className="entity-label">Desired experience</div>
            <div className="entity-copy">{entry.desiredExperience}</div>

            {entry.changeNotes ? (
              <>
                <div className="entity-label">Change notes</div>
                <div className="entity-copy">{entry.changeNotes}</div>
              </>
            ) : null}
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
