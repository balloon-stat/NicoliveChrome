live_info = $.nlcm.Live.getLiveInfo(document.URL)
document.title = live_info['title']
nicolive = new $.nlcm.Live(live_info['id'])
window.onbeforeunload = ->
	nicolive.close()
nicolive.startComment((comment) ->
	console.log(comment)
)
console.log("hoge")