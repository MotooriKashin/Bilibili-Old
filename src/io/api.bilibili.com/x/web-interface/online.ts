/** 获取在线数据 */
export async function online(
    init?: RequestInit,
) {
    const response = await fetch('https://api.bilibili.com/x/web-interface/online', { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IOnline; }>>response.json();
}

interface IOnline {
    region_count: Record<number, number>;
}