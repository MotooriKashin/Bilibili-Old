import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'};
import iconfont from './iconfont.css' with {type: 'css'};
import REPLY from './reply.html' with {type: 'text'};
import SUBREPLY from './subreply.html' with {type: 'text'};
import { https } from '../../../utils/url';
import { Medal } from '../dialog';
import { cursor } from '../../../io/api.bilibili.com/x/v2/reply/dialog/cursor';
import { reply as subReply, type ISubReplies } from '../../../io/api.bilibili.com/x/v2/reply/reply';
import { epochFormat } from '../../../utils/time';
import { hex8 } from '../../../utils/color';
import { LEVEL } from './level';
import { bv2avAll } from '../../../utils/abv';
import { error } from '../../../utils/debug';
import { reply, type IReplies, type IReply as IReplyT } from '../../../io/api.bilibili.com/x/v2/reply';
import { web, type IWeb } from '../../../io/api.bilibili.com/x/emote/user/panel/web';
import { add } from '../../../io/api.bilibili.com/x/v2/reply/add';
import { action } from '../../../io/api.bilibili.com/x/v2/reply/action';
import { hate } from '../../../io/api.bilibili.com/x/v2/reply/hate';
import { modify, RELATION_MODIFY } from '../../../io/api.bilibili.com/x/relation/modify';
import { report } from '../../../io/api.bilibili.com/x/v2/reply/report';
import { del } from '../../../io/api.bilibili.com/x/v2/reply/del';
import { main, type IReply as IReplyM } from '../../../io/api.bilibili.com/x/v2/reply/main';

