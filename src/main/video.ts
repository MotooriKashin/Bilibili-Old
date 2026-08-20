(() => {
    import('../utils/debug').then(({ log }) => {
        log('s1.hdslb.com/bfs/static/player/main/video.js')
    });
    function EmbedPlayer(
        _type: string,
        _player: any,
        playerParamsArg: string,
        _playerType: string,
        _upgrade: boolean,
        _callbackFn: Function,
        _isIframe: boolean,
    ) {
        const bofqi = document.querySelector('#bilibili-player') || document.querySelector('#bofqi');
        if (!bofqi) throw new Error('未找到播放器容器');
        import('./EmbedPlayer').then(({ EmbedPlayer }) => {
            const player = new EmbedPlayer();
            bofqi.replaceWith(player);
            player.dispatchEvent(new CustomEvent('--init', { detail: playerParamsArg || location.search }));
        });
    }
    Reflect.set(globalThis, 'EmbedPlayer', EmbedPlayer);
})();