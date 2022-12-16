import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

interface ISeasonStatusData {
    season_id?: number;
    ep_id?: number;
}
export interface ISeasonStatusResponse {
    area_limit: number;
    ban_area_show: number;
    dialog: { btn_right: { title: string; type: string; }, desc: string; title: string; }
    follow: number;
    follow_status: number;
    login: number;
    paster: {
        aid: number;
        allow_jump: number;
        cid: number;
        duration: number;
        type: number;
        url: string;
    };
    pay: number;
    pay_pack_paid: number;
    real_price: string;
    sponsor: number;
    progress?: {
        last_ep_id: number;
        last_ep_index: string;
        last_time: number;
    };
    vip_info: {
        due_date: number;
        status: number;
        type: number;
    };
}
export async function apiSeasonStatus(data: ISeasonStatusData) {
    const response = await fetch(objUrl(URLS.SEASON_STATUS, <any>data), { credentials: 'include' });
    const json = await response.json();
    return <ISeasonStatusResponse>jsonCheck(json).result;
}