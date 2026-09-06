import type { MockDelay } from '../interface';

export const formatDelay = (delay: MockDelay | undefined): string => {
    if (delay === undefined || delay === 0) {
        return 'No delay';
    }

    if (typeof delay === 'number') {
        return `${(delay / 1000).toFixed(1)}s`;
    }

    return `${(delay[0] / 1000).toFixed(1)}–${(delay[1] / 1000).toFixed(1)}s`;
};
