# SharePoint 2016 CEWP DataTable Project

This project provides a **clean, testable, and reusable pattern** for building list/detail UIs on **SharePoint 2016 on‑prem publishing pages** using:

- Content Editor Web Part (CEWP)
- jQuery + DataTables
- ES6 module authoring
- Rollup + Babel (ES5 output, IE11 compatible)

The architecture is intentionally **framework‑light** and **SharePoint‑friendly**, while still supporting unit testing and reuse outside SharePoint.

---

## 1. What This Project Solves

- Display tabular data stored as JSON (.txt) in a SharePoint document library
- Format and sort dates correctly (locale‑friendly display, numeric sort)
- Toggle a details panel from a table row
- Reuse the same UI engine for different data types (Jobs, Events, etc.)
- Keep business logic testable and maintainable

---

## 2. High‑Level Architecture

**Principle:**

> _Generic UI engines + domain‑specific configuration + explicit composition_

### Layers

| Layer      | Responsibility                        |
| ---------- | ------------------------------------- |
| `core/`    | Cross‑cutting utilities (HTTP, dates) |
| `data/`    | Domain‑specific data access           |
| `config/`  | Declarative UI configuration          |
| `ui/`      | Reusable UI engines                   |
| `app/`     | App composition (wiring only)         |
| `index.js` | Global exports for CEWP               |

---

## 3. Folder Structure

```text
src/
├─ app/
│  ├─ initJobsApp.js
│  └─ initEventsApp.js
│
├─ core/
│  ├─ HttpClient.js
│  └─ DateFormatter.js
│
├─ data/
│  ├─ JobsDataService.js
│  └─ EventsDataService.js
│
├─ ui/
│  ├─ DataTableView.js
│  └─ DetailsPanel.js
│
├─ config/
│  ├─ jobsTableConfig.js
│  └─ eventsTableConfig.js
│
└─ index.js
```

---

## 4. Key Design Decisions

### 4.1 Generic vs Domain‑Specific Code

**Kept domain‑specific:**

- Data services (`JobsDataService`, `EventsDataService`)
- Column definitions
- Labels and field names

**Made generic:**

- Table rendering (`DataTableView`)
- Details panel behavior
- Date formatting logic

This maximizes reuse **without over‑abstracting**.

---

### 4.2 Config‑Driven Tables

Each data type provides a **table configuration factory**:

```js
jobsTableConfig(dateFormatter);
```

These config files:

- Contain **no DOM logic**
- Contain **no data fetching**
- Are easy to unit test

---

### 4.3 Naming Conventions

| Item                | Convention           |
| ------------------- | -------------------- |
| Classes / factories | `PascalCase.js`      |
| Config functions    | `camelCaseConfig.js` |
| App initializers    | `initXApp.js`        |
| Entry point         | `index.js`           |

**Why `jobsTableConfig` is camelCase**

- It is a **plain function**, not a class
- It returns configuration data
- camelCase communicates “callable, lightweight, stateless”

---

## 5. SharePoint (CEWP) Integration

### 5.1 What Changes With the Refactor?

**Nothing significant.**

The CEWP integration remains simple because:

- The bundle still exposes global objects
- No module loader is required
- All logic is contained in one JS file

The only difference is **which global you call**.

---

### 5.2 Required Scripts (Order Matters)

```html
<script src="/SiteAssets/vendor/core-js.min.js"></script>
<script src="/SiteAssets/vendor/jquery.min.js"></script>
<script src="/SiteAssets/vendor/jquery.dataTables.min.js"></script>
<script src="/SiteAssets/apps/apps.bundle.min.js"></script>
```

---

### 5.3 Example CEWP HTML (Jobs)

```html
<table id="jobsTable"></table>
<div id="jobDetails"></div>

<script>
  JobsApp.init({
    dataUrl: "/Documents/jobs/jobs-data.txt",
    tableSelector: "#jobsTable",
    detailsSelector: "#jobDetails",
    locale: navigator.language || "en-US",
  });
</script>
```

### Example CEWP HTML (Events)

```html
<table id="eventsTable"></table>
<div id="eventDetails"></div>

<script>
  EventsApp.init({
    dataUrl: "/Documents/events/events-data.txt",
    tableSelector: "#eventsTable",
    detailsSelector: "#eventDetails",
  });
</script>
```

---

## 6. Build & Tooling

### Tools Used

- **Rollup** – bundling
- **Babel** – ES5 transpilation (IE11)
- **Jest** – unit testing
- **core‑js** – runtime polyfills

### Commands

```bash
npm run build
npm test
```

Output:

```text
dist/apps.bundle.min.js
```

---

## 7. IE11 Compatibility

The project is IE11‑safe because:

- Output is ES5 (`iife` format)
- No modern syntax in runtime code
- `core‑js` provides missing APIs
- jQuery + DataTables support IE11

---

## 8. Testing Strategy

| Area          | Test Type              |
| ------------- | ---------------------- |
| Services      | Unit tests (mock HTTP) |
| Configs       | Pure unit tests        |
| DateFormatter | Unit tests             |
| UI engines    | Integration tests      |

Tests do **not** require SharePoint.

---

## 9. Adding a New Data Type

To add a new list/detail UI:

1. Create a data service in `data/`
2. Create a table config in `config/`
3. Add an app initializer in `app/`
4. Export it from `index.js`

No changes required to core UI components.

---

## 10. Step-by-Step Setup Guide (New Developers)

This guide walks a new developer from clone → running → SharePoint deployment.

### Step 1: Prerequisites

