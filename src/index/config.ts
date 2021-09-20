/**
 * 脚本设置数据，关联设置项的key:value
 */
const CONFIG: { [name: string]: any } = {};
const config: { [name: string]: any } = new Proxy(CONFIG, {
    set: (_target, p: string, value) => {
        CONFIG[p] = value;
        GM.setValue<{ [name: string]: any }>("config", CONFIG);
        return true;
    },
    get: (_target, p: string) => CONFIG[p]
})
Object.entries(GM.getValue<{ [name: string]: any }>("config", {})).forEach(k => Reflect.set(config, k[0], k[1]));
const SETTING: (any)[] = [];
function modifyConfig(obj: any) {
    Reflect.has(obj, "value") && !Reflect.has(config, Reflect.get(obj, "key")) && Reflect.set(config, Reflect.get(obj, "key"), Reflect.get(obj, "value"));
    Reflect.get(obj, "type") == "sort" && Reflect.has(obj, "list") && (<typeof SETTING>Reflect.get(obj, "list")).forEach(d => modifyConfig(d));
}
function registerSetting(obj: any) {
    SETTING.push(obj);
    modifyConfig(obj);
}
const MENU: { [name: string]: any } = {};
function registerMenu(obj: any) {
    Reflect.set(MENU, Reflect.get(obj, "key"), obj);
}
function unRegisterSetting(keys?: string[]) {
    SETTING.forEach((d, i) => {
        keys ? (Reflect.has(d, "key") && keys.includes(Reflect.get(d, "key")) && SETTING.splice(i, 1)) : SETTING.splice(0, SETTING.length);
    })
}