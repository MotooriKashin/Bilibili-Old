import { objUrl } from "../utils/format/url";
import { isArray } from "../utils/typeof";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

interface IApiArticleCardsData {
    av?: number | number[],
    ss?: number | number[],
    ep?: number | number[]
};
export function apiArticleCards(data: IApiArticleCardsData) {
    return new Promise((resolve: (value: Record<string, IAidDatail>) => void, reject) => {
        const arr: string[] = [];
        Object.entries(data).forEach(d => {
            if (d[1]) {
                (isArray(d[1]) ? d[1] : [d[1]]).forEach(t => arr.push(d[0] + t));
            }
        });
        if (!arr.length) return reject();
        fetch(objUrl(URLS.ARTICLE_CARDS, {
            ids: arr.join(',')
        }))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data))
            .catch(e => reject(e));
    });
}