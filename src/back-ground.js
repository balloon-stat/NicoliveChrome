(function() {
  var getNicoLiveId, isNicoURL;
  isNicoURL = function(url) {
    return url.search(/http:\/\/live.nicovideo.jp\/watch\/[lv|co]+/) !== -1;
  };
  getNicoLiveId = function(url) {
    return url.match(/lv\d+/) || url.match(/co\d+/);
  };
  chrome.browserAction.onClicked.addListener(function(tab) {
    var lvId;
    if (!isNicoURL(tab.url)) {
      return;
    }
    lvId = getNicoLiveId(tab.url.toString());
    return window.open("./view/index.html?" + lvId + "&t=" + tab.title, 'mywindow', 'status=-1, height=360, width=750');
  });
}).call(this);
