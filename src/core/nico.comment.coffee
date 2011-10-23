INDEXED_DB_VERSION = '1.5.0'
COMMENT_NEED_INFO = [
	'no'
	'thread'
	'vpos'
	'date'
	'user_id'
	'premium'
	'anonymity'
]

$.nlcm.Comment = class
	constructor: (@nc) ->
		@comments_all = {}
		@count = 0
		@db = new $.nlcm.DB('nicolive', INDEXED_DB_VERSION)

	connectCommentServer: (@server) ->
		@nc.connect(@server['addr'], @server['port'])
		@nc.requestComment(@server['thread'], '500')
		console.log 'コメントサーバに接続しました'

	getComment: (save = yes) ->
		comments = []
		while comment = parseComment.call(this)
			@comments_all[comment['no']] = comment
			@count += 1
			comments.push(
				id: @count
				cell: [
					comment['no']
					comment['message']
					comment['user_id']
					comment['vpos']
				]
			)
			@db.addData('user',
				id: comment['user_id']
				name: comment['user_id']
				color: 'white'
			) if save
		return comments

	getCommentByNo: (comment_no) ->
		return @comments_all[comment_no]
	
	getCommentInfo: (comment_no, callback) ->
		user_id = @getCommentByNo(comment_no)['user_id']
		@db.getData('user', 'id', user_id, callback)

	updateComment: (comment_no, redata) ->
		user_id = @getCommentByNo(comment_no)['user_id']
		@db.updateData('user', 'id', user_id, redata)

	commentUpdate: ->
		that = this
		$('#comments tr')
			.each(->
				$$ = $(this)
				user_id = $$.find('td').eq(2)
				comment_no = $$.find('td').eq(0).text()
				that.getCommentInfo(comment_no, (comment_info) =>
					user_id.find('div').text(comment_info['name'])
					$$.css('background-color', comment_info['color'])
				)
			)

	msec2m_s = (msec) ->
		sec = Math.round(msec / 1000)
		min = Math.floor(sec / 60)
		sec = sec - 60 * min
		return [min, sec]

	fill_zero = (num, fill) ->
		fill or=  2
		filled = '0'
		fill.times((i) ->
			filled += filled
		)
		return (filled + num).slice(-fill)

	parseComment = ->
		comment = @nc.getComment()
		$$ = $(comment)
		commented = {}
		return false unless $$.text()
		commented['message'] = $$.text()

		for info in COMMENT_NEED_INFO
			commented[info] = $$.attr(info)
			commented[info] = '0' unless commented[info]?
		vpos = msec2m_s(commented['vpos'] * 10)
						.map((time) -> fill_zero(time))
		commented['vpos'] = vpos[0] + ':' + vpos[1]
		return @checkComment(commented)

	checkComment: (comment) ->
		is_administor = comment['premium'] is '2' or comment['premium'] is '3'
		is_close = comment['message'] is '/failure' or comment['message'] is '/disconnect'
		if is_administor and is_close
			throw new $.nlcm.error.CloseLiveError 'disconnect'
		return comment
