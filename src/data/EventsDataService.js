export default function EventsDataService(httpClient, url) {

    function normalize(event) {
        return {
            id: event.id,
            title: event.title,
            startDate: event.event_date,
            location: event.location,
            details: event.description,
            raw: event
        };
    }

    return {
        getAll: function () {
            return httpClient.get(url).then(function (events) {
                return events.map(normalize);
            });
        }
    };
}
