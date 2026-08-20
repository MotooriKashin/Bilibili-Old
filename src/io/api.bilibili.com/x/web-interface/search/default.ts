/** 获取默认搜索 */
export async function s_default(
    init?: RequestInit,
) {
    const response = await fetch('https://api.bilibili.com/x/web-interface/search/default', { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IDefault; }>>response.json();
}

interface IDefault {
    name: string;
    url: string;
}