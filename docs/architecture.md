# Architecture & Design Rationale

## Purpose

This document captures the **architectural decisions and guiding principles**
behind this UI framework.

It is intentionally **not**:

- A setup or build guide
- A SharePoint deployment manual
- A file-by-file walkthrough

Those concerns are covered in the README.

This document exists to explain **why the code is structured the way it is**
and to preserve the reasoning behind decisions that may not be obvious from
the implementation alone.

The intent is that these principles remain useful for **future projects**
with similar constraints, even outside of SharePoint.

---

## Constraints That Shaped the Architecture

This project was designed under a specific (and common) set of constraints:

- SharePoint 2016 on-premise
- Publishing Pages with Content Editor Web Parts (CEWP)
- No SPFx, no modern framework support
- IE11 compatibility required
- No server-side build or transpilation
- Long-term maintainability by developers with mixed skill levels
- Desire to reuse the UI for multiple data types (Jobs, Events, etc.)

These constraints are treated as **facts**, not limitations to work around
with excessive abstraction or tooling.

The architecture favors **clarity, predictability, and longevity**
over novelty.

---

## Core Architectural Principles

### 1. Normalize Data at the Boundary

External data sources (SharePoint lists, JSON files, APIs) often expose
inconsistent naming conventions such as:

- `Id`
- `Announcement_Date`
- `closing_date`

Internally, the application uses **consistent camelCase objects**.

Normalization occurs **inside the Data Service layer**, ensuring:

- UI components never depend on backend schemas
- Data shape changes are isolated to one place
- Tests can rely on predictable input
- Code reads like idiomatic JavaScript

Once normalized, the rest of the application never sees raw external data.

---

### 2. Generic UI, Domain-Specific Configuration

UI components are designed to be **generic and reusable**:

- Tables do not “know” about jobs or events
- Detail panels do not parse domain data
- Views render what they are given

Domain-specific behavior lives in:

- Table configuration objects
- Data services
- App initialization code

This allows the same UI to be reused for new data types with minimal effort
and without forking components.

#### Table Structure Contract

When using static HTML `<thead>` markup for accessibility, the number and order
of `<th>` elements must match the column definitions provided to DataTables via
configuration.

This ensures correct header association, sorting behavior, and screen reader output.

---

### 3. Data Services Own External Knowledge

Data Services are responsible for:

- Fetching data
- Normalizing external schemas
- Returning predictable domain objects

They do **not**:

- Manipulate the DOM
- Know about UI components
- Contain rendering logic

This keeps external dependencies (SharePoint, JSON structure, APIs)
from leaking into the rest of the application.

---

### 4. Views Render Only

UI views follow a strict rule:

> **Views render data. They do not fetch it or transform it.**

Views:

- Accept data and configuration
- Render UI
- Emit events or callbacks
- Manage focus and accessibility behavior for the UI they own

They do not:

- Know where data came from
- Modify data shape
- Contain business rules

This separation keeps views simple, testable, and reusable.

---

### 5. Dependency Injection Over Hard Imports

Modules receive their dependencies explicitly (e.g. services, configs),
rather than importing concrete implementations directly.

Benefits include:

- Easier unit testing
- Reduced coupling
- Clear ownership boundaries
- Ability to swap implementations without refactoring

This approach avoids framework-level complexity while preserving flexibility.

---

### 6. ES5-Compatible Output, Modern Source Code

Source code is written using modern JavaScript practices, then bundled and
transpiled to **ES5-compatible output**.

This allows developers to:

- Write clear, modern code
- Maintain IE11 compatibility
- Avoid runtime polyfill surprises in SharePoint

The build step is intentionally simple and transparent.

---

## Accessible Modal Strategy

The details panel is implemented as a **true modal dialog**, not an inline
expansion or secondary panel.

This decision was driven by accessibility and usability concerns:

- Keyboard users must not tab into background content while details are open
- Screen reader users must receive a clear context shift
- Focus must be explicitly managed and restored

### Modal Characteristics

The details panel:

- Uses `role="dialog"` and `aria-modal="true"`
- Is labelled via `aria-labelledby`
- Traps focus while open
- Restores focus to the triggering control on close
- Can be dismissed via:

  - Close button
  - Escape key
  - Backdrop click

### Backdrop-Based Background Blocking

Instead of applying `aria-hidden` to surrounding content, the application uses
a **single, global backdrop element**:

```html
<div id="modal-backdrop"></div>
```

This backdrop:

- Visually obscures background content
- Prevents pointer interaction with background UI
- Avoids modifying or traversing third-party DOM structures

This approach was chosen because libraries such as **DataTables dynamically
inject and re-parent DOM nodes**, making DOM-wide `aria-hidden` strategies
fragile and error-prone.

### Why `aria-hidden` Was Avoided

Applying `aria-hidden` to arbitrary ancestors or siblings caused runtime errors
when focused elements were later hidden:

> "Blocked aria-hidden on an element because its descendant retained focus"

Rather than attempting to chase dynamically-created nodes, the architecture
favors:

- Explicit focus management within the modal
- Visual + pointer blocking via backdrop
- Clear modal semantics for assistive technologies

This strategy is more robust in legacy and third-party-heavy environments such
as SharePoint.

---

## Accessibility Philosophy

This project prioritizes:

- Correct semantics at component boundaries
- Predictable keyboard behavior
- Explicit focus management

It intentionally avoids attempting to retrofit accessibility attributes onto
DOM structures generated by third-party libraries.

Where possible, accessibility is achieved through **composition and isolation**
rather than DOM mutation.

---

## Tradeoffs and Non-Goals

This architecture intentionally avoids:

- Client-side frameworks
- Runtime dependency injection containers
- Complex state management
- Dynamic schema introspection
- Over-abstraction for hypothetical reuse

These choices reduce complexity and onboarding time, and reflect the
long-lived, low-churn nature of SharePoint environments.

---

## Testing Philosophy

Testing focuses on:

- Data normalization logic
- Data services
- Configuration-driven behavior

UI rendering logic is kept simple enough that heavy DOM testing is unnecessary.

By normalizing data early and isolating responsibilities, most logic can be
tested without SharePoint, the DOM, or network access.

---

## When This Architecture May Not Be Appropriate

This approach may not be a good fit for:

- Highly interactive single-page applications
- Projects requiring real-time state synchronization
- Teams already standardized on a client framework
- Rapid schema experimentation without stable contracts

It is optimized for **stability, reuse, and maintainability** rather than
maximum flexibility.

---

## Summary

This architecture prioritizes:

- Clear boundaries
- Predictable data
- Minimal coupling
- Long-term maintainability

It is intentionally conservative, favoring code that can be understood,
modified, and reused years later over short-term convenience.

The result is a small, composable UI framework that works reliably within
legacy constraints while remaining adaptable to future needs.

---

### UI Component Naming

Files in `src/ui` are intentionally suffixed with `View`:

- `DataTableView`
- `DetailsPanelView`

This naming convention signals that these modules:

- Contain **presentation logic only**
- Do not fetch or transform data
- Accept already-prepared inputs (HTML, config, callbacks)

This helps enforce separation of concerns and makes UI components reusable across
Jobs, Events, and future data types.

---

### Content Formatting in Templates

Formatting concerns such as date display and link detection
are handled at the template layer (e.g. Linkify usage).

This keeps:

- data services pure
- UI components reusable
- formatting decisions explicit and testable
