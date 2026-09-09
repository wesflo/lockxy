export const normalizeMockRoot = (mockRoot: URL): URL =>
    new URL(mockRoot.href.endsWith('/') ? mockRoot.href : `${mockRoot.href}/`);
