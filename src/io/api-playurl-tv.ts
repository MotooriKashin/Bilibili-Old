import { jsonCheck } from "./api";
import { IPlayurlDash, IPlayurlDurl } from "./api-playurl";
import { ApiSign } from "./api-sign";
import { fnval, fnver, qn } from "./fnval";
import { URLS } from "./urls";

export class ApiPlayurlTv extends ApiSign {
    constructor(protected data: IApiPlayurlTv, dash = true, pgc = false) {
        super(pgc ? URLS.PGC_PLAYURL_TV : URLS.UGC_PLAYURL_TV, '27eb53fc9058f8c3');
        this.data = Object.assign({
            qn,
            fourk: 1,
            otype: 'json',
            platform: "android",
            mobi_app: "android_tv_yst",
            build: 102801
        }, data, dash ? { fnval, fnver } : {});
    }
    async getData() {
        const response = await fetch(this.sign());
        const json = await response.json();
        return <IPlayurlDash | IPlayurlDurl>jsonCheck(json);
    }
}

interface IApiPlayurlTv {
    access_key?: string;
    qn?: number;
    otype?: string;
    platform?: string;
    mobi_app?: string;
    build?: number;
    avid: number;
    cid: number;
}