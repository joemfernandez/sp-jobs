// App initializer: initEventsApp
//
// Responsibilities:
// - Bootstrap the events application
// - Wire together data, table view, details panel, and modal behavior
// - Translate user interactions into high-level application actions
//
// Non-responsibilities:
// - Rendering table rows or event details markup
// - Managing modal focus, backdrop, or accessibility behavior
// - Direct DOM manipulation beyond initial wiring
//
// Notes:
// - Acts as the composition root for UI modules
// - Depends on configuration passed in from preview/index.html
// - Should remain thin and orchestration-focused

import DataTableView from '../ui/DataTableView';
import EventsDataService from '../data/EventsDataService';
import eventsTableConfig from '../config/eventsTableConfig';
import eventDetailsTemplate from '../templates/eventDetailsTemplate';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import DetailsPanelView from '../ui/DetailsPanelView';
import StatusRegionView from '../ui/StatusRegionView';
import ModalController from '../ui/ModalController';

export default function initEventsApp(config) {
    // ---- Core dependency ----
    var $ = window.jQuery;

    // ---- Infrastructure ----
    var http = HttpClient($);
    var eventsService = EventsDataService(http, config.dataUrl);
    var dateFormatter = DateFormatter(config.locale);

    // ---- UI Components ----
    var status = StatusRegionView($, config.statusSelector);

    var table = DataTableView(
        $,
        config.tableSelector,
        eventsTableConfig(dateFormatter)
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

    eventsService.getAll()
        .then(function (data) {
            table.init(data, function (item, triggerEl) {
                if (!item || !item.id) {
                    console.warn('Row missing id:', item);
                    return;
                }

                detailsPanel.show(
                    eventDetailsTemplate(item),
                    triggerEl
                );
            });

            status.setLoaded();
        })
        .catch(function () {
            status.setError();
        });
}
