export default function eventDetailsTemplate(event) {
  return `
    <div class="details-panel">
      <button
        class="details-close"
        aria-label="Close event details"
        type="button">
        ✕
      </button>

      <h2 id="details-panel-heading">Event details for ${event.title}</h2>

      <dl>
        <dt>Date</dt>
        <dd>${event.startDate}</dd>

        <dt>Location</dt>
        <dd>${event.location}</dd>
      </dl>

      <div class="details-body">
        ${event.details}
      </div>
    </div>
  `;
}
