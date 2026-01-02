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
    const jobsService = JobsDataService(http, config.dataUrl);
    const dateFormatter = DateFormatter(config.locale);

    const status = StatusRegionView($, config.statusSelector);

    const table = DataTableView(
        $,
        config.tableSelector,
        jobsTableConfig(dateFormatter)
    );

    const detailsPanel = DetailsPanelView(config.detailsSelector);

    status.setLoading();

    jobsService.getAll()
        .then(data => {
            table.init(data, function (item, triggerEl) {
                if (!item || !item.id) {
                    console.warn('Row missing id:', item);
                    return;
                }

                detailsPanel.show(
                    jobDetailsTemplate(item),
                    triggerEl
                )
            });
            status.setLoaded();
        })
        .catch(() => {
            status.setError();
        });

}
