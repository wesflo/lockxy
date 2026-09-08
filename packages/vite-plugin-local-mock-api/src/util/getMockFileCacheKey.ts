export const getMockFileCacheKey = (requestUrl: string, method: string | undefined): string => {
    const { pathname } = new URL(requestUrl, 'http://localhost');

    return `${method?.toUpperCase() || 'GET'}_${pathname}`;
};
