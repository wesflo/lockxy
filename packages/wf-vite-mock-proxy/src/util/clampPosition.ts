import { LAUNCHER_SIZE, VIEWPORT_GAP } from '../constant.js';
import type { Position, Viewport } from '../interface.js';

export const clampPosition = (position: Position, viewport: Viewport): Position => ({
    x: Math.max(VIEWPORT_GAP, Math.min(position.x, viewport.width - LAUNCHER_SIZE - VIEWPORT_GAP)),
    y: Math.max(VIEWPORT_GAP, Math.min(position.y, viewport.height - LAUNCHER_SIZE - VIEWPORT_GAP))
});
