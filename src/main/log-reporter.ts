(() => {
    import('../utils/debug').then(({ log }) => {
        log('s1.hdslb.com/bfs/cm/cm-sdk/static/js/bili-collect.js')
    });
    Reflect.set(globalThis, 'reportObserver', Object.assign(Object.create(null), {
        reportCustomData: () => { },
        forceCommit: () => { },
    }));
})();