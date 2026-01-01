export default function JobsDataService(httpClient, url) {

    function normalize(job) {
        return {
            id: job.Id,
            noticeNumber: job.Notice_Num,
            announcementDate: job.Announcement_Date,
            closingDate: job.Closing_Date,
            commandLocation: job.Command_Location,
            grade: job.Grade,
            position: job.Position,
            details: job.Details,
            raw: job // optional but recommended
        };
    }

    function ensureArray(response) {
        if (!Array.isArray(response)) {
            throw new Error(
                'JobsDataService.getAll: expected an array response'
            );
        }
        return response;
    }

    return {
        getAll: function () {
            return httpClient.get(url)
                .then(ensureArray)
                .then(jobs => jobs.map(normalize));
        }
    };
}
