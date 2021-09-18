/**
 * 本模块负责转化av页简介中BV号为超链接
 */
try {
    API.switchVideo(() => {
        let desc = document.getElementsByClassName("info");
        if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
            if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                for (let i = 0; i < paster.length; i++) {
                    let newer = "av" + API.abv(paster[i]);
                    newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                    desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
                }
            }
        }
    });
}
catch (e) {
    API.trace(e, "descBV.js");
}
