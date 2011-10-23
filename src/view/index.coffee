live_info = $.nlcm.Live.getLiveInfo(document.URL)
document.title = live_info['title']
nicolive = new $.nlcm.Live(live_info['id'])
window.onbeforeunload = ->
	nicolive.close()

$('#comments').flexigrid(
	colModel : [
		{ display:'No.', name : 'no', width : 25, align: 'center' }
		{ display: 'コメント', name : 'message', width : 520, align: 'left' }
		{ display: 'ユーザー', name : 'user_id', width : 80, align: 'center' }
		{ display: '時刻', name : 'date', width : 40, align: 'center' }
	]
	height: '300'
	resizable: false
	nowrap: false
	singleSelect: true
	striped: false
	dataType: 'json'
)
$('.hDivBox tr th :eq(1)').css('text-align', 'center')

nicolive.startComment((comments) ->
	$('#comments').comment(comments)
	nicolive.comment.commentUpdate()
	$('#comments tr').menu(nicolive.comment)
)
