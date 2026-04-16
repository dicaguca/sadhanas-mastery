import React from "react";

export function SectionCard({ title, description, meta, children }) {
  return (
    <section className="section-card">
      <div className="section-card-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {meta ? <div className="section-meta">{meta}</div> : null}
      </div>
      {children}
    </section>
  );
}

