// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';

import { wfElement } from './wfElement';

describe('wfElement', () => {
    it('registers a custom element once', () => {
        class FirstElement extends HTMLElement {}
        class SecondElement extends HTMLElement {}

        wfElement('wf-directive-test')(FirstElement);
        wfElement('wf-directive-test')(SecondElement);

        expect(customElements.get('wf-directive-test')).toBe(FirstElement);
    });
});
