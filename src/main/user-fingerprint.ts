(() => {
    import('../utils/debug').then(({ log }) => {
        log('s1.hdslb.com/bfs/seed/jinkela/short/user-fingerprint/bili-user-fingerprint.min.js')
    });
    Reflect.set(globalThis, '__biliUserFp__', Object.assign(Object.create(null), {
        queryUserLog: () => [],
    }));
})();