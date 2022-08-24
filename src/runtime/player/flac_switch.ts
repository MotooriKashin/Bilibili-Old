import { addCss } from "../element/add_element";
import { setting } from "../setting";
import { videoFloat } from "./video_float";

export class FlacSwitch {
    constructor() {
        if (setting.flacEnabled == undefined) {
            setting.flacEnabled = true;
        }
        (<any>window).flac = {
            enabled: setting.flacEnabled,
            init: () => {
                this.initUI();
            }
        }
    }
    initUI() {
        if (document.querySelector("#bilibili-player-flac-btn")) return;
        let anchor = <HTMLDivElement>document.querySelector(".bilibili-player-video-btn-quality");
        let btn = document.createElement("div");
        btn.setAttribute("class", "bilibili-player-video-btn");
        btn.setAttribute("id", "bilibili-player-flac-btn");
        btn.setAttribute("style", "display: block; width: 35px; position: relative");
        btn.innerHTML = "<div>FLAC</div>";
        addCss(`
        #bilibili-player-flac-btn.on > div::after {
            content: "";
            position: absolute;
            top: 20%;
            left: 0;
            width: 100%;
            height: 57%;
            background-image: linear-gradient(120deg, #dedfce, #6594a3);
            opacity: 0.5;
            border-radius: 5px;
        }
        `, "flacBtnCss");
        if (setting.flacEnabled) {
            btn.classList.add("on");
        }
        btn.onclick = () => {
            (<any>window).flac.enabled = setting.flacEnabled = !setting.flacEnabled;
            btn.setAttribute("class", setting.flacEnabled ? "bilibili-player-video-btn on" : "bilibili-player-video-btn");
            (<any>window).reloadMedia((succeed: boolean) => {
                if (succeed) videoFloat(`已${setting.flacEnabled ? "启用" : "关闭"}HiRes 音频`);
                else videoFloat(`${setting.flacEnabled ? "启用" : "关闭"}HiRes 音频出错！`);
            });
        }
        if (!document.querySelector("#bilibili-player-flac-btn")) anchor.insertAdjacentElement("beforebegin", btn);
    }
}