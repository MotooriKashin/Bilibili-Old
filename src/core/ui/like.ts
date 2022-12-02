import { BLOD } from "../../bilibili-old";
import { apiLike } from "../../io/api-like";
import { apiLikeHas } from "../../io/api-like-has";
import { uid } from "../../utils/conf/uid";
import { getCookies } from "../../utils/cookie";
import { CustomElementsInterface } from "../../utils/customelement";
import { debug } from "../../utils/debug";
import { addCss } from "../../utils/element";
import { unitFormat } from "../../utils/format/unit";
import { svg } from "../../utils/svg";

export class Like extends HTMLSpanElement implements CustomElementsInterface {
    private liked = false;
    private number = 0;
    constructor(protected BLOD: BLOD) {
        super();
        this.classList.add('ulike');
        this.update();
        this.addEventListener('click', ev => {
            ev.stopPropagation();
            if (uid) {
                apiLike(this.BLOD.aid, getCookies().bili_jct, !this.liked)
                    .then(() => {
                        this.liked ? this.number-- : this.number++;
                        this.toggle();
                    })
                    .catch(e => {
                        this.BLOD.toast.error('点赞出错！', e)();
                    })
            } else {
                this.BLOD.biliQuickLogin();
            }
        });
    }
    /** 初始化节点 */
    init() {
        if (uid) {
            apiLikeHas(this.BLOD.aid)
                .then(d => {
                    this.liked = d === 1 ? true : false;
                    this.update();
                })
                .catch(e => {
                    debug.error('获取点赞情况失败', e)
                });
        }
        addCss('.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;transform: translateY(-1px);}', `ulike${_MUTEX_}`);
    }
    /** 更新点赞数 */
    get likes() {
        return this.number;
    }
    set likes(v) {
        this.number = v;
        this.update();
    }
    protected toggle() {
        this.liked = !this.liked;
        this.update();
    }
    protected update() {
        this.innerHTML = (this.liked ? svg.like : svg.dislike) + '点赞 ' + unitFormat(this.number);
    }
}
customElements.get(`like-${_MUTEX_}`) || customElements.define(`like-${_MUTEX_}`, Like, { extends: 'span' });