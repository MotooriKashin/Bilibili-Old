import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

interface IPgcSlideShow {
    blink: string;
    gif: string;
    id: number;
    img: string;
    link: string;
    pub_time: string;
    simg: string;
    title: string;
}
export async function apiPgcSlideShow(position_id: number) {
    const response = await fetch(objUrl(URLS.SLIDE_SHOW, { position_id }));
    const json = await response.json();
    return <IPgcSlideShow[]>jsonCheck(json).result;
}