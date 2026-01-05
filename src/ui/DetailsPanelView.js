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
 * - Templates rendered inside this panel are expected to include a
 *   close control with the `.details-close` class.
 * - The panel delegates close behavior via event delegation.
 * - If this panel is ever used in a non-modal context, close affordances
 *   should be revisited and possibly owned by the panel itself.
 * 
 * TODO:
 * If DetailsPanelView is ever used outside a modal context,
 * consider making the close control explicit (owned by the panel)
 * rather than relying on template conventions.
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
    if (!$panel.find('.details-close').length) {
        console.warn('DetailsPanelView: no .details-close element found');
    }

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
