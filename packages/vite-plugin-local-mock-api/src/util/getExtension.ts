export const getExtension = (path: string): string => {
    const fileName = path.split('/').at(-1) || '';
    const index = fileName.lastIndexOf('.');

    return index > 0 ? fileName.slice(index).toLowerCase() : '';
};
