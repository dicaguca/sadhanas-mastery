import React from "react";
import { SectionCard } from "../components/SectionCard";

export function SettingsScreen() {
  return (
    <SectionCard
      title="Settings"
      description="Settings will eventually manage import/export, local data, and display preferences."
    >
      <div className="screen-placeholder">
        <p>Planned v1 settings:</p>
        <ul>
          <li>Export local data</li>
          <li>Restore data</li>
          <li>Open import flow</li>
        </ul>
      </div>
    </SectionCard>
  );
}

