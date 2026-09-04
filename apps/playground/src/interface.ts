export interface PlaygroundRequest {
    id: string;
    label: string;
    description: string;
    method: 'GET' | 'POST';
    path: string;
    body?: Record<string, unknown>;
}

export interface PlaygroundResult {
    body: string;
    duration: number;
    status: number;
    statusText: string;
}
