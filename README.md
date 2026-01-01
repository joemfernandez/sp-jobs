# SharePoint Jobs & Events UI (Rollup + ES5 Compatible)

This project provides a **reusable, testable UI framework** for displaying tabular data (Jobs, Events, etc.) on **SharePoint 2016 Publishing Pages** using a **Content Editor Web Part (CEWP)**.

It is designed with:

- IE11 compatibility
- Modular, SRP-friendly architecture
- Rollup-based bundling
- Local preview support (no SharePoint upload required during development)

---

## 📦 Output

The build produces a single application bundle:

```
dist/apps.bundle.min.js
```

This bundle exposes a global initializer for SharePoint usage.

---

## 🗂️ Project Structure

```
root
├── src
│   ├── app
│   │   ├── initJobsApp.js
│   │   ├── initEventsApp.js
│   │   └── bootstrap.js
│   ├── data
│   │   ├── JobsDataService.js
│   │   └── EventsDataService.js
│   ├── ui
│   │   ├── DataTableView.js
│   │   └── DetailsPanelView.js
│   ├── config
│   │   ├── jobsTableConfig.js
│   │   └── eventsTableConfig.js
│   └── utils
│       └── normalizeJob.js
├── preview
│   └── index.html
├── scripts
│   └── copy-assets.js
├── dist
├── vendor
├── polyfills
├── rollup.config.js
├── package.json
└── README.md
```

---

## 🔁 Data Normalization (Important)

SharePoint lists often return data with **PascalCase or snake_case** properties (e.g. `Id`, `Announcement_Date`).

This project **normalizes all external data** into a consistent internal shape:

```js
{
  id, announcementDate, grade, position;
}
```

### Why normalize?

| Benefit     | Explanation                                          |
| ----------- | ---------------------------------------------------- |
| Stability   | UI code is insulated from backend schema changes     |
| Reuse       | Same UI works for Jobs, Events, or future data types |
| Testability | Normalized objects are predictable                   |
| Readability | camelCase matches JavaScript conventions             |

Normalization occurs **inside the DataService layer** so the rest of the app never sees raw SharePoint data.

---

## 🧪 Local Development & Preview

### Why preview locally?

Uploading files to SharePoint for every change is slow. This project supports **local preview** using Live Server.

### Preview Setup

1. Install the Live Server VS Code extension
2. Open:

```
preview/index.html
```

3. Right-click → **Open with Live Server**

The preview HTML references:

- `dist/apps.bundle.min.js`
- `vendor/` assets
- `polyfills/`

No SharePoint required.

---

## 🧱 Vendor & Polyfills Management

Vendor and polyfill files are **not committed** to the repo.

They are:

- Installed via `node_modules`
- Copied to `/vendor` and `/polyfills` using a script
- Ignored by Git

### Why?

- Prevents repo bloat
- Ensures consistent versions
- Simplifies onboarding

### Copy Script

```bash
npm run copy-assets
```

This copies:

- jQuery
- DataTables JS & CSS
- core-js-bundle

### DataTables Version Note

This project intentionally uses **DataTables 1.13.x**.

DataTables 2.x removes the legacy jQuery plugin API and is not compatible
with IE11 or script-tag-based environments such as SharePoint CEWP.

**Do not upgrade DataTables without revisiting these constraints.**

---

## 🏗️ Build

All build and asset-copy tools are declared in devDependencies.
No global installs are required.

```bash
npm install
npm run build
```

Produces:

```
dist/apps.bundle.min.js
```

ES5-compatible (IE11 safe).

---

## 🌐 SharePoint Deployment (CEWP)

1. Upload:

   - `apps.bundle.min.js`
   - `vendor/`
   - `polyfills/`
   - HTML snippet

2. Add a **Content Editor Web Part**

3. Reference the HTML file

No code changes are required between preview and SharePoint.

---

## 🔧 Git Configuration

### Ignored Paths

```
node_modules/
dist/
vendor/
polyfills/
```

If these folders were committed earlier, they must be **removed once** and then ignored.

---

## 🧭 Design Philosophy

- Services fetch & normalize data
- Views render only
- Apps wire dependencies
- No framework lock-in
- Minimal magic

This ensures a strong **ROI**: clean code today that scales without rewrites tomorrow.

---

## ✅ Status

✔ IE11 compatible
✔ SharePoint 2016 compatible
✔ Local preview enabled
✔ Easily extensible for new data types

---

If you add a new data type (e.g. Announcements):

1. Create a new DataService
2. Add a normalizer
3. Add a table config
4. Reuse the same UI views

No architectural changes required.

---

## 📐 Architecture & Design Rationale

For the reasoning behind the architectural decisions in this project
(data normalization, separation of concerns, reuse strategy, etc.),
see:

👉 [docs/architecture.md](docs/architecture.md)

This document focuses on _why_ the code is structured the way it is.
