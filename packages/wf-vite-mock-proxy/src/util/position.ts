import { LAUNCHER_SIZE, VIEWPORT_GAP } from '../constant.js';
import type { Position, PositionStorage, Viewport } from '../interface.js';

export const clampPosition = (position: Position, viewport: Viewport): Position => ({
    x: Math.max(VIEWPORT_GAP, Math.min(position.x, viewport.width - LAUNCHER_SIZE - VIEWPORT_GAP)),
    y: Math.max(VIEWPORT_GAP, Math.min(position.y, viewport.height - LAUNCHER_SIZE - VIEWPORT_GAP))
});

export const defaultPosition = (viewport: Viewport): Position =>
    clampPosition({ x: 28, y: Math.round((viewport.height - LAUNCHER_SIZE) / 2) }, viewport);

export const restorePosition = (storage: PositionStorage, key: string, viewport: Viewport): Position => {
    try {
        const stored = storage.getItem(key);
        if (!stored) return defaultPosition(viewport);

        const position = JSON.parse(stored) as Partial<Position>;
        return Number.isFinite(position.x) && Number.isFinite(position.y)
            ? clampPosition({ x: position.x!, y: position.y! }, viewport)
            : defaultPosition(viewport);
    } catch {
        return defaultPosition(viewport);
    }
};

export const persistPosition = (storage: PositionStorage, key: string, position: Position): void => {
    try {
        storage.setItem(key, JSON.stringify(position));
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
};