export class Comment extends HTMLElement {
    static get is() {
        return 'bili-comment';
    }
    static {
        document.adoptedStyleSheets.push(iconfont);
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    #implement = new AbortController();
    #abortController = new AbortController();
    #ipt: IPT;
    #paging: HTMLFormElement;
    #dialog: HTMLDivElement;
    #image: HTMLDivElement;
    #upper = 0n;
    #emoji: HTMLDivElement;
    #operaList: HTMLDivElement;
    #report: HTMLFormElement;
    #currentReply?: HTMLDivElement;
    #commentList: HTMLDivElement;
    #commentSend: HTMLDivElement;
    #ntersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const { root, dialog, min } = this.#dialog.dataset;
                if (root && dialog) {
                    this.cursor(root, dialog, min).catch(error);
                }
            }
        });
    });
    #oid = 0n;
    get oid() {
        return this.#oid;
    }
    #pn = 1;
    get pn() {
        return this.#pn;
    }
    set pn(v) {
        this.dataset['pn'] = this.#pn = <any>v;
        this.#paging.reset();
    }
    set oid(v) {
        if (v === this.#oid) return;
        this.identify();

        this.#oid = v;
        this.dispatchEvent(this.seek_rpid ? new CustomEvent('--main', { detail: this.seek_rpid }) : new Event('--init'));
        this.seek_rpid = '';
    }
    #sort = 2;
    get sort() {
        return this.#sort;
    }
    set sort(v) {
        this.pn = 1;
        this.dataset['sort'] = this.#sort = <any>v;
    }
    type = 1;
    set count(v: number | void) {
        const count = this.#shadowRoot.querySelector('header');
        if (!count) return;

        if (v != undefined) {
            this.dispatchEvent(new CustomEvent('count', { detail: count.dataset['value'] = <any>v }));
            return;
        }

        delete count.dataset['value'];
    }
    #size = 0;
    set size(v: number | void) {
        if (v) {
            (<HTMLInputElement>this.#paging['pn']).max = this.dataset['pages'] = this.#size = <any>v;
        } else {
            this.#size = 0;
            delete this.dataset['pages'];
            (<HTMLInputElement>this.#paging['pn']).max = '';
        }
    }
    set root_input_text(v: string) {
        const textarea: HTMLTextAreaElement = this.#ipt['message'];
        if (!textarea) return;

        textarea.placeholder = v;
    }
    set replies(v: IReplies[] | void) {

        if (v) {
            this.#commentList.replaceChildren(this.setMainReply(v));
            return;
        }

        this.#commentList.replaceChildren();
    }
    set top_replies(v: IReplies[]) {
        if (this.#pn > 1) return;

        v.forEach(({ rpid_str }) => {
            this.#commentList.querySelector(`[data-rpid="${rpid_str}"`)?.remove();
        });
        this.#commentList.prepend(this.setMainReply(v, true));
    }
    #mid = 0n;
    seek_rpid: string | number = '';
    constructor() {
        super();
        this.#shadowRoot.innerHTML = html;
        this.#shadowRoot.adoptedStyleSheets.push(style);

        this.#ipt = this.#shadowRoot.querySelector('#ipt')!;
        this.#paging = this.#shadowRoot.querySelector('#paging')!;
        this.#dialog = this.#shadowRoot.querySelector('#dialog')!;
        this.#image = this.#shadowRoot.querySelector('#image')!;
        this.#emoji = this.#shadowRoot.querySelector('#emoji')!;
        this.#operaList = this.#shadowRoot.querySelector('#opera-list')!;
        this.#report = this.#shadowRoot.querySelector('#comment-report')!;
        this.#commentList = this.#shadowRoot.querySelector('.comment-list')!;
        this.#commentSend = this.#shadowRoot.querySelector('#comment-send')!;

        this.nav().catch(error);
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        this.#emoji.when('toggle').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IWeb>(subscriber => {
                const abortController = new AbortController();
                web().then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort()
            })
        }).take(1).subscribe(({ packages }) => {
            const div = document.createElement('div');
            div.innerHTML = `<div><button command="--emoji" commandfor="ipt"><img fetchpriority="low" loading="lazy"></button></div>`
            const d0 = <HTMLElement>div.children[0];
            div.replaceChildren(...packages.map(({ text, url, type, meta: { size }, emote }) => {
                const div = <HTMLDivElement>d0.cloneNode(true);
                type === 4 && div.classList.add('type');
                div.dataset['label'] = text;
                size > 1 && (div.dataset['size'] = '5');
                div.style.setProperty('--background-image', `url(${https(url, true)})`);
                const d1 = <HTMLButtonElement>div.children[0];
                div.replaceChildren(...emote.map(({ text, url }) => {
                    const d = <HTMLButtonElement>d1.cloneNode(true);
                    const img = <HTMLImageElement>d.children[0];
                    d.dataset['value'] = text;
                    if (type === 4) {
                        d.textContent = text;
                    } else {
                        img.src = https(url);
                        img.title = img.alt = text;
                    }
                    return d;
                }))
                return div;
            }));
            this.#emoji.replaceChildren(div);
        }, { signal: this.#implement.signal });

        this.#ipt.when('command').subscribe(async ({ command, source }) => {
            switch (command) {
                case '--sort': {
                    const { sort } = (<HTMLElement>source)?.dataset;
                    if (sort) {
                        const d = Number(sort);
                        if (d >= 0) {
                            this.sort = d;
                            this.dispatchEvent(new Event('--init'));
                        }
                    }
                    break;
                }
                case '--pn': {
                    const { pn } = (<HTMLElement>source)?.dataset;
                    if (pn) {
                        switch (pn) {
                            case '--': case '-1': {
                                this.pn--;
                                break;
                            }
                            case '1': {
                                this.pn = 1;
                                break;
                            }
                            case '-2': {
                                this.pn -= 2;
                                break;
                            }
                            case '+2': {
                                this.pn += 2;
                                break;
                            }
                            case '+n': {
                                this.pn = this.#size;
                                break;
                            }
                            case '++': case '+1': {
                                this.pn++;
                                break;
                            }
                        }

                        this.dispatchEvent(new Event('--init'));
                    }
                    break;
                }
                case '--sub': {
                    const reply = source?.closest<HTMLDivElement>('div[data-rpid]');
                    if (reply) {
                        const { rpid } = reply.dataset;
                        let pn = Number(reply.dataset['pn'] || '1');
                        switch ((<HTMLElement>source)?.dataset['pn']) {
                            case '--': case '-1': {
                                pn--;
                                break;
                            }
                            case '1': {
                                pn = 1;
                                break;
                            }
                            case '-2': {
                                pn -= 2;
                                break;
                            }
                            case '+2': {
                                pn += 2;
                                break;
                            }
                            case '+n': {
                                const { pages } = reply.dataset;
                                if (pages) {
                                    pn = Number(pages);
                                }
                                break;
                            }
                            case '++': case '+1': {
                                pn++;
                                break;
                            }
                        }
                        if (rpid) {
                            this.subReply(rpid, pn, reply, (<HTMLElement>source)).catch(error);
                        }
                    }
                    break;
                }
                case '--emoji': {
                    const { value } = (<HTMLElement>source).dataset;
                    if (value) {
                        this.#ipt.message.focus();
                        this.#ipt.message.setRangeText(value, this.#ipt.message.selectionStart, this.#ipt.message.selectionEnd, 'end');
                    }
                    break;
                }
                case '--block': {
                    const mid = this.#currentReply?.dataset['mid'];
                    if (mid) {
                        new Medal(this.#upper === BigInt(mid) ? '拉黑后，将取消我对他的关注<br>禁止该用户与我进行互动。本条评论也会被删除。' : '拉黑该用户之后，将自动解除关注关系，并禁止他关注我，以及与我互动。', '加入黑名单', { label: '确认拉黑', callback: () => { mid && this.#operaList.dispatchEvent(new CustomEvent('--block', { detail: this.#currentReply })) } }, { label: '取消' });
                    }
                    break;
                }
                case '--action': case '--hate': {
                    this.#ipt.dispatchEvent(new CustomEvent(command, { detail: source }));
                    break;
                }
                case '--del': {
                    if (this.#currentReply) new Medal('删除评论后将不可恢复', '删除评论', { label: '是否继续？', callback: () => { this.#operaList.dispatchEvent(new CustomEvent('--del', { detail: this.#currentReply })) } }, { label: '取消' });
                    break;
                }
            }
        }, { signal: this.#implement.signal });
        this.#ipt.when('submit').subscribe(e => {
            e.preventDefault();
            const fd = new FormData(this.#ipt);
            let message = fd.get('message');
            if (typeof message === 'string' && message) {
                message = message.trim();
                if (this.#currentReply && this.#commentSend.matches(':popover-open')) {
                    const { rpid, root, uname } = this.#currentReply.dataset;
                    (root || rpid) && fd.set('root', <any>root || rpid);
                    rpid && fd.set('parent', rpid);
                    fd.set('message', uname ? `回复 @${uname} :${message}` : message);
                }
                this.#ipt.dispatchEvent(new CustomEvent('--submit', { detail: fd }))
            }
        }, { signal: this.#implement.signal });
        this.#ipt.when('--submit').switchMap<CustomEvent<FormData>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<FormData>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);

            });
        }).switchMap(({ detail }) => {
            return new Observable<{ reply: IReplies, root?: string }>(subscriber => {
                const abortController = new AbortController();
                const { message, root, parent } = <Record<string, string>>Object.fromEntries(detail.entries());
                if (message) {
                    add(this.#oid, message, this.type, root, parent, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                        if (code) throw new Error(`${code} ${message}`);
                        subscriber.next({ reply: data.reply, root });
                        subscriber.complete();
                    }).catch(e => {
                        subscriber.complete();
                        if (Error.isError(e)) {
                            new Medal(e.message, e.name);
                        }
                    });
                }
                return () => abortController.abort();
            })
        }).subscribe(({ reply, root }) => {
            if (root) {
                this.#commentSend.popover = null;
                const p = this.#commentList.querySelector<HTMLDivElement>(`[data-rpid="${root}"] .reply-box`);
                if (p) {
                    p.prepend(this.setSubReply([reply]));
                }
            } else {
                this.#commentList.prepend(this.setMainReply([reply]));
            }
            this.#ipt.reset();
        }, { signal: this.#implement.signal });
        this.#ipt.when('--action').switchMap<CustomEvent<HTMLDivElement>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HTMLDivElement>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<HTMLDivElement>(subscriber => {
                const abortController = new AbortController();

                const rpid = detail.closest<HTMLDivElement>('[data-rpid]')?.dataset['rpid'];
                const d = detail.classList.contains('d');
                if (rpid) action(this.#oid, rpid, d ? 0 : 1, this.type, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            })
        }).subscribe(e => {
            if (e.classList.toggle('d')) {
                e.textContent = <any>(Number(e.textContent) + 1);
            } else {
                e.textContent = <any>(Number(e.textContent) - 1);
            }
        }, { signal: this.#implement.signal });
        this.#ipt.when('--hate').switchMap<CustomEvent<HTMLDivElement>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HTMLDivElement>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<HTMLDivElement>(subscriber => {
                const abortController = new AbortController();

                const rpid = detail.closest<HTMLDivElement>('[data-rpid]')?.dataset['rpid'];
                const d = detail.classList.contains('d');
                if (rpid) hate(this.#oid, rpid, d ? 0 : 1, this.type, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            })
        }).subscribe(e => {
            if (e.classList.toggle('d')) {
                e.textContent = <any>(Number(e.textContent) + 1);
            } else {
                e.textContent = <any>(Number(e.textContent) - 1);
            }
        }, { signal: this.#implement.signal });

        this.#paging.when('submit').subscribe(e => {
            e.preventDefault();
        }, { signal: this.#implement.signal });
        this.#paging.when('change').subscribe(() => {
            const { valueAsNumber } = (<HTMLInputElement>this.#paging['pn']);
            if (this.#paging.reportValidity()) {
                this.pn = valueAsNumber;
                this.dispatchEvent(new Event('--init'));
            }
        }, { signal: this.#implement.signal });
        this.#image.when('toggle').subscribe(({ source }) => {
            if (source) {
                this.#image.innerHTML = source.innerHTML.replace(/width="\d+"/, '');
            } else {
                this.#image.replaceChildren();
            }
        }, { signal: this.#implement.signal });
        this.#dialog.when('toggle').subscribe(async ({ source }) => {
            const target = source?.closest<HTMLElement>('[data-rpid]');
            if (target) {
                const { root, dialog, rpid } = target.dataset;
                if (root && dialog) {
                    this.#dialog.dataset['root'] = root;
                    this.#dialog.dataset['rpid'] = rpid;
                    this.#dialog.dataset['dialog'] = dialog;

                }
            } else {
                this.#dialog.firstElementChild?.replaceChildren();
                delete this.#dialog.dataset['root'];
                delete this.#dialog.dataset['rpid'];
                delete this.#dialog.dataset['dialog'];
                delete this.#dialog.dataset['min'];
                this.#dialog.lastElementChild?.classList.remove('d');
            }
        }, { signal: this.#implement.signal });

        this.#operaList.when('toggle').subscribe(({ source }) => {
            if (this.#operaList.matches(':popover-open')) {
                this.#currentReply = source?.closest('[data-rpid]') ?? undefined;
                const mid = this.#currentReply?.dataset['mid'];
                this.#operaList.classList.toggle('d', mid === this.#mid.toString() || this.#upper === this.#mid);
            }
        }, { signal: this.#implement.signal });
        this.#operaList.when('--block').switchMap<CustomEvent<HTMLElement>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HTMLElement>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<HTMLElement>(subscriber => {
                const abortController = new AbortController();
                const { mid } = detail.dataset;
                mid && modify(mid, RELATION_MODIFY.BLOCK, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            new Medal('加入黑名单成功');
            e.remove();
        }, { signal: this.#implement.signal });
        this.#operaList.when('--del').switchMap<CustomEvent<HTMLElement>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HTMLElement>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<HTMLElement>(subscriber => {
                const abortController = new AbortController();
                const { rpid } = detail.dataset;
                rpid && del(this.#oid, rpid, this.type, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            new Medal('删除成功');
            e.remove();
        }, { signal: this.#implement.signal });

        this.#report.when('submit').subscribe(e => {
            e.preventDefault();
            const rpid = this.#currentReply?.dataset['rpid'];
            if (rpid) {
                const detail = new FormData(this.#report);
                const reason = detail.get('reason');
                if (!reason) { new Medal('请选择举报理由'); return; }
                if (reason === '0' && detail.get('content')) { new Medal('请完善举报理由'); return; }
                detail.set('rpid', rpid);

                this.#report.dispatchEvent(new CustomEvent('--report', { detail: detail }));
            }
        }, { signal: this.#implement.signal });
        this.#report.when('--report').switchMap<CustomEvent<FormData>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<FormData>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);

            });
        }).switchMap(({ detail }) => {
            return new Observable(subscriber => {
                const abortController = new AbortController();
                const { rpid, reason, content } = Object.fromEntries(detail.entries());
                report(this.#oid, <string>rpid, <any>reason, <string>content, this.type, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(true);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(() => {
            new Medal('举报已受理');
        }, { signal: this.#implement.signal });

        this.#commentSend.when('command').subscribe(({ command, source }) => {
            if (source instanceof HTMLButtonElement) {
                switch (command) {
                    case 'show-popover': {
                        this.#commentSend.popover = 'auto';
                        this.#commentSend.showPopover({ source });
                        this.#currentReply = source.closest('[data-rpid]') ?? undefined;
                        const uname = this.#currentReply?.dataset['uname'];
                        if (uname) this.#ipt.message.placeholder = `回复 @${uname} :`;
                        break;
                    }
                }
            }
        }, { signal: this.#implement.signal });
        this.#commentSend.when('toggle').subscribe(() => {
            if (!this.#commentSend.matches(':popover-open')) {
                this.#commentSend.popover = null;
                this.#currentReply = undefined;
            }
        }, { signal: this.#implement.signal });

        this.when('--init').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IReplyT>(subscriber => {
                const abortController = new AbortController();
                reply(this.#oid, this.#pn, this.#sort, this.type, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ page: { count, size }, control: { root_input_text }, upper: { mid }, replies, top_replies }) => {
            this.count = count;
            this.size = Math.ceil(count / size);
            this.root_input_text = root_input_text;
            this.#upper = BigInt(mid);
            this.replies = replies;
            top_replies && (this.top_replies = top_replies);
        }, { signal: this.#implement.signal });
        this.when('--main').switchMap(e => {
            return new Observable<CustomEvent<string>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<string>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<IReplyM>(subscriber => {
                const abortController = new AbortController();
                main(this.#oid, undefined, this.type, detail, { signal: AbortSignal.any([this.#abortController.signal, abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                    const div = this.#commentList.querySelector<HTMLElement>(`[data-rpid="${detail}"]`);
                    if (div) {
                        div.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    } else { this.#commentList.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ control: { root_input_text }, upper: { mid }, replies, top_replies }) => {
            this.root_input_text = root_input_text;
            this.#upper = BigInt(mid);
            this.replies = replies;
            top_replies && (this.top_replies = top_replies);
        }, { signal: this.#implement.signal });

        this.#ntersectionObserver.observe(this.#dialog.lastElementChild!);
    }
    disconnectedCallback() {
        this.#implement.abort();
        this.#ntersectionObserver.unobserve(this.#dialog.lastElementChild!);
    }
    identify() {
        this.#abortController.abort();
        this.#abortController = new AbortController();
        this.#pn = 1;
        this.sort = 2;

        this.#currentReply = this.size = this.replies = this.count = undefined;
        this.#upper = 0n;
        delete this.dataset['rpid'];
    }
    private setMainReply(replies: IReplies[], top = false) {
        const [df, div] = [document.createDocumentFragment(), document.createElement('div')];
        div.innerHTML = REPLY;
        replies.forEach(({ member: { mid, avatar, vip: { nickname_color }, uname, is_senior_member, level_info: { current_level }, nameplate: { image }, user_sailing, fans_detail, pendant: { image_enhance }, official_verify: { type } }, content: { message, at_name_to_mid_str, emote, pictures }, floor, reply_control: { location }, ctime, like, up_action, rcount, replies, rpid_str, action }) => {
            const d = <HTMLDivElement>div.cloneNode(true);
            d.dataset['rpid'] = rpid_str;
            d.dataset['mid'] = mid;
            const [
                left,
                ava,
                pendant,
                verify,
                usera,
                level,
                up,
                nameplate,
                fans,
                sailing,
                pre,
                picture,
                fl,
                epoch,
                lo,
                li,
                hate,
                uli,
                ure,
                rb,
                vm,
            ] = [
                    <HTMLAnchorElement>d.children[0],
                    <HTMLImageElement>d.children[0]!.children[0],
                    <HTMLImageElement>d.children[0]!.children[1],
                    <HTMLImageElement>d.children[0]!.children[2],
                    <HTMLAnchorElement>d.children[1]!.children[0]!.children[0],
                    <HTMLImageElement>d.children[1]!.children[0]!.children[1],
                    <HTMLSpanElement>d.children[1]!.children[0]!.children[2],
                    <HTMLImageElement>d.children[1]!.children[0]!.children[3],
                    <HTMLSpanElement>d.children[1]!.children[0]!.children[4],
                    <HTMLDivElement>d.children[1]!.children[0]!.children[5],
                    <HTMLPreElement>d.children[1]!.children[1],
                    <HTMLDivElement>d.children[1]!.children[2],
                    <HTMLSpanElement>d.children[1]!.children[3]!.children[0],
                    <HTMLSpanElement>d.children[1]!.children[3]!.children[1],
                    <HTMLSpanElement>d.children[1]!.children[3]!.children[2],
                    <HTMLButtonElement>d.children[1]!.children[3]!.children[3],
                    <HTMLButtonElement>d.children[1]!.children[3]!.children[4],
                    <HTMLSpanElement>d.children[1]!.children[3]!.children[5],
                    <HTMLSpanElement>d.children[1]!.children[3]!.children[6],
                    <HTMLSpanElement>d.children[1]!.children[4],
                    <HTMLSpanElement>d.children[1]!.children[5],
                ];
            usera.href = left.href = `//space.bilibili.com/${mid}`;
            ava.src = https(avatar);
            if (image_enhance) {
                pendant.src = https(image_enhance);
            } else {
                pendant.remove();
            }
            if (type >= 0) {
                verify.src = `//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${type === 1 ? 'business' : 'personal'}.svg`;
            } else {
                verify.remove();
            }
            usera.text = uname;
            nickname_color && (usera.style.color = nickname_color);
            level.src = `//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level${LEVEL[is_senior_member ? 7 : current_level]}.svg`;
            if (BigInt(mid) !== this.#upper) { up.remove() }
            if (image) {
                nameplate.src = https(image);
            } else {
                nameplate.remove();
            }
            if (fans_detail) {
                fans.style.backgroundImage = `linear-gradient(90deg,${hex8(fans_detail.medal_color)},${hex8(fans_detail.medal_color_end)})`;
                fans.style.borderColor = hex8(fans_detail.medal_color_border);
                (<HTMLSpanElement>fans.children[0]).textContent = fans_detail.medal_name;
                (<HTMLSpanElement>fans.children[1]).textContent = <any>fans_detail.level;
                (<HTMLSpanElement>fans.children[1]).style.color = hex8(fans_detail.medal_color_level);
                (<HTMLSpanElement>fans.children[1]).style.backgroundColor = hex8(fans_detail.medal_level_bg_color);
            } else {
                fans.remove();
            }
            if (user_sailing?.cardbg) {
                (<HTMLImageElement>sailing.children[0]).src = https(user_sailing.cardbg.image);
                (<HTMLDivElement>sailing.children[1]).append(user_sailing.cardbg.fan.num_prefix, document.createElement('br'), user_sailing.cardbg.fan.num_desc);
                if (user_sailing.cardbg.fan.color_format) {
                    (<HTMLDivElement>sailing.children[1]).style.backgroundImage = `linear-gradient(90deg, ${user_sailing.cardbg.fan.color_format.colors[0]} ${user_sailing.cardbg.fan.color_format.gradients[1]}%, ${user_sailing.cardbg.fan.color_format.colors[1]} ${user_sailing.cardbg.fan.color_format.gradients[1]}%)`;
                }
            } else {
                sailing.remove();
            }
            top && (pre.dataset['label'] = '置顶');
            pre.append(string2SuperLink(message, at_name_to_mid_str, emote));
            if (pictures) {
                const button = (<HTMLButtonElement>picture.children[0]);
                picture.replaceChildren(...pictures.map(({ img_src, img_width, img_height }) => {
                    const b = <HTMLButtonElement>button.cloneNode(true);
                    (<HTMLImageElement>b.children[0]).src = https(img_src);
                    (<HTMLImageElement>b.children[0]).width = img_width > img_height ? 200 : 135;
                    return b;
                }));
            } else {
                picture.remove();
            }
            if (floor) {
                fl.textContent = `#${floor}`;
            } else {
                fl.remove();
            }
            epoch.textContent = epochFormat(ctime * 1e3);
            if (location) {
                lo.textContent = location;
            } else {
                lo.remove();
            }
            action === 1 && li.classList.add('d');
            li.textContent = <any>like;
            action === 2 && hate.classList.add('d');
            up_action.like || uli.remove();
            up_action.reply || ure.remove();
            replies?.length && rb.append(this.setSubReply(replies));
            if (rcount > (replies?.length || 0)) {
                (<HTMLElement>vm.children[0]).textContent = <any>rcount;
            } else {
                vm.remove();
            }

            df.append(d);
        });
        return df;
    }
    private setSubReply(replies: ISubReplies[]) {
        const [df, div] = [document.createDocumentFragment(), document.createElement('div')];
        div.innerHTML = SUBREPLY;
        replies.forEach(({ member: { mid, avatar, vip: { nickname_color }, uname, is_senior_member, level_info: { current_level }, nameplate: { image }, fans_detail, pendant: { image_enhance }, official_verify: { type } }, content: { message, at_name_to_mid_str, emote }, floor, reply_control: { location }, ctime, like, up_action, rpid_str, dialog_str, root_str, action }) => {
            const d = <HTMLDivElement>div.cloneNode(true);
            d.dataset['rpid'] = rpid_str;
            d.dataset['mid'] = mid;
            d.dataset['root'] = root_str;
            d.dataset['dialog'] = dialog_str;
            d.dataset['uname'] = uname;
            const [
                left,
                ava,
                pendant,
                verify,
                usera,
                level,
                up,
                nameplate,
                fans,
                pre,
                fl,
                epoch,
                lo,
                li,
                hate,
                uli,
                ure,
                dia,
            ] = [
                    <HTMLAnchorElement>d.children[0],
                    <HTMLImageElement>d.children[0]!.children[0],
                    <HTMLImageElement>d.children[0]!.children[1],
                    <HTMLImageElement>d.children[0]!.children[2],
                    <HTMLAnchorElement>d.children[1]!.children[0]!.children[0],
                    <HTMLImageElement>d.children[1]!.children[0]!.children[1],
                    <HTMLSpanElement>d.children[1]!.children[0]!.children[2],
                    <HTMLImageElement>d.children[1]!.children[0]!.children[3],
                    <HTMLSpanElement>d.children[1]!.children[0]!.children[4],
                    <HTMLPreElement>d.children[1]!.children[0]!.children[5],
                    <HTMLSpanElement>d.children[1]!.children[1]!.children[0],
                    <HTMLSpanElement>d.children[1]!.children[1]!.children[1],
                    <HTMLSpanElement>d.children[1]!.children[1]!.children[2],
                    <HTMLButtonElement>d.children[1]!.children[1]!.children[3],
                    <HTMLButtonElement>d.children[1]!.children[1]!.children[4],
                    <HTMLSpanElement>d.children[1]!.children[1]!.children[5],
                    <HTMLSpanElement>d.children[1]!.children[1]!.children[6],
                    <HTMLButtonElement>d.children[1]!.children[1]!.children[8],
                ];
            usera.href = left.href = `//space.bilibili.com/${mid}`;
            ava.src = https(avatar);
            if (image_enhance) {
                pendant.src = https(image_enhance);
            } else {
                pendant.remove();
            }
            if (type >= 0) {
                verify.src = `//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${type === 1 ? 'business' : 'personal'}.svg`;
            } else {
                verify.remove();
            }
            usera.text = uname;
            nickname_color && (usera.style.color = nickname_color);
            level.src = `//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level${LEVEL[is_senior_member ? 7 : current_level]}.svg`;
            if (BigInt(mid) !== this.#upper) { up.remove() }
            if (image) {
                nameplate.src = https(image);
            } else {
                nameplate.remove();
            }
            if (fans_detail) {
                fans.style.backgroundImage = `linear-gradient(90deg,${hex8(fans_detail.medal_color)},${hex8(fans_detail.medal_color_end)})`;
                fans.style.borderColor = hex8(fans_detail.medal_color_border);
                (<HTMLSpanElement>fans.children[0]).textContent = fans_detail.medal_name;
                (<HTMLSpanElement>fans.children[1]).textContent = <any>fans_detail.level;
                (<HTMLSpanElement>fans.children[1]).style.color = hex8(fans_detail.medal_color_level);
                (<HTMLSpanElement>fans.children[1]).style.backgroundColor = hex8(fans_detail.medal_level_bg_color);
            } else {
                fans.remove();
            }
            pre.append(string2SuperLink(message, at_name_to_mid_str, emote));
            if (floor) {
                fl.textContent = `#${floor}`;
            } else {
                fl.remove();
            }
            epoch.textContent = epochFormat(ctime * 1e3);
            if (location) {
                lo.textContent = location;
            } else {
                lo.remove();
            }
            action === 1 && li.classList.add('d');
            li.textContent = <any>like;
            action === 2 && hate.classList.add('d');
            up_action.like || uli.remove();
            up_action.reply || ure.remove();
            (dialog_str === rpid_str) && dia.remove();

            df.append(d);
        });
        return df;
    }
    private async subReply(rpid: string, pn: number, reply: HTMLDivElement, source?: HTMLElement) {
        this.#abortController.abort();
        this.#abortController = new AbortController();
        const { code, message, data } = await subReply(rpid, this.#oid, pn, this.type, { signal: this.#abortController.signal });
        if (code) {
            new Medal(message, code);
            return;
        }
        const vm = source?.closest<HTMLDivElement>('.view-more');
        if (vm) {
            vm.insertAdjacentHTML('afterend', `<div class="paging-box">
    <button data-pn="--" command="--sub" commandfor="ipt">上一页</button>
    <button data-pn="1" command="--sub" commandfor="ipt">1</button>
    <span>...</span>
    <button data-pn="-2" command="--sub" commandfor="ipt"></button>
    <button data-pn="-1" command="--sub" commandfor="ipt"></button>
    <span data-pn="0" command="--sub" commandfor="ipt"></span>
    <button data-pn="+1" command="--sub" commandfor="ipt"></button>
    <button data-pn="+2" command="--sub" commandfor="ipt"></button>
    <span>...</span>
    <button data-pn="+n" command="--sub" commandfor="ipt"></button>
    <button data-pn="++" command="--sub" commandfor="ipt">下一页</button>
</div>`);
            vm.remove();
        }

        const { page: { count, size }, replies } = data;
        reply.dataset['pages'] = <any>Math.ceil(count / size);
        reply.dataset['pn'] = <any>pn;

        const list = reply.querySelector('.reply-box');
        if (list) {
            if (replies?.length) {
                list.replaceChildren(this.setSubReply(replies));
            } else {
                list.replaceChildren();
            }
        }
    }
    private async cursor(root: string, dialog: string, min?: string) {
        this.#abortController.abort();
        this.#abortController = new AbortController();
        this.#ntersectionObserver.unobserve(this.#dialog.lastElementChild!);
        const { code, message, data } = await cursor(root, dialog, this.#oid, min ? Number(min) : 0, this.type, { signal: this.#abortController.signal });
        if (code) {
            new Medal(message, code);
            return;
        }
        const { replies, cursor: { next, is_end } } = data;
        replies && this.#dialog.firstElementChild?.append(this.setMainReply(replies));
        this.#dialog.dataset['min'] = <any>next;
        is_end && this.#dialog.lastElementChild?.classList.add('d');
        this.#ntersectionObserver.observe(this.#dialog.lastElementChild!);
    }
    private async nav() {
        const iFace = this.#shadowRoot.querySelector<HTMLDivElement>('.user-face');
        if (!iFace) return;
        const { data: { isLogin, face, mid } } = await import('../../../io/api.bilibili.com/x/web-interface/nav');
        if (!isLogin) return;
        const img = document.createElement('img');
        img.fetchPriority = 'low';
        img.loading = 'lazy';
        img.src = https(face);
        iFace.replaceChildren(img);
        this.#mid = BigInt(mid);
    }
}
customElements.define(Comment.is, Comment);

interface IPT extends HTMLFormElement {
    message: HTMLTextAreaElement;
}

/**
 * 将字符串中的url转为超链接
 * 
 * @param text 原始字符串
 * @returns 转换结果
 */
export function string2SuperLink(
    text: string,
    at_name_to_mid_str: Record<string, string> = {},
    emote: Record<string, { url: string; meta: { size: number } }> = {},
) {
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;
    // 1. 提取并按长度降序排序自定义 Key（优先匹配长词，防止“张三丰”被拆为“张三”+“丰”）
    const customKeys = Object.keys(Object.assign({}, at_name_to_mid_str, emote))
        .filter((key) => key.length > 0)
        .sort((a, b) => b.length - a.length);

    // 2. 对自定义 Key 进行正则表达式转义，防止特殊字符（如 $、*、? 等）破坏正则
    const escapedKeys = customKeys.map(RegExp.escape);
    // 3. 通用 URL 正则表达式（支持 http、https 以及协议相对路径 //）
    const urlPattern = `((?:https?|ftp|file):\\/\\/[-a-z0-9+&@#/%?=~_|!:,.;]+[-a-z0-9+&@#\\/%=~_|])|(av\\d+)|(cv\\d+)|(sm\\d+)|(ss\\d+)|(ep\\d+)`;

    // 4. 组合正则表达式：优先匹配自定义关键词，再匹配通用 URL
    const patterns = [...escapedKeys, urlPattern];
    const COMBINED_REGEX = new RegExp(patterns.join('|'), 'gi');
    text = bv2avAll(text);
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    // 重置正则匹配索引
    COMBINED_REGEX.lastIndex = 0;
    const a = document.createElement('a')
    a.target = '_blank';
    const img = document.createElement('img');
    img.fetchPriority = 'low';
    img.loading = 'lazy';
    while ((match = COMBINED_REGEX.exec(text)) !== null) {
        const matchStr = match[0];
        const matchIndex = match.index;
        // 1. 追加匹配项之前的普通纯文本（安全转义）
        if (matchIndex > lastIndex) {
            fragment.append(document.createTextNode(text.slice(lastIndex, matchIndex)));
        }

        if (Object.hasOwn(at_name_to_mid_str, matchStr)) {
            a.href = `//space.bilibili.com/${at_name_to_mid_str[matchStr]}`;
            a.text = matchStr;
            fragment.append(a.cloneNode(true));
        } else if (Object.hasOwn(emote, matchStr)) {
            const { url, meta: { size } } = emote[matchStr]!;
            img.src = https(url);
            img.dataset['size'] = <any>size;
            fragment.append(img.cloneNode(true));
        } else {
            switch (true) {
                case matchStr.toLowerCase().startsWith('av'): {
                    a.href = `//www.bilibili.com/video/${matchStr}`;
                    break;
                }
                case matchStr.toLowerCase().startsWith('cv'): {
                    a.href = `//www.bilibili.com/read/${matchStr}`;
                    break;
                }
                case matchStr.toLowerCase().startsWith('sm'): {
                    a.href = `//www.nicovideo.jp/watch/${matchStr}`;
                    break;
                }
                case matchStr.toLowerCase().startsWith('ss'): case matchStr.toLowerCase().startsWith('ep'): {
                    a.href = `//www.bilibili.com/bangumi/play/${matchStr}`;
                    break;
                }
                default: {
                    a.href = matchStr;
                    break;
                }
            }
            a.text = matchStr;
            fragment.append(a.cloneNode(true));
        }

        lastIndex = COMBINED_REGEX.lastIndex;
    }

    // 2. 补充剩余的普通文本
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    return fragment;
}