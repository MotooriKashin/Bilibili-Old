/** 获取用户表情 */
export async function web(
    business = 'reply',
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/emote/user/panel/web');
    const searchParams = new URLSearchParams(<any>{ business });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IWeb; }>>response.json();
}

export interface IWeb {
    packages: {
        url: string;
        text: string;
        meta: { size: number; };
        type: number;
        emote: {
            url: string;
            text: string;
        }[];
    }[];
}