import { ApiSign } from "./api";
import { IPlayurlDurl } from "./api-playurl";
import { fnval, fnver } from "./fnval";
import { URLS } from "./urls";

interface IApiPlayurlInterface {
    otype?: string;
    quality?: number;
    type?: string;
    cid: number;
}
export class ApiPlayurlInterface extends ApiSign {
    protected fetch: Promise<Response>;
    constructor(data: IApiPlayurlInterface, pgc = false) {
        super(pgc ? URLS.PLAYURL_BANGUMI : URLS.PLAYURL_INTERFACE, 'YvirImLGlLANCLvM');
        data = Object.assign({
            otype: 'json',
            qn: data.quality,
            type: '',
            fnver,
            fnval
        }, data, pgc ? { module: "bangumi", season_type: 1 } : {});
        this.fetch = fetch(this.sign(<any>data), { credentials: 'include' });
    }
    async getData() {
        const response = await this.fetch;
        return <IPlayurlDurl>await response.json();
    }
}