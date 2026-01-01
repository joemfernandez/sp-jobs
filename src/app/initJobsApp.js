import DataTableView from '../ui/DataTableView';
import JobsDataService from '../data/JobsDataService';
import jobsTableConfig from '../config/jobsTableConfig';
import jobDetailsTemplate from '../templates/jobDetailsTemplate';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import DetailsPanelView from '../ui/DetailsPanelView';

export default function initJobsApp(config) {
    const $ = window.jQuery;
    const http = HttpClient($);
    const service = JobsDataService(http, config.dataUrl);
    const dateFormatter = DateFormatter(config.locale);

    const table = DataTableView(
        $,
        config.tableSelector,
        jobsTableConfig(dateFormatter)
    );

    const details = DetailsPanelView(config.detailsSelector);

    service.getAll().then(function (items) {
        table.init(items, function (item) {
            if (!item || !item.id) {
                console.warn('Row missing id:', item);
                return;
            }

            details.show(
                jobDetailsTemplate(item)
            )
        });

    });
}
