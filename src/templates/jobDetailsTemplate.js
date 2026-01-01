/**
 * Renders a job details panel.
 * This file intentionally contains formatting logic only.
 */
export default function jobDetailsTemplate(job) {
    return `
    <div class="details-panel">
      <button
        class="details-close"
        aria-label="Close job details"
        type="button">
        ✕
      </button>

      <h2>${job.position}</h2>

      <dl>
        <dt>Notice Number</dt>
        <dd>${job.noticeNumber}</dd>

        <dt>Grade</dt>
        <dd>${job.grade}</dd>

        <dt>Location</dt>
        <dd>${job.location}</dd>

        <dt>Announcement Date</dt>
        <dd>${job.announcementDate}</dd>
      </dl>

      <div class="details-body">
        ${job.details}
      </div>
    </div>
  `;
}
