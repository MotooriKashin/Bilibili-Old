/**
 * 本模块负责修正旧版顶栏分区
 */
try {
    API.runWhile(() => document.querySelector("#bili-header-m"), () => {
        let node = <HTMLCollectionOf<HTMLDivElement>>(<HTMLDivElement>document.querySelector("#bili-header-m")).getElementsByClassName('nav-name');
        if (node[0]) {
            for (let i = 0; i < node.length; i++) {
                if (node[i].textContent == "科技") {
                    node[i].textContent = "知识";
                    (<any>node[i].parentNode).href = "//www.bilibili.com/v/knowledge/";
                    (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/knowledge/science/"><span>科学科普</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/social_science/"><span>社科·法律·心理</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/humanity_history/"><span>人文历史</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/business/"><span>财经商业</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/campus/"><span>校园学习</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/career/"><span>职业职场</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/design/"><span>设计·创意</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/skill/"><span>野生技能协会</span></a></li>`
                }
                if (node[i].textContent == "数码") {
                    node[i].textContent = "科技";
                    (<any>node[i].parentNode).href = "//www.bilibili.com/v/tech/";
                    (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/tech/digital/"><span>数码</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/application/"><span>软件应用</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/computer_tech/"><span>计算机技术</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/industry/"><span>工业·工程·机械</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/diy/"><span>极客DIY</span></a></li>`
                }
                if (node[i].textContent == "广告") {
                    node[i].textContent = "资讯";
                    (<any>node[i].parentNode).href = "//www.bilibili.com/v/information/";
                    (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/information/hotspot/"><span>热点</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/global/"><span>环球</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/social/"><span>社会</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/multiple/"><span>综合</span></a></li>`
                }
                if (node[i].textContent == "生活") {
                    (<any>node[i].parentNode).parentNode.children[1].children[2].remove(); // 移除美食圈
                    (<any>node[i].parentNode).parentNode.children[1].children[2].remove(); // 移除动物圈
                }
                if (node[i].textContent == "娱乐") (<any>node[i].parentNode).parentNode.children[1].lastChild.remove();
            }
        }
    })
} catch (e) { API.trace(e, "sectionTypo.js") }