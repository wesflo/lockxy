import type { PlaygroundRequest } from './interface.js';

export const PLAYGROUND_TAG_NAME = 'wf-mock-proxy-playground';

export const PLAYGROUND_REQUESTS: readonly PlaygroundRequest[] = [
    {
        id: 'profile',
        label: 'Load profile',
        description: 'Tests the default, admin, and guest scenarios as well as selective bypass.',
        method: 'GET',
        path: '/api/playground/profile',
    },
    {
        id: 'orders',
        label: 'Submit order',
        description: 'Tests method-specific files and a simulated validation error.',
        method: 'POST',
        path: '/api/playground/orders',
        body: { articleNumber: 'WF-42', quantity: 2 },
    },
    {
        id: 'availability',
        label: 'Check availability',
        description: 'Tests a delayed scenario and makes the panel selection visible.',
        method: 'GET',
        path: '/api/playground/availability',
    },
];
