export const sharedCypressConfig = {
    video: false,
    e2e: {
        includeShadowDom: true,
        retries: {
            runMode: 1,
            openMode: 0,
        },
        screenshotOnRunFailure: true,
    },
};
