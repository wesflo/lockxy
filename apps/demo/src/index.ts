import { resetStyles, wfElement } from '@wesflo/local-mock-api-ui';

import {
    downloadBlob,
    getCookieValue,
    parseScenarioCookie,
    SCENARIO_COOKIE_NAME,
    setCookieValue,
    updateScenarioCookie,
} from '@wesflo/local-mock-api-utils';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { DEMO_CASES, DEMO_TAG_NAME } from './constant';
import type { DemoCase, DemoResult, MockManifest } from './interface';
import styles from './style';
import { renderDemo } from './view';
import { executeDemoCase } from './util/executeDemoCase';
import { loadManifest } from './util/loadManifest';

@wfElement(DEMO_TAG_NAME)
export class MockApiDemo extends LitElement {
    static styles = [resetStyles, styles];

    @state() private manifest?: MockManifest;
    @state() private manifestError?: string;
    @state() private manifestLoading = true;
    @state() private results = new Map<string, DemoResult>();
    @state() private running = false;
    @state() private selectedCase = DEMO_CASES.find(({ id }) => id === 'delay') ?? DEMO_CASES[0];
    @state() private selections = new Map<string, string>();

    connectedCallback(): void {
        super.connectedCallback();
        this.syncSelections();
        this.applyCaseSelection(this.selectedCase);
        void this.loadManifest();
    }

    private loadManifest = async (): Promise<void> => {
        this.manifestLoading = true;
        this.manifestError = undefined;

        try {
            this.manifest = await loadManifest();
        } catch (error) {
            this.manifest = undefined;
            this.manifestError = error instanceof Error ? error.message : String(error);
        } finally {
            this.manifestLoading = false;
        }
    };

    private applyCaseSelection = (testCase?: DemoCase): void => {
        if (!testCase?.endpointId) {
            return;
        }

        const nextValue = updateScenarioCookie(
            getCookieValue(SCENARIO_COOKIE_NAME),
            testCase.endpointId,
            testCase.scenarioId
        );
        setCookieValue(SCENARIO_COOKIE_NAME, nextValue);
        this.syncSelections();
    };

    private selectCase = (testCase: DemoCase): void => {
        this.selectedCase = testCase;
        this.applyCaseSelection(testCase);
    };

    private runSelectedCase = async (): Promise<void> => {
        const testCase = this.selectedCase;
        if (!testCase) {
            return;
        }

        this.applyCaseSelection(testCase);
        this.running = true;
        const result = await executeDemoCase(testCase);
        this.results = new Map(this.results).set(testCase.id, result);
        this.running = false;
    };

    private reset = (): void => {
        setCookieValue(SCENARIO_COOKIE_NAME, '');
        this.results = new Map();
        this.syncSelections();
    };

    private syncSelections = (): void => {
        this.selections = parseScenarioCookie(getCookieValue(SCENARIO_COOKIE_NAME));
    };

    private downloadSelected = (): void => {
        const result = this.selectedCase ? this.results.get(this.selectedCase.id) : undefined;
        if (result?.blob && this.selectedCase) {
            downloadBlob(result.blob, result.filename ?? this.selectedCase.downloadName ?? 'mock-response.bin');
        }
    };

    render = () =>
        renderDemo(
            {
                manifest: this.manifest,
                manifestError: this.manifestError,
                manifestLoading: this.manifestLoading,
                results: this.results,
                running: this.running,
                selectedCase: this.selectedCase,
                selections: this.selections
            },
            {
                downloadSelected: this.downloadSelected,
                reset: this.reset,
                runSelectedCase: this.runSelectedCase,
                selectCase: this.selectCase
            }
        );

}
