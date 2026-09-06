// @vitest-environment happy-dom

import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENDPOINTS_TAB, POSITION_STORAGE_KEY, SETTINGS_TAB } from '../../constant.js';
import type { MockProxyTab, Position } from '../../interface.js';
import { MockProxyInteractionElement } from './element.js';

const TEST_TAG_NAME = 'wf-test-mock-proxy-interaction';

class TestInteractionElement extends MockProxyInteractionElement {
    get currentPosition(): Position {
        return this.position;
    }

    get currentTab(): MockProxyTab {
        return this.activeTab;
    }

    get isOpen(): boolean {
        return this.open;
    }

    toggle = (): void => this.togglePanel();
    pointerDown = (event: PointerEvent): void => this.handleLauncherPointerDown(event);
    pointerMove = (event: PointerEvent): void => this.handleLauncherPointerMove(event);
    pointerUp = (): void => this.handleLauncherPointerUp();
    tabKeyDown = (event: KeyboardEvent): void => this.handleTabKeyDown(event);

    render = () => html`
        <button class="launcher">Open</button>
        <button class="close">Close</button>
        <button id="tab-endpoints">Endpoints</button>
        <button id="tab-settings">Settings</button>
    `;
}

if (!customElements.get(TEST_TAG_NAME)) customElements.define(TEST_TAG_NAME, TestInteractionElement);

const createElement = async (): Promise<TestInteractionElement> => {
    const element = document.createElement(TEST_TAG_NAME) as TestInteractionElement;
    document.body.append(element);
    await element.updateComplete;
    return element;
};

describe('MockProxyInteractionElement', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        localStorage.clear();
    });

    it('restores its position and manages open focus and Escape', async () => {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ x: 80, y: 90 }));
        const element = await createElement();

        expect(element.currentPosition).toEqual({ x: 80, y: 90 });
        element.toggle();
        await element.updateComplete;
        expect(element.isOpen).toBe(true);
        expect(element.shadowRoot?.activeElement).toBe(element.shadowRoot?.querySelector('.close'));

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
        await element.updateComplete;
        expect(element.isOpen).toBe(false);
        expect(element.shadowRoot?.activeElement).toBe(element.shadowRoot?.querySelector('.launcher'));
    });

    it('only starts dragging with Ctrl or Cmd and persists the clamped position', async () => {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ x: 28, y: 200 }));
        const element = await createElement();
        const pointerTarget = document.createElement('button');
        pointerTarget.setPointerCapture = vi.fn();
        const event = (values: Partial<PointerEvent>) => ({
            clientX: 40,
            clientY: 210,
            ctrlKey: false,
            metaKey: false,
            pointerId: 1,
            currentTarget: pointerTarget,
            preventDefault: vi.fn(),
            ...values
        }) as unknown as PointerEvent;

        element.pointerDown(event({}));
        element.pointerMove(event({ clientX: 200, clientY: 100 }));
        expect(element.currentPosition).not.toEqual({ x: 188, y: 90 });

        const modifiedEvent = event({ ctrlKey: true });
        element.pointerDown(modifiedEvent);
        element.pointerMove(event({ clientX: 200, clientY: 100 }));
        element.pointerUp();

        expect(modifiedEvent.preventDefault).toHaveBeenCalledOnce();
        expect(pointerTarget.setPointerCapture).toHaveBeenCalledWith(1);
        expect(element.currentPosition).toEqual({ x: 188, y: 90 });
        expect(localStorage.getItem(POSITION_STORAGE_KEY)).toBe('{"x":188,"y":90}');
    });

    it('switches tabs with horizontal arrow keys and moves focus', async () => {
        const element = await createElement();
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });

        element.tabKeyDown(event);
        await element.updateComplete;

        expect(event.defaultPrevented).toBe(true);
        expect(element.currentTab).toBe(SETTINGS_TAB);
        expect(element.shadowRoot?.activeElement).toBe(element.shadowRoot?.querySelector('#tab-settings'));

        element.tabKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        await element.updateComplete;
        expect(element.currentTab).toBe(ENDPOINTS_TAB);
    });
});
