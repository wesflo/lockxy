export const getContentType = (
    extension: string,
    contentTypes: Readonly<Record<string, string>>
): string => contentTypes[extension] || 'application/octet-stream';
