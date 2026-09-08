export interface PlaygroundRequest {
    id: string;
    group: string;
    label: string;
    description: string;
    method: 'GET' | 'POST' | 'PUT';
    path: string;
    body?: Record<string, unknown>;
}

export interface PlaygroundResult {
    body: string;
    duration: number;
    status: number;
    statusText: string;
    contentType: string;
}

export interface PlaygroundViewModel {
    activeRequestId?: string;
    result?: PlaygroundResult;
    selectedRequest?: PlaygroundRequest;
}

export interface PlaygroundViewActions {
    execute(): Promise<void>;
    selectRequest(request: PlaygroundRequest): void;
}
