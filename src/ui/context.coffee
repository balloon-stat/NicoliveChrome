comment = {}
comment_data = {}

openUserProfile = ->
	window.open("../user_info.html?user_id=#{comment_data['user_id']}",
					'user_window', 'status=-1, height=360, width=350')

setNamig = ->
	comment_info = comment.getComemntInfo(comment_data['no'])
	if comment_info['id'] is comment_info['name']
		$.nlcm.User.getUserInfo(comment_data['user_id'], (name, thumbnail) ->
			$('#naming_text').val(name)
		, no) if comment_data['anonymity'] is '0'
	else
		$('#naming_text').val(comment_info['name'])
	$('#naming_dialog').dialog(
		modal: true
		buttons: [
			text: 'OK'
			click: ->
				naming = $(this).find('input:text')
				comment.updateComment(comment_no,
					name: naming.val()
				)
				console.log(comment_info['user_id'] + 'を' + naming.val() + 'に名前を変更しました.');
				comment.commentUpdate()
				naming.val('');
				$(this).dialog('close');
		]
	)

setColoring = ->
	$('#coloring_dialog').dialog(
		modal: true
		width: 500
		buttons: [
			text: 'OK'
			click: ->
				r = $('#red').slider('value')
				g = $('#green').slider('value')
				b = $('#blue').slider('value')
				RGB = '#' + $.hexFromRGB(r, g, b)
				console.log("R : #{r}, G : #{g}, B : #{b}")
				comment.updateComment(comment_no,
					color: RGB
				)
				console.log(user_id + 'の色を' + RGB + 'に変更しました.')
				comment.commentUpdate()
				$(this).dialog('close')
		]
	)

userCommentHide = () ->
	$('comments tr').each(->
		$$ = $(this)
		return unless $$.find('td').eq(2).children('div').text() is comment_data['user_id']
		_comment = $$.find('td').eq(1).children('div')
		if _comment.data('cache')
			_comment.text(_comment.data('cache'))
			_comment.data('cache', null)
		else
			_comment.data('cache', _comment.text())
			_comment.text('非表示です')
	)

contextSelect = (type, target) ->
	comment_no = target.find('td').eq(0).text()
	comment_data = comment.getCommentByNo(comment_no)
	switch type
		when 'user_info'
			openUserProfile()
		when 'naming'
			setNamig()
		when 'coloring'
			setColoring()
		when 'tmp_hide'
			userCommentHide()
		when 'profile_page'
			$.nico.User.jumpUserProfile()
		else
			return false

$.fn.context = (_comment) ->
	comment = _comment
	@jeegoocontext('custom_context',
		widthOverflowOffset: 0
		heightOverflowOffset: 3
		onSelect: (e, target) ->
			type = $(this).attr('id')
			contextSelect(type, $(target))
	)
