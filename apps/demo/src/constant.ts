import type { DemoCase } from './interface';

export const MANIFEST_ROUTE = '/_local-mock-api/manifest';

export const SCENARIO_COOKIE_NAME = 'ep-mock-api-scenarios';

export const DEMO_CASES: readonly DemoCase[] = [
    {
        id: 'legacy-path-fallback',
        group: 'Legacy fallback',
        title: 'Kürzerer Pfad-Kandidat',
        description: 'Die spezifischste Datei fehlt; der nächste passende Pfad liefert die Antwort.',
        method: 'GET',
        path: '/_internal/demo/legacy/users/42',
        responseKind: 'json',
        expectedStatus: 200
    },
    {
        id: 'method-precedence',
        group: 'Legacy fallback',
        title: 'Methodenspezifische Datei',
        description: 'POST_orders.json gewinnt vor der ebenfalls vorhandenen generischen orders.json.',
        method: 'POST',
        path: '/_internal/demo/orders',
        responseKind: 'json',
        expectedStatus: 200,
        body: { article: 'EP-DEMO', quantity: 1 }
    },
    {
        id: 'default-json',
        group: 'JSON & Dateien',
        endpointId: 'json-response',
        title: 'Default ohne Auswahl',
        description: 'Ohne Szenario-Cookie greift die unveränderte dynamische Dateisuche.',
        method: 'GET',
        path: '/_internal/demo/json',
        responseKind: 'json',
        expectedStatus: 200
    },
    {
        id: 'explicit-json',
        group: 'JSON & Dateien',
        endpointId: 'json-response',
        title: 'Explizite Szenario-Datei',
        description: 'Das Szenario verweist direkt auf eine andere JSON-Datei im Mock-Verzeichnis.',
        method: 'GET',
        path: '/_internal/demo/json',
        responseKind: 'json',
        expectedStatus: 200
    },
    {
        id: 'text-response',
        group: 'JSON & Dateien',
        endpointId: 'text-document',
        title: 'Text-Antwort',
        description: 'Eine TXT-Datei wird mit epFetchText als Klartext gelesen.',
        method: 'GET',
        path: '/_internal/demo/text',
        responseKind: 'text',
        expectedStatus: 200
    },
    {
        id: 'pdf-response',
        group: 'JSON & Dateien',
        endpointId: 'pdf-document',
        title: 'PDF-Download',
        description: 'Ein echtes PDF wird mit epFetchBlob geladen und anschließend zum Download angeboten.',
        method: 'GET',
        path: '/_internal/demo/pdf',
        responseKind: 'blob',
        expectedStatus: 200,
        downloadName: 'local-mock-api-demo.pdf'
    },
    {
        id: 'bad-request',
        group: 'HTTP-Status',
        endpointId: 'http-errors',
        title: 'Bad Request',
        description: 'Der Fetch-Helper verwirft die JSON-Antwort mit HTTP 400.',
        method: 'GET',
        path: '/_internal/demo/errors',
        responseKind: 'json',
        expectedStatus: 400
    },
    {
        id: 'server-error',
        group: 'HTTP-Status',
        endpointId: 'http-errors',
        title: 'Internal Server Error',
        description: 'Der Fetch-Helper verwirft die JSON-Antwort mit HTTP 500.',
        method: 'GET',
        path: '/_internal/demo/errors',
        responseKind: 'json',
        expectedStatus: 500
    },
    {
        id: 'no-content',
        group: 'HTTP-Status',
        endpointId: 'no-content',
        title: 'No Content',
        description: 'HTTP 204 wird aus einer leeren Datei ohne Response-Body ausgeliefert.',
        method: 'GET',
        path: '/_internal/demo/no-content',
        responseKind: 'text',
        expectedStatus: 204
    },
    {
        id: 'delay',
        group: 'Latenz',
        endpointId: 'delay',
        title: 'Konfigurierbare Verzögerung',
        description: 'Derselbe Endpoint demonstriert 0, 200 und 1000 Millisekunden Verzögerung.',
        method: 'GET',
        path: '/_internal/demo/delay',
        responseKind: 'json',
        expectedStatus: 200
    },
    {
        id: 'automatic-file',
        group: 'Latenz',
        endpointId: 'automatic-file',
        title: 'Szenario ohne file',
        description: 'Status und Delay kommen aus dem Szenario, die Datei weiterhin aus der Kandidatensuche.',
        method: 'GET',
        path: '/_internal/demo/automatic',
        responseKind: 'json',
        expectedStatus: 200
    },
    {
        id: 'alternate-mode-fallback',
        group: 'Manifest-Fallback',
        title: 'Legacy trotz Manifest-Fehler',
        description: 'Funktioniert im normalen, fehlenden und absichtlich ungültigen Manifest-Modus.',
        method: 'GET',
        path: '/_internal/demo/legacy',
        responseKind: 'json',
        expectedStatus: 200
    }
] as const;
