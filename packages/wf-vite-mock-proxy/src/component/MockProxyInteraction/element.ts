import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { ENDPOINTS_TAB, POSITION_STORAGE_KEY, RESIZE_DEBOUNCE, SETTINGS_TAB } from '../../constant.js';
import type { DragState, MockProxyTab, Position } from '../../interface.js';
import { clampPosition, defaultPosition, persistPosition, restorePosition } from '../../util/position.js';

export abstract class MockProxyInteractionElement extends LitElement {
    @state() protected activeTab: MockProxyTab = ENDPOINTS_TAB;
    @state() protected dragState?: DragState;
    @state() protected open = false;
    @state() protected position: Position = { x: 28, y: 200 };

    private suppressLauncherClick = false;
    private resizeTimeout?: ReturnType<typeof setTimeout>;

    connectedCallback(): void {
        super.connectedCallback();
        this.position = restorePosition(localStorage, POSITION_STORAGE_KEY, this.viewport());
        window.addEventListener('resize', this.handleResize);
    }

    disconnectedCallback(): void {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        window.removeEventListener('resize', this.handleResize);
        clearTimeout(this.resizeTimeout);
        super.disconnectedCallback();
    }

    protected defaultPosition = (): Position => defaultPosition(this.viewport());

    protected togglePanel = (): void => {
        if (this.suppressLauncherClick) {
            this.suppressLauncherClick = false;
            return;
        }
        this.open ? this.closePanel() : this.openPanel();
    };

    protected closePanel = (): void => {
        this.open = false;
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>('.launcher')?.focus());
    };

    protected handleLauncherPointerDown = (event: PointerEvent): void => {
        if (!event.ctrlKey && !event.metaKey) return;

        event.preventDefault();
        this.suppressLauncherClick = true;
        this.dragState = {
            offsetX: event.clientX - this.position.x,
            offsetY: event.clientY - this.position.y
        };
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    };

    protected handleLauncherPointerMove = (event: PointerEvent): void => {
        if (!this.dragState) return;

        this.position = clampPosition(
            { x: event.clientX - this.dragState.offsetX, y: event.clientY - this.dragState.offsetY },
            this.viewport()
        );
    };

    protected handleLauncherPointerUp = (): void => {
        if (!this.dragState) return;

        this.dragState = undefined;
        persistPosition(localStorage, POSITION_STORAGE_KEY, this.position);
    };

    protected selectTab = (tab: MockProxyTab): void => {
        this.activeTab = tab;
    };

    protected handleTabKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        event.preventDefault();
        const nextTab = this.activeTab === ENDPOINTS_TAB ? SETTINGS_TAB : ENDPOINTS_TAB;
        this.activeTab = nextTab;
        void this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLButtonElement>(`#tab-${nextTab}`)?.focus()
        );
    };

    private viewport = () => ({ width: window.innerWidth, height: window.innerHeight });

    private handleResize = (): void => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.position = clampPosition(this.position, this.viewport());
        }, RESIZE_DEBOUNCE);
    };

    private handleDocumentKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && this.open) {
            event.preventDefault();
            this.closePanel();
        }
    };

    private openPanel = (): void => {
        this.open = true;
        document.addEventListener('keydown', this.handleDocumentKeyDown);
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>('.close')?.focus());
    };
}
