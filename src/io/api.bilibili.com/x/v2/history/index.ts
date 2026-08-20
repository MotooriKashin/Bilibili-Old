/** 获取历史记录 */
export async function history(
    init?: RequestInit,
    pn = 1,
    ps = 6,
) {
    const sid = (await cookieStore.get('sid'))?.value ?? '';
    const url = new URL('https://api.bilibili.com/x/v2/history');
    const searchParams = new URLSearchParams(<any>{ ps, pn, sid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IHistory[]; }>>response.json();
}

interface IHistory {
    view_at: number;
    redirect_link: string;
    redirect_url?: string;
    title: string;
    device: number;
    progress: number;
    duration: number;
    page?: {
        page: number;
        duration: number;
    };
}