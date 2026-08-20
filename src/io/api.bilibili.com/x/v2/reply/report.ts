/** 举报评论 */
export async function report(
    oid: bigint,
    rpid: string,
    reason: REPORT_REASON,
    content = '',
    type = 1,
    init?: RequestInit,
    ordering: 'heat' | 'time' = 'heat',
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/v2/reply/report');
    const body = new FormData();
    body.set('oid', oid.toString());
    body.set('rpid', rpid);
    body.set('reason', reason.toString());
    body.set('content', content);
    body.set('type', type.toString());
    body.set('ordering', ordering);
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}

enum REPORT_REASON {
    /** 其他（content） */
    OTHER = 0,
    /** 垃圾广告 */
    AD = 1,
    /** 色情 */
    EROTICISM = 2,
    /** 刷屏 */
    SCREEN_FLOOD = 3,
    /** 引战 */
    BATTLE = 4,
    /** 剧透 */
    SPOILER = 5,
    /** 人身攻击 */
    ASSAULT_AND_BATTERY = 7,
    /** 内容不相关 */
    OUTLYING = 8,
    /** 违反法律法规 */
    RAW = 9,
    /** 低俗 */
    LOW = 10,
    /** 赌博诈骗 */
    DEFRAUD = 12,
    /** 侵犯隐私 */
    INTIMACY = 15,
    /** 抢楼 */
    FLOOR_BATTLE = 16,
    /** 青少年不良信息 */
    TEEN_AGE = 17,
    /** 涉政谣言 */
    POLITICS_RUMOUR = 19,
    /** 涉社会事件谣言 */
    SOCIETY_RUMOUR = 20,
    /** 疫情谣言 */
    COVID_RUMOUR = 21,
    /** 虚假不实信息 */
    FAKE_NEWS = 22,
}