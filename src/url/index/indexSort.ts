interface modules {
    /**
     * 修复主页失效分区
     */
    readonly "indexSort.js": string;
}
{
    API.importModule("biliIndexRec.js");
    API.importModule("ad2info.js");
    API.importModule("mediaRank.js");
    API.importModule("indexRecommend.js");
    // 广告取转资讯区
    API.jsonphook(["region", "rid=165"], url => url.replace("rid=165", "rid=202"), undefined, false);
    // 用户热点最新投稿修复资讯区最新投稿
    API.jsonphook(["newlist", "rid=165"], url => url.replace("rid=165", "rid=203"), undefined, false);
    // 取消原创排行榜
    API.jsonphook(["region", "original=1"], url => url.replace("original=1", "original=0"), undefined, false);
    // 修复置顶推荐
    API.jsonphook("api.bilibili.com/x/web-interface/ranking/index", url => url.replace("ranking/index", "index/top"), undefined, false);
}