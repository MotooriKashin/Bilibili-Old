import { BLOD } from "../bilibili-old";
import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

interface IAccountCard {
    DisplayRank: string;
    approve: boolean;
    article: number;
    attention: number;
    attentions: number[];
    birthday: string;
    coins: number;
    description: string;
    face: string;
    fans: number;
    friend: number;
    level_info: { next_exp: number; current_level: number; current_min: number; current_exp: number; };
    mid: number;
    name: string;
    nameplate: { condition: string; image: string; image_small: string; level: string; name: string; nid: number };
    official_verify: { type: number; desc: string; };
    pendant: { pid: number; name: string; image: string; expire: number; };
    place: string;
    rank: string;
    regtime: number;
    sex: string;
    sign: string;
    spacesta: number;
}
export async function accountGetCardByMid(mid: number, GM: BLOD['GM']) {
    const data = await GM.fetch(objUrl(URLS.ACCOUNT_GETCARDBYMID, { mid }));
    return <IAccountCard>jsonCheck(await data.json()).card;
}