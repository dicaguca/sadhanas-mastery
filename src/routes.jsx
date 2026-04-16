import React from "react";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ExperienceScreen } from "./screens/ExperienceScreen";
import { ObstaclesScreen } from "./screens/ObstaclesScreen";
import { InterventionsScreen } from "./screens/InterventionsScreen";
import { ExperimentsEditorScreen } from "./screens/ExperimentsEditorScreen";
import { PracticesScreen } from "./screens/PracticesScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ImportScreen } from "./screens/ImportScreen";

export const appRoutes = [
  { path: "/", element: <DashboardScreen /> },
  { path: "/practices", element: <PracticesScreen /> },
  { path: "/experience", element: <ExperienceScreen /> },
  { path: "/obstacles", element: <ObstaclesScreen /> },
  { path: "/interventions", element: <InterventionsScreen /> },
  { path: "/experiments", element: <ExperimentsEditorScreen /> },
  { path: "/settings", element: <SettingsScreen /> },
  { path: "/import", element: <ImportScreen /> },
];
