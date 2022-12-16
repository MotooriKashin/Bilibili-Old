import { objUrl } from "../utils/format/url";
import { isArray } from "../utils/typeof";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

interface IApiArticleCardsData {
    av?: number | number[],
    ss?: number | number[],
    ep?: number | number[]
};
export async function apiArticleCards(data: IApiArticleCardsData) {
    const arr: string[] = [];
    Object.entries(data).forEach(d => {
        if (d[1]) {
            (isArray(d[1]) ? d[1] : [d[1]]).forEach(t => arr.push(d[0] + t));
        }
    });
    if (!arr.length) throw new Error('输入参数不能为空！');
    const response = await fetch(objUrl(URLS.ARTICLE_CARDS, { ids: arr.join(',') }));
    const json = await response.json();
    return <Record<string, IAidDatail>>jsonCheck(json).data;
}