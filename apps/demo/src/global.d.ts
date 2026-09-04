export {};

declare global {
    interface Window {
        EP: {
            api: {
                [key: string]: string;
            };
            data: {};
            user: {
                currency: string;
                lang: string;
            };
        };
    }
}
