import DataTableView from '../ui/DataTableView';
import DetailsPanelView from '../ui/DetailsPanelView';
import EventsDataService from '../data/EventsDataService';
import eventsTableConfig from '../config/eventsTableConfig';
import DateFormatter from '../core/DateFormatter';
import HttpClient from '../core/HttpClient';
import eventDetailsTemplate from '../templates/eventDetailsTemplate';

export default function initEventsApp(config) {
    const $ = window.jQuery;
    const http = HttpClient($);
    const service = EventsDataService(http, config.dataUrl);
    const dateFormatter = DateFormatter(config.locale);

    const table = DataTableView(
        $,
        config.tableSelector,
        eventsTableConfig(dateFormatter)
    );

    const details = DetailsPanelView(config.detailsSelector);

    service.getAll().then(function (items) {
        table.init(items, function (item) {
            if (!item || !item.id) {
                console.warn('Row missing id:', item);
                return;
            }

            details.show(
                eventDetailsTemplate(item)
            );
        });

    });
}