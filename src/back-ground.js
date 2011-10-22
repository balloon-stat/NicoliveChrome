(function() {
	var isNicoURL = function(url) {
			return url.search(/http:\/\/live.nicovideo.jp\/watch\/[lv|co]+/) != -1;
		},

		getNicoLiveId = function(url) {
			return url.match(/lv\d+/) || url.match(/co\d+/);
		};

	chrome.browserAction.onClicked.addListener(function(tab) {
		if(!isNicoURL(tab.url)) {
			return;
		}
		var lvId = getNicoLiveId(tab.url.toString());
		window.open('popup.html?' + lvId + '&t=' + tab.title, 'mywindow','status=-1, height=360, width=750');
	});
})();
