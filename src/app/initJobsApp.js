import DataTableView from '../ui/DataTableView';
import JobsDataService from '../data/JobsDataService';
import jobsTableConfig from '../config/jobsTableConfig';
import jobDetailsTemplate from '../templates/jobDetailsTemplate';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import DetailsPanelView from '../ui/DetailsPanelView';
import StatusRegionView from '../ui/StatusRegionView';

export default function initJobsApp(config) {
    var $ = window.jQuery;

    var http = HttpClient($);
    var jobsService = JobsDataService(http, config.dataUrl);
    var dateFormatter = DateFormatter(config.locale);

    var status = StatusRegionView($, config.statusSelector);

    var table = DataTableView(
        $,
        config.tableSelector,
        jobsTableConfig(dateFormatter)
    );

    var detailsPanel = DetailsPanelView(config.detailsSelector);

    status.setLoading();

    jobsService.getAll()
        .then(function (data) {
            table.init(data, function (item, triggerEl) {
                if (!item || !item.id) {
                    console.warn('Row missing id:', item);
                    return;
                }

                detailsPanel.show(
                    jobDetailsTemplate(item),
                    triggerEl
                );
            });

            status.setLoaded();
        })
        .catch(function () {
            status.setError();
        });
}
