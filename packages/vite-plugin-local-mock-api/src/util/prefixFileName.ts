export const prefixFileName = (path: string, prefix: string): string => {
    const parts = path.split('/');
    const fileName = parts.pop();

    return [...parts, `${prefix}_${fileName}`].join('/');
};
