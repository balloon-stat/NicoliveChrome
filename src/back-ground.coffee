isNicoURL = (url) ->
	url.search(/http:\/\/live.nicovideo.jp\/watch\/[lv|co]+/) isnt -1

getNicoLiveId = (url) ->
	url.match(/lv\d+/) or url.match(/co\d+/)

chrome.browserAction.onClicked.addListener((tab) ->
	return unless isNicoURL(tab.url)
	lvId = getNicoLiveId(tab.url.toString())
	window.open("./view/index.html?#{lvId}&t=#{tab.title}",
							'mywindow','status=-1, height=360, width=750')
)

