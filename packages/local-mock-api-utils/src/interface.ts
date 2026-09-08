export interface ClipboardWriter {
    writeText(value: string): Promise<void>;
}

export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}