- Node.js LTS (16.x or 18.x recommended)
- npm (comes with Node)
- VS Code (recommended)
- Access to a SharePoint 2016 on-prem publishing site

Verify Node:

```bash
node -v
npm -v
```

---

### Step 2: Clone and Install

```bash
git clone <repo-url>
cd sp-jobs
npm install
```

This installs Rollup, Babel, Jest, and related plugins.

---

### Step 3: Local Development Preview (Recommended)

This project intentionally includes a **local HTML preview file** for fast iteration.

Using a local preview:

- Avoids repeated uploads to SharePoint
- Speeds up refactoring and UI tweaks
- Uses the same bundled JavaScript as SharePoint

#### Files involved

```
/preview
  └── jobs.html
/dist
  └── apps.bundle.min.js
```

#### Example preview HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Jobs App Preview</title>

    <!-- Polyfills (IE11 parity) -->
    <script src="../polyfills/core-js.min.js"></script>

    <!-- jQuery + DataTables -->
    <script src="../vendor/jquery.min.js"></script>
    <script src="../vendor/jquery.dataTables.min.js"></script>

    <link rel="stylesheet" href="../vendor/jquery.dataTables.min.css" />
  </head>
  <body>
    <table id="jobsTable"></table>
    <div id="jobDetails"></div>

    <script src="../dist/apps.bundle.min.js"></script>
    <script>
      JobsApp.init({
        dataUrl: "/mock-data/jobs.json",
        tableSelector: "#jobsTable",
        detailsSelector: "#jobDetails",
      });
    </script>
  </body>
</html>
```

---

### Step 4: Run Live Server

Use VS Code Live Server (or any static server):

```text
Right-click preview/jobs.html → Open with Live Server
```

This setup mirrors SharePoint behavior without SharePoint overhead.

---

### Step 5: Run Tests

```bash
npm test
```

All tests run in Node using Jest. SharePoint is not required.

---

### Step 2: Clone and Install

```bash
git clone <repo-url>
cd sp-jobs
npm install
```

This installs Rollup, Babel, Jest, and related plugins.

---

### Step 3: Project Orientation

Key files to understand first:

- `src/index.js` – global exports for SharePoint
- `src/app/initJobsApp.js` – jobs composition root
- `src/config/jobsTableConfig.js` – jobs table definition
- `src/ui/DataTableView.js` – generic DataTables wrapper

New developers should **start at `initJobsApp.js`** and read downward.

---

### Step 4: Run Tests

```bash
npm test
```

All tests run in Node using Jest. SharePoint is not required.

---

### Step 5: Build the Bundle

```bash
npm run build
```

Output:

```text
dist/apps.bundle.min.js
```

This is the only JavaScript file deployed to SharePoint.

---

### Step 6: Deploy to SharePoint

1. Upload the following files:

   - `dist/apps.bundle.min.js`
   - `core-js.min.js` (polyfills)
   - jQuery and DataTables (if not already provided by the master page)

2. Upload the CEWP HTML file to a document library.

---

### Step 7: Configure the CEWP

Set **Content Link** to the uploaded HTML file.

Example:

```html
<table id="jobsTable"></table>
<div id="jobDetails"></div>

<script>
  JobsApp.init({
    dataUrl: "/Documents/jobs/jobs-data.txt",
    tableSelector: "#jobsTable",
    detailsSelector: "#jobDetails",
    locale: navigator.language || "en-US",
  });
</script>
```

---

### Step 8: Verify in Browser

- Open page in Edge / Chrome
- Verify table renders
- Click a row to open details
- Test in IE11 or Edge IE Mode

---

## 11. Data Normalization Strategy

### Why normalization exists

This project intentionally **normalizes raw data at the data-service boundary**.

Raw data (from SharePoint-hosted JSON / TXT files) often:

- Uses PascalCase property names
- Contains underscores or legacy naming
- Differs between data sources (Jobs vs Events)

UI and application code should **not** depend on these raw schemas.

Normalization creates a clean, stable contract for the rest of the application.

---

### Where normalization happens

Normalization occurs **inside each DataService**, immediately after data is fetched.

Example (`JobsDataService`):

```js
function normalize(job) {
  return {
    id: job.Id,
    noticeNumber: job.Notice_Num,
    announcementDate: job.Announcement_Date,
    closingDate: job.Closing_Date,
    commandLocation: job.Command_Location,
    grade: job.Grade,
    position: job.Position,
    details: job.Details,
    raw: job,
  };
}
```

- `normalize` is **private** (not exported)
- `getAll()` remains the public API
- Consumers never see raw property names

---

### The normalized data contract

After normalization, UI and app layers rely on:

```js
{
  id,
    noticeNumber,
    announcementDate,
    closingDate,
    commandLocation,
    grade,
    position,
    details,
    raw;
}
```

This contract:

- Uses camelCase (JavaScript convention)
- Is consistent across data types
- Is easier to read, test, and reuse

---

### Debugging and traceability

Normalization does **not** discard raw data.

Each normalized item includes a `raw` property that references the original object:

```js
item.raw;
```

This allows developers to:

- Compare normalized vs source data
- Troubleshoot SharePoint data issues
- Safely evolve schemas over time

---

### When normalization should change

Only update normalization when:

- The raw data schema changes
- A new data source is introduced

UI and application code should **never** be updated to accommodate raw schema changes.

---

## 12. Guiding Principles (Summary)

- Keep SharePoint concerns at the edges
- Normalize data at the boundary
- Prefer explicit composition
- Make contracts obvious
- Optimize for long-term maintainability

---

**Normalization is a design decision, not a requirement — but once adopted, it should be consistently applied.**
