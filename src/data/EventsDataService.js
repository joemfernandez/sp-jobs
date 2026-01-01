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

    function ensureArray(response) {
        if (!Array.isArray(response)) {
            throw new Error(
                'EventsDataService.getAll: expected an array response'
            );
        }
        return response;
    }


    return {
        getAll: function () {
            return httpClient.get(url)
                .then(ensureArray)
                .then(events => events.map(normalize));
        }
    };
}
