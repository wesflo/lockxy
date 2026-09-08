export const isSafeScenarioFile = (file: string): boolean => {
    if (!file || file.startsWith('/') || file.includes('\\') || /^[A-Za-z]:/.test(file)) {
        return false;
    }

    return file.split('/').every((part) => part !== '' && part !== '.' && part !== '..');
};
