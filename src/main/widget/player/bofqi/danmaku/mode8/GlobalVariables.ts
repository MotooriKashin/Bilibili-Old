const dict: Record<string, any> = {};

export function _set(key: string, value: any) {
    dict[key] = value;
}

export function _get(key: string) {
    return dict[key];
}

export function _(key: string) {
    return _get(key);
}