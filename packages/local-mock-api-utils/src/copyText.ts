import type { ClipboardWriter } from './interface.js';

export const copyText = async (
    value: string,
    clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard
): Promise<void> => {
    await clipboard?.writeText(value);
};
