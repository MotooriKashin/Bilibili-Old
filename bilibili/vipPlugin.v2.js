window.vipPopup = function(options,callback){
  window.onmessage = function(e) {
      e = e || window.event;
      switch(e.data) {
          case 'closeVipPlugin':
              $('#biliVipBuyExPlugin').remove();
              uploadData(function(){  //埋点
                  rec_rp("event", "vip_web_pay_failure", {
                      reason: '1',
                      optype:options.type==1 && 2 || 1,
                      from:options.fromid || '',
                      title:options.fromtitle || ''
                  });
              });
          break;
          case 'vipGoLogin':
              window.location.href = 'https://account.bilibili.com/login?gourl=' + encodeURIComponent(location.href);
          break;
          case 'vipPaySuccess' :
              callback();
              $('#biliVipBuyExPlugin').remove();
          break;
      }
  };
  var param = (options && options.type==1) ? '?type=1' : '?type=2'
  if(!!options.fromid) param += '&fromid=' + options.fromid;
  if(!!options.fromtitle) param += '&fromtitle=' + options.fromtitle;
  if(!!options.appid) param += '&appid=' + options.appid;
  if(!!options.subid) param += '&subid=' + options.subid;
  if(!!options.check) param += '&check=' + options.check;
  if(!!options.bmid) param += '&bmid=' + options.bmid;
  if(!!options.bface) param += '&bface=' + encodeURIComponent(options.bface);
  if(!!options.buname) param += '&buname=' + encodeURIComponent(options.buname);
  var iframe = $('<iframe name="biliVipBuyExPlugin" id="biliVipBuyExPlugin" src="//vip.bilibili.com/site/vip-payplugin-v2.html'+param+'" allowTransparency="true" frameborder="0" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:transparent;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0);z-index:99999999999999999999;"></iframe>').appendTo($('body')).show();
};

window.vipDisable = function(){
  window.onmessage = function(e) {
      e = e || window.event;
      switch(e.data) {
          case 'closeVipDisable': $('#biliVipDisable').remove();
          break;
      }
  };
  var iframe = $('<iframe name="biliVipDisable" id="biliVipDisable" src="//vip.bilibili.com/site/vip-disable.html" allowTransparency="true" frameborder="0" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:transparent;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0);z-index:99999999999999999999;"></iframe>').appendTo($('body')).show();
};


//数据埋点
var dataReady;
$.getScript('//data.bilibili.com/rec.js', function(ret) {
  dataReady = true;
});
var uploadData = function(fn){
  if(!fn) return;
  if(dataReady){
      fn();
  }else{
      setTimeout(function(){
          uploadData(fn);
      },1000)
  }
}
