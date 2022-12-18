import { ApiSign, jsonCheck } from "./api";
import { URLS } from "./urls";

interface ILoginAppThirdResponse {
    api_host: string;
    confirm_uri: string;
    direct_login: boolean;
    has_login: number;
    user_info: { face: string; mid: number; uname: string; };
}
export class ApiLoginAppThird extends ApiSign {
    protected fetch: Promise<Response>;
    constructor(api: string) {
        api = encodeURIComponent(api);
        super(URLS.LOGIN_APP_THIRD, '1d8b6e7d45233436');
        this.fetch = fetch(this.sign({ api }, api), { credentials: 'include' });
    }
    async getData() {
        const response = await this.fetch;
        const json = await response.json();
        return <ILoginAppThirdResponse>jsonCheck(json).data;
    }
}