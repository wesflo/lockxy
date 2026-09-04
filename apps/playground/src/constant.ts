import type { PlaygroundRequest } from './interface.js';

export const PLAYGROUND_TAG_NAME = 'wf-mock-proxy-playground';

export const PLAYGROUND_REQUESTS: readonly PlaygroundRequest[] = [
    {
        id: 'profile',
        label: 'Profil laden',
        description: 'Prüft Default-, Admin- und Gast-Szenario sowie den selektiven Bypass.',
        method: 'GET',
        path: '/api/playground/profile',
    },
    {
        id: 'orders',
        label: 'Bestellung absenden',
        description: 'Prüft methodenspezifische Dateien und einen simulierten Validierungsfehler.',
        method: 'POST',
        path: '/api/playground/orders',
        body: { articleNumber: 'WF-42', quantity: 2 },
    },
    {
        id: 'availability',
        label: 'Verfügbarkeit prüfen',
        description: 'Prüft ein verzögertes Szenario und macht den Wechsel im Panel sichtbar.',
        method: 'GET',
        path: '/api/playground/availability',
    },
];
