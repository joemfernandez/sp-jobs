// App initializer: initJobsApp
//
// Responsibilities:
// - Bootstrap the jobs application
// - Wire together data, table view, details panel, and modal behavior
// - Translate user interactions into high-level application actions
//
// Non-responsibilities:
// - Rendering table rows or job details markup
// - Managing modal focus, backdrop, or accessibility behavior
// - Direct DOM manipulation beyond initial wiring
//
// Notes:
// - Acts as the composition root for UI modules
// - Depends on configuration passed in from preview/index.html
// - Should remain thin and orchestration-focused

import DataTableView from '../ui/DataTableView';
import JobsDataService from '../data/JobsDataService';
import jobsTableConfig from '../config/jobsTableConfig';
import jobDetailsTemplate from '../templates/jobDetailsTemplate';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import DetailsPanelView from '../ui/DetailsPanelView';
import StatusRegionView from '../ui/StatusRegionView';
import ModalController from '../ui/ModalController';

export default function initJobsApp(config) {
    // ---- Core dependency ----
    var $ = window.jQuery;

    // ---- Infrastructure ----
    var http = HttpClient($);
    var jobsService = JobsDataService(http, config.dataUrl);
    var dateFormatter = DateFormatter(config.locale);

    // ---- UI Components ----
    var status = StatusRegionView($, config.statusSelector);

    var table = DataTableView(
        $,
        config.tableSelector,
        jobsTableConfig(dateFormatter)
    );

    // ---- Modal + Details Panel ----
    var $panel = $(config.detailsSelector);
    var modal = new ModalController({
        panelSelector: $panel[0]
    });

    var detailsPanel = DetailsPanelView(
        config.detailsSelector,
        $,
        modal
    );

    // ---- App startup ----
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
