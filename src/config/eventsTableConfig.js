export default function eventsTableConfig(dateFormatter) {
    return {
        defaultOrder: [[1, 'asc']],
        rowActionSelector: '.js-title',
        rowActionDataKey: 'id',
        columns: [
            {
                data: 'title',
                title: 'Event',
                render: function (data, type, row) {
                    return (
                        '<button class="js-title" data-id="' +
                        row.id +
                        '" aria-label="' + data + '">' +
                        data +
                        '</button>'
                    );
                }
            },
            {
                data: 'startDate',
                title: 'Date',
                render: function (data, type) {
                    return type === 'display'
                        ? dateFormatter.formatDisplay(data)
                        : dateFormatter.formatSortValue(data);
                }
            },
            { data: 'location', title: 'Location' }
        ]
    };
}
