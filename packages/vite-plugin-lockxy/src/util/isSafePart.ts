export const isSafePart = (part: string): boolean => part !== '.' && part !== '..' && !part.includes('\\');
