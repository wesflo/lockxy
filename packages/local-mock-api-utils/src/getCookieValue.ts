export const getCookieValue = (name: string, cookie = document.cookie): string | undefined => {
    const prefix = `${encodeURIComponent(name)}=`;
    const entry = cookie.split('; ').find((part) => part.startsWith(prefix));

    return entry ? decodeURIComponent(entry.slice(prefix.length)) : undefined;
};
