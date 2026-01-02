export default function DetailsPanelView(panelSelector) {
    var $panel = $(panelSelector);
    var lastActiveElement = null;

    // Initial a11y setup (one-time)
    $panel.attr({
        role: 'region',
        'aria-labelledby': 'details-panel-heading'
    }).attr('hidden', true);

    function show(html, triggerElement) {
        lastActiveElement = triggerElement || document.activeElement;

        $panel
            .html(html)
            .removeAttr('hidden');

        // Move focus to first focusable element
        focusFirstElement();
    }

    function hide() {
        $panel
            .attr('hidden', true)
            .empty();

        // Restore focus
        if (lastActiveElement && lastActiveElement.focus) {
            lastActiveElement.focus();
        }
    }

    function focusFirstElement() {
        var $focusable = $panel.find(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ).first();

        if ($focusable.length) {
            $focusable.focus();
        } else {
            $panel.attr('tabindex', '-1').focus();
        }
    }

    // Close button
    $panel.on('click', '.details-close', hide);

    // Escape key support
    $panel.on('keydown', function (e) {
        if (e.key === 'Escape') {
            hide();
        }
    });

    return {
        show: show,
        hide: hide
    };
}
