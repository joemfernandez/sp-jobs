/**
 * @jest-environment jsdom
 *
 * ModalController Unit Tests
 *
 * Responsibilities tested:
 * - Activate modal (backdrop, attributes, focus)
 * - Deactivate modal (restore focus, hide backdrop)
 * - Escape key closes modal
 * - Backdrop click closes modal
 * - Focus trapping inside modal
 */

import $ from 'jquery';
import ModalController from '../ModalController';

describe('ModalController', () => {
    let modalElement;
    let triggerEl;
    let modal;

    beforeEach(() => {
        // Set up DOM: modal element + body
        document.body.innerHTML = `<div id="modal"></div>`;
        modalElement = $('#modal')[0];

        // Mock trigger button
        triggerEl = document.createElement('button');
        document.body.appendChild(triggerEl);
        triggerEl.focus = jest.fn(); // spy on focus

        // Initialize ModalController with required object
        modal = new ModalController({
            modalElement: modalElement,
            onClose: jest.fn()
        });
    });


    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    test('activate() shows modal and adds attributes', () => {
        modalElement.innerHTML = `
      <button id="btn1">First</button>
      <button id="btn2">Second</button>
    `;

        const firstButton = $('#btn1')[0];
        firstButton.focus = jest.fn();

        modal.activate(triggerEl);

        // Backdrop exists
        const backdrop = document.querySelector('.modal-backdrop');
        expect(backdrop).toBeTruthy();

        // Modal attributes
        expect(modalElement.getAttribute('role')).toBe('dialog');
        expect(modalElement.getAttribute('aria-modal')).toBe('true');
    });

    test('deactivate() hides modal and removes attributes', () => {
        modal.activate(triggerEl);

        modal.deactivate();

        const backdrop = document.querySelector('.modal-backdrop');
        expect(backdrop).toBeFalsy();

        console.log('modalElement', modalElement)
        expect(modalElement.getAttribute('role')).toBeNull();
        expect(modalElement.getAttribute('aria-modal')).toBeNull();
    });

});
