import { ApiSign } from "./api";
import { IPlayurlDurl } from "./api-playurl";
import { qn } from "./fnval";
import { URLS } from "./urls";

interface IApiPlayurlProj {
    access_key?: string;
    build?: string;
    device?: string;
    expire?: string;
    mobi_app?: string;
    module?: string;
    otype?: string;
    platform?: string;
    qn?: number;
    cid: number;
}
export class ApiPlayurlProj extends ApiSign {
    private fetch: Promise<Response>;
    constructor(data: IApiPlayurlProj, pgc = false) {
        super(pgc ? URLS.PGC_PLAYURL_PROJ : URLS.PLAYURL_PROJ, 'bb3101000e232e27');
        data = Object.assign({
            build: "2040100",
            device: "android",
            mobi_app: "android_i",
            otype: "json",
            platform: "android_i",
            qn
        }, data);
        pgc && (data.module = "bangumi");
        this.fetch = fetch(this.sign(<any>data));
    }
    async getData() {
        const response = await this.fetch;
        return <IPlayurlDurl>await response.json();
    }
}