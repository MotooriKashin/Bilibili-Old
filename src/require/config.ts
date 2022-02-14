/**
 * 脚本设置接口，自动存储对于设置的修改
 */
const config = new Proxy(<config>{}, {
    set: (_target, p: string, value) => {
        _target[p] = value;
        GM_setValue<Record<string, any>>("config", _target);
        return true;
    }
})
Object.entries(GM_getValue<Record<string, any>>("config", {})).forEach(k => config[k[0]] = k[1]);
/**
 * 储存在本地的设置数据，在本接口上添加或修改数据将自动保存。  
 * 添加新设置项数据时请复用本接口声明以告知语法检查器知道该数据项的存在。
 */
interface config { }