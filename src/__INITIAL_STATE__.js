// module "__INITIAL_STATE__.js"

const iniState = {
    av : (date) => {
        BLOD.try("__INITIAL_STATE__·av", () => {
            data = deliver.xhrJsonCheck(data).data;
                BLOD.aid = BLOD.aid || data.View.aid;
                BLOD.cid = BLOD.cid || data.View.cid;
                let dat = {aid : -1, comment : {count : 0, list : []}, error : {}, isClient : false, p: "", player: "", playurl: {}, related : [], tags : [], upData : {}, videoData : {}}
                dat.aid = data.View.aid;
                dat.related = data.Related;
                dat.tags = data.Tags;
                dat.upData = data.Card.card;
                dat.upData.archiveCount = data.Card.archive_count;
                dat.videoData = data.View;
                dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + BLOD.cid +'&aid=' + BLOD.aid +'&pre_ad=")'
                return dat;
        })
    }
}
BLOD.iniState = iniState;