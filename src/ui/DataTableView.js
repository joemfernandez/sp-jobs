export default function DataTableView($, tableSelector, config) {
    let dataTable;

    function init(data, onRowAction) {
        dataTable = $(tableSelector).DataTable({
            data: data,
            columns: config.columns,
            order: config.defaultOrder || [],
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            language: {
                emptyTable: 'There are no open job postings. Check back later.'
            }
        });

        if (config.rowActionSelector) {
            $(tableSelector).on('click', config.rowActionSelector, function () {
                const $row = $(this).closest('tr');
                const rowData = dataTable.row($row).data();

                if (!rowData) {
                    console.warn('No row data found for clicked element');
                    return;
                }

                onRowAction(rowData);
            });
        }

    }

    return { init };
}
