/**
 * @module ui
 * @description 设置UI绘制
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    // @ts-ignore
    const BLOD = window.BLOD; /** @see main  */
    const toast = BLOD.toast; /** @see debug */

    class Ui {
        constructor() {
            console.debug('import module "ui.js"');
        }
        /**
         * 绘制设置入口
         * @param {*} [timer] 相当于变量声明
         */
        init(timer) {
            let face = document.createElement("div");
            let attribute = {
                "class": "bili-old ui-face",
                "id": "ui-face",
                "style": "right : -54px;"
            }
            for (let key in attribute) face.setAttribute(key, attribute[key]);
            face.onmouseover = () => face.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            face.onmouseout = () => face.setAttribute("style", "right : -54px;");
            face.onclick = () => {
                let check = document.getElementsByClassName("ui-table")[0];
                if (!check) this.table(); else if (check.getAttribute("hidden")) check.removeAttribute("hidden");
            }
            face.innerHTML = "<i></i><span>设置</span>";
            (timer = () => {
                setTimeout(() => { document.body ? document.body.appendChild(face) : timer() }, 100);
            })();
        }
        /**
         * 绘制设置面板
         * @param {*} timer 相当于变量声明
         */
        table(timer) {
            let table = document.createElement("div");
            let config = BLOD.config;
            table.setAttribute("class", "bili-old ui-table");
            table.setAttribute("id", "ui-table");
            table.innerHTML = '<span style="color : rgb(0,0,0);font-size : 14px;">BilibiliOld 设置</span><span style="color : blue;float : right;font-size : 12px;">恢复默认</span>';
            document.body.appendChild(table);
            // @ts-ignore
            table.children[1].onclick = () => {
                for (let key in BLOD.defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = BLOD.defaultConfig.rewrite[key][0];
                for (let key in BLOD.defaultConfig.reset) if (key in config.reset) config.reset[key] = BLOD.defaultConfig.reset[key][0];
                BLOD.setValue("config", config);
                BLOD.reset.accesskey();
                table.remove();
                toast("恢复默认数据！", "刷新页面以立即生效");
            }
            for (let key in config.rewrite) this.setTable(table, BLOD.defaultConfig.rewrite[key], config.rewrite[key], key);
            for (let key in config.reset) this.setTable(table, BLOD.defaultConfig.reset[key], config.reset[key], key);
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {
                timer = window.setTimeout(() => {
                    table.setAttribute("hidden", "hidden");
                    BLOD.setValue("config", config);
                    toast("设置数据已保存！", "可能需要刷新页面才会生效！")
                }, 500);
            }
        }
        /**
         * 绘制设置选项
         * @param {HTMLElement} table 设置面板节点
         * @param {Array} name 设置数据数组
         * @param {number} check 启用与否
         * @param {string} key 设置主键名称
         */
        setTable(table, name, check, key) {
            let setTable = document.createElement("div");
            let config = BLOD.config;
            setTable.setAttribute("style", "padding : 4px 4px 0px 4px;clear : both;");
            setTable.innerHTML = '<span style="float : left;display : inline-block;color : rgb(0,0,0);font-size : 14px;"></span><input type="checkbox" class="checke">';
            setTable.onmouseover = () => {
                let toast = document.createElement("div");
                toast.setAttribute("class", "bili-old ui-state");
                toast.setAttribute("id", "ui-state");
                toast.innerHTML = name[2];
                document.body.appendChild(toast);
            }
            setTable.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
            setTable.children[0].innerText = name[1];
            // @ts-ignore
            setTable.children[1].onclick = () => {
                // @ts-ignore
                if (setTable.children[1].checked) {
                    if (key in config.rewrite) {
                        config.rewrite[key] = 1;
                        toast.success("启用功能：" + name[1]);
                    } else {
                        config.reset[key] = 1;
                        toast.success("启用功能：" + name[1]);
                    }
                }
                else {
                    if (key in config.rewrite) {
                        config.rewrite[key] = 0;
                        toast.warning("禁用功能：" + name[1]);
                    }
                    else {
                        config.reset[key] = 0;
                        toast.warning("禁用功能：" + name[1]);
                    }
                }
                if (key == "accesskey") BLOD.reset.accesskey();
            }
            // @ts-ignore
            if (check) setTable.children[1].checked = true;
            table.appendChild(setTable);
        }
    }

    if (window.self == window.top) {
        let exports = new Ui();
        exports.init();
    }
})()
