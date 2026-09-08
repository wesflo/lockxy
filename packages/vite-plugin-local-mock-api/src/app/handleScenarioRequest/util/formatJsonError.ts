const getLineAndColumn = (content: string, position: number): { line: number; column: number } => {
    const beforeError = content.slice(0, position);
    const lines = beforeError.split('\n');

    return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
};

export const formatJsonError = (fileName: string, content: string, error: unknown): Error => {
    const source = error instanceof Error ? error.message : String(error);
    const position = /position\s+(\d+)/i.exec(source)?.[1];

    if (position === undefined) {
        return new SyntaxError(`${fileName}: Invalid JSON: ${source}`);
    }

    const { line, column } = getLineAndColumn(content, Number(position));
    return new SyntaxError(`${fileName}:${line}:${column}: Invalid JSON: ${source}`);
};
