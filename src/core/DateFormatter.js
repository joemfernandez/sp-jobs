export default function DateFormatter(locale) {
    locale = locale || 'en-US';

    function parse(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }

    function formatDisplay(dateString) {
        const date = parse(dateString);
        if (!date) return '';
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    }

    function formatSortValue(dateString) {
        const date = parse(dateString);
        return date ? date.getTime() : 0;
    }

    return {
        formatDisplay,
        formatSortValue
    };
}
