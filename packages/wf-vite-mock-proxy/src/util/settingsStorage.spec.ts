import { describe, expect, it, vi } from 'vitest';

import type { SettingsStorage } from '../interface.js';
import { getEndpointSelectionKey } from './getEndpointSelectionKey.js';
import { persistBooleanSetting } from './persistBooleanSetting.js';
import { persistEndpointSelections } from './persistEndpointSelections.js';
import { removeStoredSetting } from './removeStoredSetting.js';
import { resetPanelStorage } from './resetPanelStorage.js';
import { restoreBooleanSetting } from './restoreBooleanSetting.js';
import { restoreEndpointSelections } from './restoreEndpointSelections.js';
import { restorePanelSettings } from './restorePanelSettings.js';

const createStorage = (value: string | null = null): SettingsStorage => ({
    getItem: vi.fn(() => value),
    setItem: vi.fn(),
    removeItem: vi.fn()
});

describe('settingsStorage', () => {
    it('creates a stable method and path key', () => {
        expect(getEndpointSelectionKey({ method: 'get', path: '/api/users' })).toBe('GET /api/users');
        expect(getEndpointSelectionKey({ path: '/api/users' })).toBe('* /api/users');
    });

    it.each([
        ['true', false, true],
        ['false', true, false],
        [null, true, true],
        ['invalid', false, false]
    ])('restores boolean value %s with fallback %s', (value, fallback, expected) => {
        expect(restoreBooleanSetting(createStorage(value), 'setting', fallback)).toBe(expected);
    });

    it('falls back when reading a boolean setting throws', () => {
        const storage = createStorage();
        vi.mocked(storage.getItem).mockImplementation(() => {
            throw new Error('blocked');
        });

        expect(restoreBooleanSetting(storage, 'setting', true)).toBe(true);
    });

    it('persists boolean settings', () => {
        const storage = createStorage();

        persistBooleanSetting(storage, 'setting', false);

        expect(storage.setItem).toHaveBeenCalledWith('setting', 'false');
    });

    it('restores valid endpoint selections and discards invalid entries', () => {
        const storage = createStorage(JSON.stringify([
            ['GET /api/users', { active: false, scenarioId: 'error' }],
            ['POST /api/users', { scenarioId: 'success' }],
            ['invalid-active', { active: 'false' }],
            ['invalid-scenario', { scenarioId: 42 }],
            [42, { active: false }],
            ['missing-selection'],
            'invalid-entry'
        ]));

        expect(restoreEndpointSelections(storage, 'selections')).toEqual(new Map([
            ['GET /api/users', { active: false, scenarioId: 'error' }],
            ['POST /api/users', { scenarioId: 'success' }]
        ]));
    });

    it.each([null, '', '{}', 'invalid-json'])('returns no selections for invalid stored value %s', (value) => {
        expect(restoreEndpointSelections(createStorage(value), 'selections')).toEqual(new Map());
    });

    it('returns no selections when storage access throws', () => {
        const storage = createStorage();
        vi.mocked(storage.getItem).mockImplementation(() => {
            throw new Error('blocked');
        });

        expect(restoreEndpointSelections(storage, 'selections')).toEqual(new Map());
    });

    it('serializes endpoint selections as ordered entries', () => {
        const storage = createStorage();

        persistEndpointSelections(
            storage,
            'selections',
            new Map([['GET /api/users', { active: false, scenarioId: 'error' }]])
        );

        expect(storage.setItem).toHaveBeenCalledWith(
            'selections',
            '[["GET /api/users",{"active":false,"scenarioId":"error"}]]'
        );
    });

    it('removes stored settings', () => {
        const storage = createStorage();

        removeStoredSetting(storage, 'selections');

        expect(storage.removeItem).toHaveBeenCalledWith('selections');
    });

    it('restores panel defaults and explicit settings', () => {
        const defaults = createStorage();
        expect(restorePanelSettings(defaults)).toEqual({ proxyOnLoad: true, saveSelections: false });

        const values = new Map([
            ['wesflo-mock-api-proxy-on-load', 'false'],
            ['wesflo-mock-api-save-selections', 'true']
        ]);
        const storage = createStorage();
        vi.mocked(storage.getItem).mockImplementation((key) => values.get(key) ?? null);
        expect(restorePanelSettings(storage)).toEqual({ proxyOnLoad: false, saveSelections: true });
    });

    it('resets every panel-owned storage key', () => {
        const storage = createStorage();

        resetPanelStorage(storage);

        expect(storage.removeItem).toHaveBeenCalledTimes(4);
        expect(storage.removeItem).toHaveBeenCalledWith('wesflo-mock-api-button-position');
        expect(storage.removeItem).toHaveBeenCalledWith('wesflo-mock-api-proxy-on-load');
        expect(storage.removeItem).toHaveBeenCalledWith('wesflo-mock-api-save-selections');
        expect(storage.removeItem).toHaveBeenCalledWith('wesflo-mock-api-endpoint-selections');
    });

    it('does not throw when writes or removals are blocked', () => {
        const storage = createStorage();
        vi.mocked(storage.setItem).mockImplementation(() => {
            throw new Error('blocked');
        });
        vi.mocked(storage.removeItem).mockImplementation(() => {
            throw new Error('blocked');
        });

        expect(() => persistBooleanSetting(storage, 'boolean', true)).not.toThrow();
        expect(() => persistEndpointSelections(storage, 'selections', new Map())).not.toThrow();
        expect(() => removeStoredSetting(storage, 'selections')).not.toThrow();
    });
});
