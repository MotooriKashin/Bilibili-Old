import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

export interface ISubtitle {
    ai_status: number;
    ai_type: number;
    id: number;
    id_str: string;
    is_lock: boolean;
    lan: string;
    lan_doc: string;
    subtitle_url: string;
    type: number;
}
export class PlayerResponse {
    allow_bp = false;
    answer_status = 0;
    bgm_info: unknown;
    block_time = 0;
    fawkes = { config_version: 18964, ff_version: 21289 };
    guide_attention = [];
    ip_info = { city: '', country: '中国', ip: '', province: '', zone_id: 0, zone_ip: '' };
    is_owner = false;
    is_ugc_pay_preview = false;
    jump_card = [];
    last_play_cid = 0;
    last_play_time = 0;
    level_info = { current_level: 0, current_min: 0, current_exp: 0, next_exp: 0, level_up: 0 };
    login_mid = 0;
    login_mid_hash = '';
    max_limit = 1000;
    name = '';
    no_share = false;
    now_time = new Date().getTime() / 1e3;
    online_count = 1;
    online_switch = { enable_gray_dash_playback: "500", new_broadcast: "1", realtime_dm: "1", subtitle_submit_switch: "1" };
    operation_card = [];
    options = { is_360: false, without_vip: false };
    page_no = 1;
    pcdn_loader = {
        dash: {
            labels: { pcdn_video_type: "dash", pcdn_stage: "release", pcdn_group: "nil", pcdn_version: "nil", pcdn_vendor: "nil" }
        },
        flv: {
            labels: { pcdn_video_type: "flv", pcdn_stage: "release", pcdn_group: "nil", pcdn_version: "nil", pcdn_vendor: "nil" }
        }
    };
    permission = 0;
    preview_toast = '为创作付费，购买观看完整视频|购买观看';
    role = '';
    show_switch = { long_progress: false };
    subtitle = { allow_submit: false, lan: "", lan_doc: "", subtitles: <ISubtitle[]>[] };
    toast_block = false;
    view_points = [];
    vip = {
        avatar_subscript: 0,
        avatar_subscript_url: '',
        due_date: 0,
        label: {
            bg_color: "",
            bg_style: 0,
            border_color: "",
            img_label_uri_hans: "",
            img_label_uri_hans_static: "",
            img_label_uri_hant: "",
            img_label_uri_hant_static: "",
            label_theme: "",
            path: "",
            text: "",
            text_color: "",
            use_img_label: false
        },
        nickname_color: '',
        role: 0,
        status: 0,
        theme_type: 0,
        tv_vip_pay_type: 0,
        tv_vip_status: 0,
        type: 0,
        vip_pay_type: 0,
    };
    constructor(public aid: number, public cid: number, public has_next = false) { }
}
export function apiPlayer(aid: number, cid: number) {
    return new Promise((resolve: (value: PlayerResponse) => void, reject) => {
        fetch(objUrl(URLS.PLAYER, { aid, cid }))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data))
            .catch(e => reject(e));
    });
}