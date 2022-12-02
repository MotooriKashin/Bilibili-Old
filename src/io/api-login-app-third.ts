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
        super(URLS.LOGIN_APP_THIRD, '27eb53fc9058f8c3');
        this.fetch = fetch(this.sign({ api }, api), { credentials: 'include' });
    }
    getData() {
        return new Promise((resolve: (value: ILoginAppThirdResponse) => void, reject) => {
            this.fetch
                .then(d => d.json())
                .then(d => resolve(jsonCheck(d).data))
                .catch(e => reject(e));
        });
    }
}