export interface ClipboardWriter {
    writeText(value: string): Promise<void>;
}
