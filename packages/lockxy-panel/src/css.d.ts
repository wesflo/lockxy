declare module '*.css?inline' {
    const styles: string;
    export default styles;
}

declare module '*.svg?url' {
    const url: string;
    export default url;
}
