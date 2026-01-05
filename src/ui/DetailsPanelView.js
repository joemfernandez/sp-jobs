/**
 * UI component: DetailsPanelView
 *
 * RESPONSIBILITIES:
 * - Render details content into a designated panel element
 * - Handle panel visibility and close button interactions
 * - Delegate all modal behavior (backdrop, focus, keyboard) to the injected ModalController
 *
 * NON-RESPONSIBILITIES:
 * - Managing backdrop creation/removal
 * - Focus trapping or keyboard event handling outside the panel content
 * - Creating or configuring ModalController instances
 *
 * NOTES:
 * - Expects jQuery ($) to be passed in
 * - Expects an instance of ModalController to be passed in
 * - Keeping this focused on rendering and delegation simplifies unit testing
 */
export default function DetailsPanelView(panelSelector, $, modal) {
    // Validate dependencies early
    if (typeof $ !== 'function') {
        throw new Error('DetailsPanelView requires a jQuery instance ($).');
    }
    if (!modal || typeof modal.activate !== 'function' || typeof modal.deactivate !== 'function') {
        throw new Error('DetailsPanelView requires a ModalController instance.');
    }

    var $panel = $(panelSelector);

    function show(html, triggerEl) {
        // Render content into the panel
        $panel.html(html).show();

        // Let the modal instance handle everything else
        modal.activate(triggerEl);
    }

    function hide() {
        // Immediately hide the panel
        $panel.hide();

        // Delegate modal cleanup (backdrop, focus, keyboard)
        modal.deactivate();
    }

    // Delegate close button inside panel
    $panel.on('click', '.details-close', hide);

    return {
        show,
        hide
    };
}
