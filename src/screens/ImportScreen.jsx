import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useMasteryActions } from "../store/useMasteryData";
import { FMP_IMPORT_PLAN } from "../lib/fmpImportPlan";

export function ImportScreen() {
  const { importFromFmp, previewFmpImport } = useMasteryActions();
  const [rawJson, setRawJson] = React.useState("");
  const [preview, setPreview] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");

  const parseInput = () => {
    const text = String(rawJson || "").trim();
    if (!text) {
      setStatusMessage("Paste FMP JSON first.");
      return null;
    }

    try {
      const parsed = JSON.parse(text);
      setStatusMessage("");
      return parsed;
    } catch {
      setStatusMessage("The JSON could not be parsed.");
      return null;
    }
  };

  const loadFromBrowserStorage = () => {
    try {
      const raw = window.localStorage.getItem(FMP_IMPORT_PLAN.sourceStorageKey);
      if (!raw) {
        setStatusMessage(
          `No browser data found under ${FMP_IMPORT_PLAN.sourceStorageKey}.`
        );
        return;
      }

      setRawJson(raw);
      setStatusMessage("Loaded FMP data from browser storage.");
    } catch {
      setStatusMessage("Could not read browser storage.");
    }
  };

  const runPreview = () => {
    const parsed = parseInput();
    if (!parsed) return;
    setPreview(previewFmpImport(parsed));
    setStatusMessage("Import preview generated.");
  };

  const runImport = () => {
    const parsed = parseInput();
    if (!parsed) return;
    importFromFmp(parsed);
    setPreview(previewFmpImport(parsed));
    setStatusMessage("FMP data imported into Sadhanas Mastery.");
  };

  return (
    <SectionCard
      title="Import From FMP"
      description="Import will transform existing Fearless Mastery Productivity data into the new standalone object model."
    >
      <div className="entity-list">
        <div className="entity-card editor-card">
          <div className="entity-card-header">
            <div>
              <h3>Import Source</h3>
              <div className="entity-subtle">
                Load existing FMP data from this browser or paste raw JSON.
              </div>
            </div>
          </div>

          <div className="editor-toolbar">
            <button
              type="button"
              className="secondary-button"
              onClick={loadFromBrowserStorage}
            >
              Load From Browser Storage
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={runPreview}
            >
              Preview Import
            </button>

            <button
              type="button"
              className="primary-link button-reset"
              onClick={runImport}
            >
              Import Now
            </button>
          </div>

          <label className="field-block">
            <span className="field-label">FMP JSON</span>
            <textarea
              className="field-input field-textarea import-textarea"
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              placeholder="Paste the exported FMP backup JSON here, or load it from browser storage."
            />
          </label>

          {statusMessage ? <div className="entity-subtle">{statusMessage}</div> : null}
        </div>

        <div className="entity-card editor-card">
          <div className="entity-card-header">
            <div>
              <h3>Import Mapping</h3>
              <div className="entity-subtle">
                Current v1 transformation plan from Fearless Mastery Productivity.
              </div>
            </div>
          </div>

          <div className="stack-list">
            {FMP_IMPORT_PLAN.sections.map((section) => (
              <div key={`${section.source}_${section.target}`} className="sub-card">
                <div className="entity-label">{section.source} -> {section.target}</div>
                <div>{section.strategy}</div>
              </div>
            ))}
          </div>
        </div>

        {preview ? (
          <div className="entity-card editor-card">
            <div className="entity-card-header">
              <div>
                <h3>Preview</h3>
                <div className="entity-subtle">
                  Quick summary of the FMP data detected in the imported payload.
                </div>
              </div>
            </div>

            <div className="entity-grid">
              <div>
                <div className="entity-label">Source key</div>
                <div>{preview.sourceStorageKey}</div>
              </div>
              <div>
                <div className="entity-label">Imported weeks</div>
                <div>{(preview.importedWeeks || []).join(", ") || "None"}</div>
              </div>
              <div>
                <div className="entity-label">Answer sections</div>
                <div>{preview.counts?.answers ?? 0}</div>
              </div>
              <div>
                <div className="entity-label">Practice log groups</div>
                <div>{preview.counts?.practiceLogs ?? 0}</div>
              </div>
            </div>

            <div className="entity-label">Notes</div>
            <ul className="entity-bullets">
              {(preview.notes || []).map((note, index) => (
                <li key={`preview_note_${index}`}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
