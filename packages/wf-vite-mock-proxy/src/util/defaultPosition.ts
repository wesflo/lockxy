import { LAUNCHER_SIZE } from '../constant.js';
import type { Position, Viewport } from '../interface.js';
import { clampPosition } from './clampPosition.js';

export const defaultPosition = (viewport: Viewport): Position =>
    clampPosition({ x: 28, y: Math.round((viewport.height - LAUNCHER_SIZE) / 2) }, viewport);
