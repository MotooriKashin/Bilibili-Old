(() => {
    // 刷新页面同时禁止原始资源污染
    document.documentElement.replaceWith(document.createElement('html', { is: 'av-html' }));
    import('./main');
})();