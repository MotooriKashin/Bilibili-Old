import style from './index.css' with {type: 'css'};
import '../../main/widget/slider';
import { DmSegMobileReply, type DanmakuElem } from '../../proto/DmSegMobileReply';
import { durationFormat, epochFormat } from '../../utils/time';
import { error, log } from '../../utils/debug';

document.adoptedStyleSheets.push(style);

const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
if (!tab) throw new Error('未能链接到内容脚本');
const { id } = tab;
if (!id) throw new Error('未能链接到内容脚本');
const port = browser.tabs.connect(id, { name: 'sidePanel' });
const [watching, danmakuList, danmakuNumber, danmakuPopover, download] = [<HTMLDivElement>document.querySelector('.watching'), <HTMLDivElement>document.querySelector('#danmaku>.wrap'), <HTMLDivElement>document.querySelector('.info>.danmaku'), <HTMLDivElement>document.querySelector('#context'), <HTMLDivElement>document.querySelector('#option>.download>div')];

let elems: DanmakuElem[] = [];
let playurl: { label: string; url: URL; }[] = [];
port.onMessage.addListener(({ type, payload }) => {
    switch (type) {
        case 'ONLINE_NUMBER': {
            if (payload == undefined) {
                delete watching.dataset["value"];
            } else {
                watching.dataset["value"] = payload;
            }
            break;
        }
        case 'DANMAKU_LIST': {
            elems = payload;
            danmakuNumber.dataset['value'] = <any>elems.length;
            const dp = document.createDocumentFragment();
            const div = document.createElement('div');
            div.innerHTML = `<span class="time">00:00</span><span class="content">弹幕姬求交往</span><span class="date">02-19 19:07</span>`;
            elems.forEach(({ progress, content, ctime, mode, id }) => {
                const d = (<HTMLDivElement>div.cloneNode(true));
                const [time, ct, date] = <[HTMLSpanElement, HTMLSpanElement, HTMLSpanElement]><unknown>d.children;
                time.textContent = durationFormat({ milliseconds: Math.floor(progress || 0) });
                ct.textContent = ct.title = content || '';
                date.title = epochFormat(Number(ctime) * 1e3);
                date.textContent = epochFormat(Number(ctime) * 1e3, { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
                d.classList.add(`mode-${mode}`);
                d.dataset['id'] = <any>id;
                dp.append(d);
            });
            danmakuList.replaceChildren(dp);
            break;
        }
        case 'BOFQI_PLAYURL': {
            playurl = payload;
            const dp = document.createDocumentFragment();
            const div = document.createElement('div');
            div.classList.add('c');
            div.innerHTML = `<button command="--download-media" commandfor="context">下载</button>`;
            playurl.forEach(({ label }, i) => {
                const d = <HTMLDivElement>div.cloneNode(true);
                const [button] = <[HTMLButtonElement]><unknown>d.children;
                d.prepend(document.createTextNode(label));
                button.dataset['i'] = <any>i;
                dp.append(d);
            });
            download.replaceChildren(dp);
            break;
        }
    }
});
port.onDisconnect.addListener(() => {
    // browser.sidePanel.close({ tabId: id });
    globalThis.close();
});

function toast(message: string, timeout?: number) {
    port.postMessage({ type: 'BOFQI_TOAST', payload: { message, timeout } });
}

// 弹幕列表右键
let target: HTMLElement | null;
danmakuList.when('contextmenu').subscribe(e => {
    e.preventDefault();

    if (target = (<HTMLElement>e.target).closest('[data-id]')) {
        const { offsetX, offsetY } = e;
        danmakuPopover.dataset['x'] = <any>offsetX;
        danmakuPopover.dataset['y'] = <any>offsetY;
        danmakuPopover.showPopover({ source: <HTMLElement>e.target });
    }
});
danmakuList.when('dblclick').subscribe(({ target }) => {
    const d = (<HTMLElement>target)?.closest<HTMLElement>('[data-id]');
    if (d) {
        const tid = BigInt(d.dataset['id'] || 0n);
        if (!tid) return;
        const dm = elems.find(({ id }) => id === tid);
        if (!dm) return;
        port.postMessage({ type: 'BOFQI_SEEK', payload: dm.progress || 0 });
    }
});
danmakuPopover.when('click').subscribe(() => { danmakuPopover.hidePopover() });
danmakuPopover.when('command').subscribe(async ({ command, source }) => {
    switch (command) {
        case '--copy': {
            if (target) {
                const tid = BigInt(target.dataset['id'] || 0n);
                if (!tid) return;
                const dm = elems.find(({ id }) => id === tid);
                if (!dm?.content) return;
                navigator.clipboard.writeText(dm.content).then(() => { toast('复制弹幕'); log(dm.content) }, error);
            }
            break;
        }
        case '--download-danmaku': {
            // 1. 获取文件句柄
            const fileHandle = await showSaveFilePicker({
                startIn: 'downloads',
                types: [
                    { description: '弹幕文件', accept: { 'application/protobuf': '.so' } },
                ],
                suggestedName: `${tab.title}.so`,
            }).catch(e => {
                toast('下载请求被驳回~');
                error(e);
            });
            if (!fileHandle) break;

            // 2. 创建写入流
            const writableStream = await fileHandle.createWritable().catch(e => {
                toast('文件系统错误：无法创建写入流，请检查权限~');
                error(e);
            });
            if (!writableStream) break;

            // 3. 写入文件
            const response = new Response(DmSegMobileReply.encode({ elems, colorfulSrc: [] }).finish());
            response.body?.pipeTo(writableStream).then(() => {
                toast(`成功保存弹幕：${fileHandle.name}`);
            }).catch(e => {
                toast('保存文件出错~');
                error(e);
            });
            break;
        }
        case '--video-file':
        case '--danmaku-file':
        case '--danmaku-clear': {
            port.postMessage({ type: 'BOFQI_COMMAND', payload: command });
            break;
        }
        case '--download-media': {

            break;
        }
    }
});


const setting = document.querySelector<HTMLFormElement>('#setting');
if (setting) {
    setting.when('reset').subscribe(() => {
        browser.storage.local.remove('Bofqi_Setting');
    });
    setting.when('submit').subscribe(e => {
        e.preventDefault();
    });
    setting.when('change').switchMap(e => {
        return new Observable(subscriber => {
            const timer = setTimeout(() => {
                subscriber.next(e);
                subscriber.complete();
            }, 300);
            return () => clearTimeout(timer);
        });
    }).subscribe(() => {
        const fd = new FormData(setting);
        port.postMessage({ type: 'BOFQI_SETTING', payload: Object.fromEntries(fd.entries()) });
    });

    browser.storage.local.get('Bofqi_Setting').then(({ Bofqi_Setting }) => {
        if (Bofqi_Setting) {
            Object.entries(<Record<string, string>>Bofqi_Setting).forEach(([key, value]) => {
                setting[key].value = value;
            });
        }
    });
}