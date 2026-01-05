# Developer Guidelines

This document provides **standards and conventions** for building UI modules and writing tests in this project. It captures the lessons and patterns from Phase 2 development, ensuring consistency and maintainability.

---

## 1. Module Header Convention

Every module should start with a header documenting its responsibilities:

```javascript
// UI module: <ModuleName>
// Responsibilities:
// - List what this module actively does
//
// Non-responsibilities:
// - List what this module intentionally does NOT handle
//
// Notes / TODOs:
// - Any known caveats, limitations, or future refactor considerations
```

- Clearly defines the module contract.
- Helps reviewers and future developers understand the intended behavior.
- Use the notes/TODOs section for potential future refactor considerations or edge cases.

---

## 2. Dependency Injection

Modules should **inject external dependencies** rather than using globals.

**Why:**

- Facilitates unit testing.
- Reduces side effects.
- Makes it easier to swap or mock dependencies.

**Example:**

```javascript
export default function DetailsPanelView(panelSelector, $, modal) {
    ...
}
```

- Here, `$` is injected instead of using `window.jQuery`.
- `modal` is injected for modal behavior and focus management.

---

## 3. Unit Test Philosophy

- Use **Jest** for unit testing.
- Place tests in a `__tests__` folder **next to the module**.
- Test **observable behaviors only**:

  - DOM attributes / class changes.
  - Injected content.
  - Calls to injected dependencies.

**Avoid** testing:

- Tab key cycles or focus trapping.
- Escape key closing.
- Backdrop click behavior.

Those are better suited for **integration/E2E tests**.

---

## 4. Integration / E2E Test Philosophy

- Use a separate suite or QA/automation tool (e.g., Cypress, Playwright) for real browser behavior.
- Test behaviors that **cannot be reliably emulated in jsdom**, such as:

  - Keyboard navigation.
  - Focus restoration.
  - ARIA roles and screen reader behavior.

---

## 5. CSS / Styling Organization

- **Module-specific styles:** Place in a dedicated file (e.g., `details-panel.css`).
- **Shared modal/backdrop styles:** Place in `modal.css`.
- Use `.modal-open` on `<body>` for modal stacking/visibility.
- Follow the same conventions as Phase 2 for consistent behavior and layering.

---

## 6. Checklist for New Modules

Before merging new code:

- [ ] Add module header with responsibilities, non-responsibilities, notes/TODOs.
- [ ] Inject external dependencies where needed.
- [ ] Write Jest unit tests for observable behaviors.
- [ ] Place tests in `__tests__` folder next to the module.
- [ ] Confirm preview/manual QA for key interactive behaviors.
- [ ] Document any deferred tests or behaviors for integration/E2E testing.

---

## 7. Jest Test Stub

A reusable starting point for new module tests:

```javascript
/**
 * @jest-environment jsdom
 */

import $ from 'jquery';
import <ModuleName> from '../src/<path>/<ModuleName>';

describe('<ModuleName>', () => {
  let moduleInstance;
  let $element;
  let mockDependency;

  beforeEach(() => {
    document.body.innerHTML = `<div id="test-element"></div>`;
    $element = $('#test-element');

    mockDependency = { method: jest.fn() };

    moduleInstance = <ModuleName>('#test-element', $, mockDependency);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should do something observable', () => {
    // Arrange
    const html = '<p>Test content</p>';

    // Act
    moduleInstance.show(html);

    // Assert
    expect($element.html()).toBe(html);
    expect(mockDependency.method).toHaveBeenCalled();
  });
});
```
