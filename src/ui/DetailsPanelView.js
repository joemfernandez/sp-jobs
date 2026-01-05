/**
 * DetailsPanelView
 *
 * RESPONSIBILITIES:
 * - Render details content
 * - Own layout and visibility
 * - Handle close button clicks
 *
 * NON-RESPONSIBILITIES:
 * - Focus trapping
 * - Global keyboard handling (Escape, Tab)
 * - Backdrop creation/removal
 * - Disabling background interaction
 *
 * NOTE:
 * Modal behavior should be handled via ModalController.
 */
import ModalController from './ModalController';

export default function DetailsPanelView(panelSelector) {
    var $ = window.jQuery;
    var $panel = $(panelSelector);

    // ModalController instance
    var modal = new ModalController({
        modalElement: $panel[0],
        onClose: hide
    });

    function show(html, triggerEl) {
        $panel.html(html).show();

        // Activate modal behavior (focus, backdrop, Escape)
        modal.activate(triggerEl);
    }

    function hide() {
        $panel.hide();

        // Deactivate modal behavior
        modal.deactivate();
    }

    // Delegate close button
    $panel.on('click', '.details-close', hide);

    return {
        show: show,
        hide: hide
    };
}
