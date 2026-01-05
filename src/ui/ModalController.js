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
  let backdrop;
  let invoker;
  let keydownHandler;

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

  function createBackdrop() {
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', deactivate);
    document.body.appendChild(backdrop);
  }

  function registerKeyboard() {
    keydownHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        deactivate();
      }
    };

    document.addEventListener('keydown', keydownHandler);
  }

  function removeKeyboard() {
    document.removeEventListener('keydown', keydownHandler);
  }

  function applyAria() {
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
  }

  function restoreAria() {
    modalElement.removeAttribute('aria-modal');
  }

  function focusFirstElement() {
    modalElement.setAttribute('tabindex', '-1');
    modalElement.focus();
  }

  function restoreFocus() {
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
  }

  function trapFocus() {
    // Phase 2a: minimal trap
    // TODO: If multiple focusable elements are added,
    // implement full Tab/Shift+Tab cycling.
  }

  function removeBackdrop() {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
    }
  }

  return {
    activate,
    deactivate
  };
}
