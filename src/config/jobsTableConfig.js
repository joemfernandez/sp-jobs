export default function jobsTableConfig(dateFormatter) {
    return {
        defaultOrder: [[1, 'desc'], [0, 'desc']],
        rowActionSelector: '.job-link.js-position',
        rowActionDataKey: 'id',
        columns: [
            { data: 'noticeNumber', title: 'Notice #' },
            {
                data: 'announcementDate',
                title: 'Date',
                render: function (data, type) {
                    return type === 'display'
                        ? dateFormatter.formatDisplay(data)
                        : dateFormatter.formatSortValue(data);
                }
            },
            { data: 'commandLocation', title: 'Command and Location' },
            { data: 'grade', title: 'Grade' },
            {
                data: 'position',
                title: 'Position',
                render: function (data, type, row) {
                    return (
                        '<button type="button" class="job-link js-position" data-id="' +
                        row.id +
                        '" aria-label="View details for ' + data + '">' +
                        data +
                        '</button>'
                    );
                }
            }
        ]
    };
}
