export default function HttpClient($) {
    return {
        get: function (url) {
            return $.ajax({
                url,
                method: 'GET',
                dataType: 'json'
            });
        }
    };
}