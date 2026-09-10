export const toMethodArray = (method: string | readonly string[] | undefined): readonly string[] =>
    method === undefined ? [] : typeof method === 'string' ? [method] : method;
