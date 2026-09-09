import type { Position, PositionStorage, Viewport } from '../interface.js';
import { clampPosition } from './clampPosition.js';
import { defaultPosition } from './defaultPosition.js';

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
