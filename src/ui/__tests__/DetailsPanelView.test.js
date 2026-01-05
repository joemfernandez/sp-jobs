/**
 * @jest-environment jsdom
 */

import $ from 'jquery';
import DetailsPanelView from '../DetailsPanelView';

describe('DetailsPanelView - Phase 2 Modal Behavior', () => {
    let detailsPanel;
    let panel;
    let mockModal;
    let triggerEl;

    beforeEach(() => {
        // Minimal DOM
        document.body.innerHTML = `<div id="panel"></div>`;
        panel = $('#panel');

        triggerEl = document.createElement('button');
        document.body.appendChild(triggerEl);

        // Mock ModalController
        mockModal = {
            activate: jest.fn(),
            deactivate: jest.fn()
        };

        // Inject dependencies
        detailsPanel = DetailsPanelView('#panel', $, mockModal);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('show() injects HTML and activates modal', () => {
        const html = `
      <button id="btn1">First</button>
      <button id="btn2">Second</button>
      <button class="details-close">Close</button>
    `;

        detailsPanel.show(html, triggerEl);

        // HTML injected
        expect(panel.html()).toContain('First');
        expect(panel.html()).toContain('Second');

        // Modal activated with trigger
        expect(mockModal.activate).toHaveBeenCalledWith(triggerEl);
    });

    test('hide() clears HTML and deactivates modal', () => {
        const html = '<p>Job details</p>';
        detailsPanel.show(html, triggerEl);

        detailsPanel.hide();

        // Panel cleared
        expect(panel.html()).toBe('');

        // Modal deactivated
        expect(mockModal.deactivate).toHaveBeenCalled();
    });

    test('clicking .details-close hides panel and deactivates modal', () => {
        const html = `<button class="details-close">Close</button>`;
        detailsPanel.show(html, triggerEl);

        const closeBtn = panel.find('.details-close')[0];
        closeBtn.click();

        expect(panel.html()).toBe('');
        expect(mockModal.deactivate).toHaveBeenCalled();
    });

});
