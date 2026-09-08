import type { MockDelay } from '../../../interface.js';

export const resolveDelay = (delay: MockDelay | undefined, random: () => number = Math.random): number => {
    if (delay === undefined || typeof delay === 'number') {
        return delay ?? 0;
    }

    const [minimum, maximum] = delay;
    return Math.floor(random() * (maximum - minimum + 1)) + minimum;
};
