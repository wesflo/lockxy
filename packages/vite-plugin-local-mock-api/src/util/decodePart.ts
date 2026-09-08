export const decodePart = (part: string): string | null => {
    try {
        return decodeURIComponent(part);
    } catch {
        return null;
    }
};
