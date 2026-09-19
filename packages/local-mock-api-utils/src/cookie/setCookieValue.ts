export const setCookieValue = (name: string, value: string): void => {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;
};
