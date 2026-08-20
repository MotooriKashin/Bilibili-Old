import style from './index.css' with {type: 'css'};
import '../../main/widget/slider';

document.adoptedStyleSheets.push(style);

const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
if (!tab) throw new Error('未能链接到内容脚本');
const { id } = tab;
if (!id) throw new Error('未能链接到内容脚本');
const port = browser.tabs.connect(id, { name: 'sidePanel' });
const [watching] = [<HTMLDivElement>document.querySelector('.watching')];

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
    }
});
port.onDisconnect.addListener(() => {
    // browser.sidePanel.close({ tabId: id });
    globalThis.close();
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