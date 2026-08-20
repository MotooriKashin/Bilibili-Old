import { fetch } from "../../main/widget/fetch";

/** 获取jijidown缓存的页面信息 */
export async function get_info(
    id: number | bigint,
    init?: RequestInit,
) {
    const url = new URL('https://www.jijidown.com/api/v1/video/get_info');
    const searchParams = new URLSearchParams(<any>{ id });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<IGetInfo>>response.json();
}
export interface IGetInfo {
    img: string;
    coins: number;
    tags?: string[];
    title: string;
    desc: string;
    favos: number;
    play: number;
    up: {
        sign: string;
        id: number;
        author: string;
        avatar: string;
        list: {
            id: number;
            title: string;
        }[];
    }
}