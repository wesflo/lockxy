import type { RequestLogDetails } from '../interface.js';
import { LOG_COLORS, METHOD_LOG_COLORS, RESPONSE_SOURCE_LABELS } from '../constant.js';

const colorize = (value: string, color: string, colorsEnabled: boolean): string =>
    colorsEnabled ? `${color}${value}${LOG_COLORS.reset}` : value;

const getStatusColor = (status: number): string => {
    if (status >= 400) {
        return LOG_COLORS.danger;
    }
    if (status >= 300) {
        return LOG_COLORS.primary;
    }
    if (status >= 200) {
        return LOG_COLORS.success;
    }

    return LOG_COLORS.primary;
};

export const logRequest = (
    enabled: boolean,
    details: RequestLogDetails,
    colorsEnabled = Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined
): void => {
    if (!enabled) {
        return;
    }

    const method = details.method.toUpperCase();
    const methodColor = METHOD_LOG_COLORS[method] ?? LOG_COLORS.primary;
    const source = RESPONSE_SOURCE_LABELS[details.source];

    console.info(
        `[lockxy] ${colorize(method, methodColor, colorsEnabled)} ${details.url} -> ` +
            `${colorize(String(details.status), getStatusColor(details.status), colorsEnabled)}; ` +
            `${colorize(`delay=${details.delay}ms`, LOG_COLORS.warning, colorsEnabled)}; ` +
            colorize(source, LOG_COLORS.primary, colorsEnabled)
    );
};
