import DataTableView from '../ui/DataTableView';
import DetailsPanelView from '../ui/DetailsPanelView';
import EventsDataService from '../data/EventsDataService';
import eventsTableConfig from '../config/eventsTableConfig';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import eventDetailsTemplate from '../templates/eventDetailsTemplate';
import StatusRegionView from '../ui/StatusRegionView';

export default function initEventsApp(config) {
    const $ = window.jQuery;
    const http = HttpClient($);
    const eventsService = EventsDataService(http, config.dataUrl);
    const dateFormatter = DateFormatter(config.locale);

    const status = StatusRegionView($, config.statusSelector);

    const table = DataTableView(
        $,
        config.tableSelector,
        eventsTableConfig(dateFormatter)
    );

    const detailsPanel = DetailsPanelView(config.detailsSelector);

    status.setLoading();

    eventsService.getAll()
        .then(data => {
            table.init(data, function (item, triggerEl) {
                if (!item || !item.id) {
                    console.warn('Row missing id:', item);
                    return;
                }

                detailsPanel.show(
                    eventDetailsTemplate(item),
                    triggerEl
                )
            });
            status.setLoaded();
        })
        .catch(() => {
            status.setError();
        });
}