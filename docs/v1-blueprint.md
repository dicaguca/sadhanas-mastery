# Sadhanas Mastery v1 Blueprint

## Product Role

`Sadhanas Mastery` is a standalone, ongoing practice workspace that helps users continue adapting their practices after the timeline-based Fearless Mastery Productivity program ends.

This app is not another weekly practice. It is the next phase.

## Core Product Question

How do I keep working with my practices as my life changes?

## Product Principles

- Treat the system as living and revisable
- Make practices central
- Keep the structure relational but not overwhelming
- Support reflection, adaptation, and reuse
- Import prior FMP work so the app starts populated
- Feel calmer, more elegant, and less programmatic than FMP

## v1 Information Architecture

### Main Dashboard

- Header inspired by `sadhanas`
- Main/side layout inspired by `stru`
- Top-right settings button

### Main Column

- `Practices` hero section
- 4-card grid:
  - `Experience`
  - `Obstacles`
  - `Interventions`
  - `Experiments`

### Side Column

- `Practice Logs`
- `Experiment Logs`
- later optional utilities:
  - import status
  - quick actions
  - active practice summary

## v1 Screens

- Dashboard
- Practices
- Experience
- Obstacles
- Interventions
- Experiments
- Practice Logs
- Experiment Logs
- Settings
- Import From FMP

## Primary Entities

### Experience Entry

- `id`
- `createdAt`
- `currentExperience`
- `desiredExperience`
- `changeNotes`

### Obstacle

- `id`
- `title`
- `underlyingCauses[]`
- `notes`
- `status`
- `createdAt`
- `updatedAt`

### Intervention

- `id`
- `title`
- `obstacleId`
- `practiceText`
- `timing`
- `followThroughIndicators`
- `accountability`
- `guardrails[]`
- `status`
- `createdAt`
- `updatedAt`

### Experiment

- `id`
- `interventionId`
- `title`
- `hypothesis`
- `expectedChange`
- `startAt`
- `endAt`
- `status`
- `reflection`
- `outcome`
- `createdAt`
- `updatedAt`

### Practice

- `id`
- `title`
- `obstacleId`
- `currentInterventionId`
- `interventionHistory[]`
- `skills[]`
- `status`
- `firstStartedAt`
- `currentStartedAt`
- `pausedAt`
- `stoppedAt`
- `restartedAt`
- `createdAt`
- `updatedAt`

### Practice Log

- `id`
- `practiceId`
- `type`
- `text`
- `createdAt`

### Experiment Log

- `id`
- `experimentId`
- `text`
- `createdAt`

## Relationships

- one obstacle can have many interventions
- one intervention belongs to one obstacle
- one intervention can have many experiments
- one practice can reference one current intervention
- one practice may have intervention history over time
- skills belong to practices, not interventions
- logs belong to practices or experiments

## FMP Import Mapping

### Week 1

Import as first `Experience Entry`

### Week 2

Import obstacles and underlying causes

### Weeks 5-7

Import as initial interventions:
- intervention text
- practice text
- timing
- follow-through indicators
- accountability
- safeguards -> `guardrails`

### Week 8

Import experiments tied to interventions

### Week 10

Import committed practices

### Week 11

Import skills onto practices

### Week 12 / 15

Import practice lifecycle and continuation state where applicable

### Existing Logs

Import practice logs and experiment logs

## Design Direction

- warm off-white backgrounds
- ivory / stone panels
- muted gold-grey accents
- elegant icon treatment
- less orange, less “course dashboard”
- clear but calm typography

## Engineering Direction

- Build as a standalone app
- Avoid week-based branching
- Keep domain logic outside UI components
- Use explicit schemas and adapters
- Treat import as a first-class feature
- Build reusable section/page layouts

## v1 Scope Guardrails

Include now:

- dashboard shell
- core section screens
- create/edit entity flows
- local persistence
- import from FMP
- basic logs

Leave for later:

- backend sync
- multi-device sync
- advanced compare views
- analytics/reporting
- heavy filtering systems

