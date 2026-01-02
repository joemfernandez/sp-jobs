export default function StatusRegionView($, selector) {
    var $el = $(selector);

    if (!$el.length) {
        return {
            setLoading: function () { },
            setLoaded: function () { },
            setError: function () { }
        };
    }

    return {
        setLoading: function () {
            $el.text('Loading…');
        },
        setLoaded: function () {
            $el.text('Content loaded');
        },
        setError: function () {
            $el.text('Unable to load content');
        }
    };
}
