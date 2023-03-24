import { objUrl } from "../utils/format/url";
import { IUpper, jsonCheck } from "./api";
import { URLS } from "./urls";

/**
 * 获取评论
 * @param oid 评论所属页面id，对于视频页面，取aid
 * @param pn 页码
 * @param type 评论类型，视频页是1
 * @param sort 评论排序，0：时间，2：热度
 */
export async function apiReply(oid: number, pn = 1, type = 1, sort = 0) {
    const reply = await fetch(objUrl(URLS.REPLY, { pn, type, oid, sort }), { credentials: 'include' })
    const json = await reply.json();
    return <IReplyResonse>jsonCheck(json).data;
}

interface IReplyResonse {
    assist: number;
    blacklist: number;
    config: {
        read_only: boolean;
        show_up_flag: boolean;
        showtopic: number;
    };
    control: {
        answer_guide_android_url: string;
        answer_guide_icon_url: string;
        answer_guide_ios_url: string;
        answer_guide_text: string;
        bg_text: string;
        child_input_text: string;
        disable_jump_emote: boolean;
        empty_page: unknown;
        giveup_input_text: string;
        input_disable: boolean;
        root_input_text: string;
        screenshot_icon_state: number;
        show_text: string;
        show_type: number;
        upload_picture_icon_state: number;
        web_selection: boolean;
    };
    folder: { has_folded: boolean; is_folded: boolean; rule: string };
    mode: 3 | 2;
    page: { num: number; size: number; count: number; acount: number; };
    replies: IReply[]
    support_mode: number[];
    top: unknown;
    top_replies: IReply[];
    upper: {
        mid: number;
        top: IReply;
        vote: unknown;
    };
    vote: number;
}
interface IReply {
    action: number;
    assist: number;
    attr: number;
    content: {
        emote: Record<string, {
            attr: number;
            id: number;
            jump_title: string;
            meta: { size: number; };
            mtime: number;
            package_id: number;
            state: number;
            text: string;
            type: number;
            url: string;
        }>;
        jump_url: {};
        max_line: number;
        members: [];
        message: string;
    };
    count: number;
    ctime: number;
    dialog: number;
    dynamic_id_str: string;
    fansgrade: number;
    folder: { has_folded: boolean; is_folded: boolean; rule: string; }
    invisible: boolean;
    like: number;
    member: IUpper;
    mid: number;
    oid: number;
    parent: number;
    parent_str: string;
    rcount: number;
    replies?: IReply[];
    reply_control: { max_line: number; time_desc: string; };
    root: number;
    root_str: string;
    rpid: number;
    rpid_str: string;
    state: number;
    type: number;
    up_action: { like: boolean; reply: boolean };
}