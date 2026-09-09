import type { Position, PositionStorage } from '../interface.js';

export const persistPosition = (storage: PositionStorage, key: string, position: Position): void => {
    try {
        storage.setItem(key, JSON.stringify(position));
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};
