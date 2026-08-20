import TID from './tid.json' with {type: "json"};

export function tidNameLink(tid: number) {
    for (const d of TID) {
        if (d.tid === tid) return <ITidNameLink>[[d.name, d.url]];
        for (const sub of d.sub) {
            if (sub.tid === tid) return <ITidNameLink>[[d.name, d.url], [sub.name, sub.url]];
        }
    }
    return;
}

type ITidNameLink = [string, string][];