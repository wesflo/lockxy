export const normalizeRequestPrefixes = (requestPrefixes: string | readonly string[]): readonly string[] =>
    typeof requestPrefixes === 'string' ? [requestPrefixes] : [...requestPrefixes];
