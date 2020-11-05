// module "ui.js"

const BLOD = window.BLOD;
const config = BLOD.config;
const defaultConfig = BLOD.defaultConfig;
const setValue = window.setValue;
const getValue = window.getValue;
async function ui() {
    let face = document.createElement("div");
    let attribute = {
        "class" : "bili-old ui-face",
        "id" : "ui-face",
        "style" : "right : -54px;"
    }
    for (let key in attribute) face.setAttribute(key, attribute[key]);
    face.onmouseover = () => face.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
    face.onmouseout = () => face.setAttribute("style", "right : -54px;");
    face.onclick = () => {
        let check = document.getElementsByClassName("ui-table")[0];
        if (!check) table(); else if (check.getAttribute("hidden")) check.removeAttribute("hidden");
    }
    face.innerHTML = "<i></i><span>设置</span>";
    setTimeout(() => {document.body.appendChild(face)},100);
}
async function table(timer) {
    let table = document.createElement("div");
    table.setAttribute("class", "bili-old ui-table");
    table.setAttribute("id", "ui-table");
    table.innerHTML = '<span style="color : rgb(0,0,0);font-size : 14px;">BilibiliOld 设置</span><span style="color : blue;float : right;font-size : 12px;">恢复默认</span>';
    document.body.appendChild(table);
    table.children[1].onclick = () => {
        for (let key in defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = defaultConfig.rewrite[key][0];
        for (let key in defaultConfig.reset) if (key in config.reset) config.reset[key] = defaultConfig.reset[key][0];
        setValue("config",config);
        table.remove();
    }
    for (let key in config.rewrite) setTable(table,defaultConfig.rewrite[key], config.rewrite[key], key);
    for (let key in config.reset) setTable(table, defaultConfig.reset[key], config.reset[key], key);
    table.onmouseover = () => window.clearTimeout(timer);
    table.onmouseout = () => {
        timer = window.setTimeout(() => {
            table.setAttribute("hidden", "hidden");
            setValue("config", config);
        }, 500);
    }
}
async function setTable(table, name, check, key) {
    let setTable = document.createElement("div");
    setTable.setAttribute("style", "padding : 4px 4px 0px 4px;clear : both;");
    setTable.innerHTML = '<span style="float : left;display : inline-block;color : rgb(0,0,0);font-size : 14px;"></span><input type="checkbox" class="checke">';
    setTable.onmouseover = () => {
            let toast = document.createElement("div");
            toast.setAttribute("class","bili-old ui-state");
            toast.setAttribute("id","ui-state");
            toast.innerHTML = name[2];
            document.body.appendChild(toast);
        }
    setTable.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
    setTable.children[0].innerText = name[1];
    setTable.children[1].onclick = () => {
            if (setTable.children[1].checked) {
                if (key in config.rewrite) config.rewrite[key] = 1;
                else config.reset[key] = 1;
                if (!config.reset.xhrhook && key != "xhrhook" && defaultConfig.reset[key][1].includes("xhrhook")) console.log("启用失败！xhrhook已关闭！", defaultConfig.reset[key][0]);
            }
            else {
                if (key in config.rewrite) config.rewrite[key] = 0;
                else config.reset[key] = 0;
                if (key == "xhrhook") console.log("xhrhook已关闭，部分功能无法生效！")
            }
        }
    if (check) setTable.children[1].checked = true;
    table.appendChild(setTable);
}
ui();