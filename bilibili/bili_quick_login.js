(function() {
	var layer_id = 'bilibili-quick-login',
			_callback;

	window.biliQuickLogin = function(callback) {
		var layer = document.createElement('iframe');
		layer.setAttribute('id', layer_id);
		layer.setAttribute('frameborder', 'no');
		layer.setAttribute('border', 0);
		layer.setAttribute('src', 'https://account.bilibili.com/ajax/miniLogin/minilogin');
		layer.style.position = 'fixed';
		layer.style.top = 0;
		layer.style.left = 0;
		layer.style.width = '100%';
		layer.style.height = '100%';
		layer.style.zIndex = 99999;
		document.body.appendChild(layer);
		_callback = callback;
	}

	window.onmessage = function(e) {
		e = e || window.event;
		switch(e.data) {
			case 'success': typeof _callback == 'function' && _callback();
			case 'close': var layer = document.getElementById(layer_id);
										layer.parentNode.removeChild(layer);
		}
	}
})();