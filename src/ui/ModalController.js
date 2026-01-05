/**
 * ModalController
 *
 * RESPONSIBILITIES:
 * - Enforce modal interaction rules (focus, keyboard, backdrop)
 * - Prevent interaction with background content while active
 *
 * NON-RESPONSIBILITIES:
 * - Rendering modal content
 * - Styling or layout of the modal
 * - Managing animations
 *
 * ASSUMPTIONS:
 * - Only one modal is active at a time
 *
 * If nested or simultaneous modals are introduced, this module
 * must be revisited.
 */
export default function ModalController({ modalElement, onClose }) {
  if (!modalElement) {
    throw new Error(
      'ModalController requires a modalElement DOM node'
    );
  }

  let backdrop;
  let invoker;
  let keydownHandler;

  // Helper: find all visible focusable elements within modal
  function getFocusableElements() {
    return Array.from(
      modalElement.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
  }

  function activate(invokerElement) {
    invoker = invokerElement || document.activeElement;

    createBackdrop();
    applyAria();
    trapFocus();
    registerKeyboard();
    focusFirstElement();
  }

  function deactivate() {
    removeKeyboard();
    removeBackdrop();
    restoreAria();
    restoreFocus();

    if (typeof onClose === 'function') {
      onClose();
    }
  }

  // Backdrop creation / click to close
  function createBackdrop() {
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', deactivate);
    document.body.appendChild(backdrop);
  }

  function removeBackdrop() {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
    }
  }

  // ARIA attributes
  function applyAria() {
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open'); // prevent background scroll
  }

  function restoreAria() {
    modalElement.removeAttribute('role');
    modalElement.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
  }

  // Focus management
  function focusFirstElement() {
    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    } else {
      modalElement.setAttribute('tabindex', '-1');
      modalElement.focus();
    }
  }

  function restoreFocus() {
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
  }

  // Keyboard handling
  function registerKeyboard() {
    keydownHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        deactivate();
      } else if (e.key === 'Tab') {
        handleTab(e);
      }
    };
    document.addEventListener('keydown', keydownHandler);
  }

  function removeKeyboard() {
    document.removeEventListener('keydown', keydownHandler);
  }

  // Focus trap for Tab / Shift+Tab
  function handleTab(e) {
    const focusable = getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Placeholder in case modal needs enhanced focus handling
  function trapFocus() {
    // TODO: If modal has dynamically added elements while open,
    // consider using MutationObserver to update focusable elements list
  }

  return {
    activate,
    deactivate,
  };
}
