import DataTableView from '../ui/DataTableView';
import JobsDataService from '../data/JobsDataService';
import jobsTableConfig from '../config/jobsTableConfig';
import jobDetailsTemplate from '../templates/jobDetailsTemplate';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import DetailsPanelView from '../ui/DetailsPanelView';
import StatusRegionView from '../ui/StatusRegionView';

export default function initJobsApp(config) {
    const $ = window.jQuery;
    const http = HttpClient($);
    const service = JobsDataService(http, config.dataUrl);
    const dateFormatter = DateFormatter(config.locale);

    const status = StatusRegionView($, config.statusSelector);

    const table = DataTableView(
        $,
        config.tableSelector,
        jobsTableConfig(dateFormatter)
    );

    const details = DetailsPanelView(config.detailsSelector);

    status.setLoaded();

    service.getAll()
        .then(data => {
            table.init(data, (item) => {
                if (!item || !item.id) {
                    console.warn('Row missing id:', item);
                    return;
                }

                details.show(
                    jobDetailsTemplate(item)
                )
            });
            status.setLoaded();
        })
        .catch(() => {
            status.setError();
        });

}
