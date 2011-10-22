live_info = getLiveInfo(document.URL)
document.title = live_info['title']
nicolive = new $.nlcm.live(live_info[0])
window.onbeforeunload = ->
	nicolive.close()
nicolive.startComment((comment) ->
	console.log(comment)
)
