import { ApiSign, jsonCheck } from "./api";
import { IPlayurlDash, IPlayurlDurl } from "./api-playurl";
import { fnval, fnver, qn } from "./fnval";
import { URLS } from "./urls";

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
export class ApiPlayurlTv extends ApiSign {
    private fetch: Promise<Response>;
    constructor(data: IApiPlayurlTv, dash = true, pgc = false) {
        super(pgc ? URLS.PGC_PLAYURL_TV : URLS.UGC_PLAYURL_TV, '4409e2ce8ffd12b8');
        data = Object.assign({
            qn,
            fourk: 1,
            otype: 'json',
            platform: "android",
            mobi_app: "android_tv_yst",
            build: 102801
        }, data, dash ? { fnval, fnver } : {});
        this.fetch = fetch(this.sign(<any>data));
    }
    async getData() {
        const response = await this.fetch;
        const json = await response.json();
        return <IPlayurlDash | IPlayurlDurl>jsonCheck(json);
    }
}