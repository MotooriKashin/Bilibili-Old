/** 心跳上报 */
export async function heartbeat(
    cid: bigint,
    play_type = HEART_BEAT.DEFAULT,
    /**
     * HTMLVideoElement.currentTime 取整
     */
    realtime: number,
    /** 开始播放时间戳（秒） */
    start_ts: number,
    /** 统计播放时间 */
    real_played_time: number,
    /**
     * HTMLVideoElement.currentTime 取整  
     * 播放结束请填 -1  
     * 预览请删除
     */
    played_time?: number,
    /**
     * | 3 | 4 | 10 |
     * | - | - | - |
     * | UGC | PGC | PUGV |
     */
    type: 10 | 4 | 3 = 3,
    aid?: bigint,
    mid?: number,
    sid?: bigint,
    epid?: bigint,
    /** seasonType */
    subType = 0,
    /** 不保存历史记录填1 */
    no_history?: number,
    init?: RequestInit,
    dt = 2,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/click-interface/web/heartbeat');
    const body = new FormData();
    body.set('cid', <any>cid);
    body.set('play_type', <any>play_type);
    body.set('realtime', <any>realtime);
    body.set('start_ts', <any>start_ts);
    body.set('real_played_time', <any>real_played_time);
    played_time === undefined || body.set('played_time', <any>(play_type === HEART_BEAT.DEFAULT ? -1 : played_time));
    body.set('type', <any>type);
    body.set('aid', <any>aid || '');
    body.set('mid', <any>mid || '');
    sid && body.set('sid', <any>sid);
    epid && body.set('epid', <any>epid);
    body.set('subType', <any>subType);
    no_history === undefined || body.set('no_history', <any>no_history);
    body.set('dt', <any>dt);
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}

export enum HEART_BEAT {
    /** 心跳，15秒1次，暂停时除外 */
    DEFAULT,
    /** seeked和心跳循环前 */
    SEEKED,
    PAUSE,
    PLAYING,
    ENDED,
}