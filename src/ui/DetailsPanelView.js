export default function DetailsPanelView(panelSelector) {
    var $panel = $(panelSelector);

    function show(html) {
        $panel.html(html).show();
    }

    function hide() {
        $panel.empty().hide();
    }

    // Delegate close behavior
    $panel.on('click', '.details-close', hide);

    return {
        show: show,
        hide: hide
    };
}
