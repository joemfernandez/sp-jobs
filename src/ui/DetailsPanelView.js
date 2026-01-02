// UI component: Accessible modal details panel
// Responsibilities:
// - Render details content
// - Act as a modal dialog (role, aria-modal)
// - Trap focus while open
// - Restore focus to trigger on close

export default function DetailsPanelView(panelSelector) {
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
        lastTrigger = triggerEl || document.activeElement;

        $panel
            .attr({
                role: 'dialog',
                'aria-modal': 'true'
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

    return {
        show: show,
        hide: hide
    };
}
