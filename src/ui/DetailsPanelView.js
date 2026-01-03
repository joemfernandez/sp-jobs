// UI component: Accessible modal details panel
// Responsibilities:
// - Render details content
// - Act as a modal dialog (role, aria-modal)
// - Trap focus while open
// - Restore focus to trigger on close

export default function DetailsPanelView(panelSelector) {
    var $ = window.jQuery;
    var $backdrop = $('#modal-backdrop');
    var $panel = window.jQuery(panelSelector);
    var lastTrigger = null;

    function getFocusableElements() {
        return $panel
            .find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
            .filter(':visible');
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;

        var $focusable = getFocusableElements();
        if (!$focusable.length) return;

        var first = $focusable[0];
        var last = $focusable[$focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            hide();
        }
        trapFocus(e);
    }

    function show(html, triggerEl) {
        // Show backdrop (single global instance)
        if ($backdrop.length) {
            $backdrop.show();
        }
        lastTrigger = triggerEl || document.activeElement;

        $panel
            .attr({
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': 'details-panel-heading'
            })
            .html(html)
            .show();

        window.jQuery('body').addClass('modal-open');

        var $focusable = getFocusableElements();
        if ($focusable.length) {
            $focusable.first().focus();
        } else {
            $panel.attr('tabindex', '-1').focus();
        }

        $panel.on('keydown', onKeydown);
    }

    function hide() {
        // Hide backdrop
        if ($backdrop.length) {
            $backdrop.hide();
        }
        $panel
            .off('keydown', onKeydown)
            .removeAttr('role aria-modal tabindex')
            .empty()
            .hide();

        window.jQuery('body').removeClass('modal-open');

        if (lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
    }

    // Delegate close button
    $panel.on('click', '.details-close', hide);

    // Clicking the backdrop closes the modal
    if ($backdrop.length) {
        $backdrop.on('click', hide);
    }

    return {
        show: show,
        hide: hide
    };
}
