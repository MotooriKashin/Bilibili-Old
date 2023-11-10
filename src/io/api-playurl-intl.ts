import { jsonCheck } from "./api";
import { IPlayurlDash, IPlayurlDurl } from "./api-playurl";
import { ApiSign } from "./api-sign";
import { fnval, fnver, qn } from "./fnval";
import { URLS } from "./urls";

export class ApiPlayurlIntl extends ApiSign {
    constructor(protected data: IApiPlayurlIntl, dash = true, private pgc = false) {
        super(pgc ? URLS.INTL_OGV_PLAYURL : URLS.INTL_PLAYURL, 'bb3101000e232e27');
        this.data = Object.assign({
            device: "android",
            force_host: 1,
            mobi_app: "android_i",
            qn,
            platform: "android_i",
            fourk: 1,
            build: 2100110,
            otype: 'json'
        }, data, dash ? { fnval, fnver } : {});
    }
    async getData() {
        const response = await GM.fetch(this.sign().toJSON());
        const json = await response.json();
        if (this.pgc) {
            return <IPlayurlDash | IPlayurlDurl>jsonCheck(json);
        }
        return <IPlayurlDash | IPlayurlDurl>jsonCheck(json).data;
    }
}

interface IApiPlayurlIntl {
    access_key?: string;
    device?: string;
    dl?: number;
    force_host?: number;
    mobi_app?: string;
    qn?: number;
    platform?: string;
    build?: number;
    otype?: string;
    aid: number;
    cid: number;
}