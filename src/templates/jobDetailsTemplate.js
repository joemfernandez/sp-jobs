/**
 * Renders a job details panel.
 * This file intentionally contains formatting logic only.
 */

import DateFormatter from '../core/DateFormatter';
import linkifyHtml from 'linkify-html';

export default function jobDetailsTemplate(job) {
  const dateFormatter = new DateFormatter();
  const announcementDate = dateFormatter.formatDisplay(job.announcementDate);
  const detailsHtml = linkifyHtml(job.details);

  return `
    <div class="details-panel">
      <button
        class="details-close"
        aria-label="Close job details"
        type="button">
        ✕
      </button>

      <h2 id="details-panel-heading">Job details for ${job.position}</h2>

      <dl>
        <dt>Notice Number</dt>
        <dd>${job.noticeNumber}</dd>

        <dt>Grade</dt>
        <dd>${job.grade}</dd>

        <dt>Location</dt>
        <dd>${job.commandLocation}</dd>

        <dt>Announcement Date</dt>
        <dd>${announcementDate}</dd>
      </dl>

      <div class="details-body">
        ${detailsHtml}
      </div>
    </div>
  `;
}
