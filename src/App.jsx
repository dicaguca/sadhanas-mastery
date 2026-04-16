import React from "react";
import { Route, Routes } from "react-router-dom";
import { appRoutes } from "./routes";
import { AppShell } from "./components/AppShell";
import { MasteryDataProvider } from "./store/useMasteryData.jsx";

export default function App() {
  return (
    <MasteryDataProvider>
      <AppShell>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AppShell>
    </MasteryDataProvider>
  );
}
