export default function DetailsPanel($, panelSelector) {
    return {
        show: function (job) {
            $(panelSelector)
                .html(job.details)
                .addClass('is-visible');
        },
        hide: function () {
            $(panelSelector).removeClass('is-visible');
        }
    };
}
