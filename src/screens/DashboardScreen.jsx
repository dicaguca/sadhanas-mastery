import React from "react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { useMasteryData } from "../store/useMasteryData";
import {
  formatDateLabel,
  getDashboardSummary,
  getInterventionById,
  getObstacleById,
  getRecentExperimentLogs,
  getRecentPracticeLogs,
} from "../lib/masterySelectors";

const sectionLinks = [
  {
    to: "/experience",
    title: "Experience",
    description: "Track how your current and desired experience evolves over time.",
  },
  {
    to: "/obstacles",
    title: "Obstacles",
    description: "Review obstacles and their underlying causes without week-based filtering.",
  },
  {
    to: "/interventions",
    title: "Interventions",
    description: "Design interventions, accountability, and guardrails linked to obstacles.",
  },
  {
    to: "/experiments",
    title: "Experiments",
    description: "Create and review experiments linked to interventions.",
  },
];

export function DashboardScreen() {
  const state = useMasteryData();
  const summary = getDashboardSummary(state);
  const recentPracticeLogs = getRecentPracticeLogs(state);
  const recentExperimentLogs = getRecentExperimentLogs(state);

  return (
    <div className="dashboard-layout">
      <div className="main-column">
        <SectionCard
          title="Practices"
          description={`${summary.activePracticesCount} active practice${summary.activePracticesCount === 1 ? "" : "s"} out of ${summary.practicesCount} total.`}
          meta="Hero Section"
        >
          <div className="hero-panel hero-panel-practices">
            <div className="hero-copy">
              <div className="hero-kicker">Central Practice Space</div>
              <p>
                Practices hold the living thread of the work: what you are still
                committing to, what you are adjusting, and what you are learning as
                life shifts.
              </p>
              <div className="hero-metrics hero-metrics-grid">
                <span>{summary.practicesCount} total practices</span>
                <span>{summary.interventionsCount} interventions</span>
                <span>{summary.activeExperimentsCount} active experiments</span>
                <span>{summary.obstaclesCount} tracked obstacles</span>
              </div>
            </div>
            <Link className="primary-link" to="/practices">
              Open Practices
            </Link>
          </div>
        </SectionCard>

        <div className="card-grid">
          {sectionLinks.map((section) => (
            <Link key={section.to} to={section.to} className="dashboard-tile">
              <div className="tile-kicker">Section</div>
              <div className="tile-title">{section.title}</div>
              <div className="tile-description">{section.description}</div>
              <div className="tile-meta">
                {section.title === "Experience" && `${summary.experienceCount} entries`}
                {section.title === "Obstacles" && `${summary.obstaclesCount} obstacles`}
                {section.title === "Interventions" && `${summary.interventionsCount} interventions`}
                {section.title === "Experiments" && `${summary.activeExperimentsCount} active`}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className="side-column">
        <SectionCard
          title="Practice Logs"
          description="Recent practice activity."
        >
          <div className="placeholder-list">
            {recentPracticeLogs.length ? (
              recentPracticeLogs.map((log) => {
                const practice = (state.practices || []).find((row) => row.id === log.practiceId);
                return (
                  <div key={log.id} className="activity-row">
                    <div className="activity-title">{practice?.title || "Practice"}</div>
                    <div className="activity-text">{log.text}</div>
                    <div className="activity-date">{formatDateLabel(log.createdAt)}</div>
                  </div>
                );
              })
            ) : (
              <div className="placeholder-row">No logs yet</div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Experiment Logs"
          description="Recent experiment notes."
        >
          <div className="placeholder-list">
            {recentExperimentLogs.length ? (
              recentExperimentLogs.map((log) => {
                const experiment = (state.experiments || []).find((row) => row.id === log.experimentId);
                const intervention = experiment
                  ? getInterventionById(state, experiment.interventionId)
                  : null;
                const obstacle = intervention
                  ? getObstacleById(state, intervention.obstacleId)
                  : null;

                return (
                  <div key={log.id} className="activity-row">
                    <div className="activity-title">{experiment?.title || "Experiment"}</div>
                    <div className="activity-text">{log.text}</div>
                    <div className="activity-subtle">
                      {[intervention?.title, obstacle?.title].filter(Boolean).join(" · ")}
                    </div>
                    <div className="activity-date">{formatDateLabel(log.createdAt)}</div>
                  </div>
                );
              })
            ) : (
              <div className="placeholder-row">No logs yet</div>
            )}
          </div>
        </SectionCard>
      </aside>
    </div>
  );
}
