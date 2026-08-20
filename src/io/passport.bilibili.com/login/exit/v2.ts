/** 退出登录 */
export async function exit(
    init?: RequestInit,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: biliCSRF } = bili_jct;
    if (!biliCSRF) throw new Error('操作失败！');
    const body = new FormData();
    body.set('biliCSRF', biliCSRF);
    body.set('gourl', location.href);
    const response = await fetch('https://passport.bilibili.com/login/exit/v2', { method: 'POST', body, credentials: 'include', ...init });
    const { code, message, data }: { code: number; message: string; data: IShow; } = await response.json();
    if (code) throw (`${code} ${message}`);
    const { redirectUrl } = data;
    location.replace(redirectUrl);
}

interface IShow {
    redirectUrl: string;
}