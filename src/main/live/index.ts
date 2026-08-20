(() => {
    import('../../utils/debug').then(({ log }) => {
        log('阻止直播间挂机检测');
    });
    document.addEventListener('visibilitychange', (e) => {
        e.stopImmediatePropagation(); // 阻止后续同类型事件处理
    }, true);
    Reflect.defineProperty(document, 'visibilityState', { value: 'visible' });
})();