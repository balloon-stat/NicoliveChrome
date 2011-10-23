INDEXED_DB_VERSION = '1.5.0'
COMMENT_NEED_INFO = ['thread', 'no', 'vpos', 'date', 'user_id', 'premium', 'anonymity']

$.nlcm.error.CommentError = class
	constructor: (@message) ->

	toString: ->
		"CommentError #{@message}"

$.nlcm.Comment = class
	constructor: (@nc) ->
		@comments_all = []
		@db = new $.nlcm.DB('nicolive', INDEXED_DB_VERSION)

	connectCommentServer: (@server) ->
		@nc.connect(@server['addr'], @server['port'])
		@nc.requestComment(@server['thread'], '500')
		console.log 'コメントサーバに接続しました'

	getComment: (save=yes) ->
		comments = []
		while comment = parseComment.call(this)
			@comments_all[comment['no']] = comment
			comments.push(
				id: @comments_all.length
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
	
	getCommentInfo: (comment_no) ->
		user_id = @getCommentByNo[comment_no]['user_id']
		return @db.getData('user', 'id', user_id)

	updateComment: (comment_no, redata) ->
		user_id = @getCommentByNo[comment_no]['user_id']
		@db.updateData('user', 'id', user_id, redata)

	commentUpdate: ->
		$('#comments tr')
			.each(->
				$$ = $(this)
				user_id = $$.find('td').eq(2)
				comment_no = $$.find('td').eq(0).text()
				comment_info = @getCommentInfo(comment_no)
				user_id.find('div').text(comment_info['name'])
				$$.css('background-color', comment_info['color'])
			)

	parseComment = ->
		comment = @nc.getComment()
		$$ = $(comment)
		commented = {}
		return false unless $$.text()
		commented['message'] = $$.text()

		for info in COMMENT_NEED_INFO
			commented[info] = $$.attr(info)
			commented[info] = '0' unless commented[info]?
		@checkComment(commented)

	checkComment: (comment) ->
		is_administor = comment['premium'] is '2' or comment['premium'] is '3'
		if is_administor and comment['message'] is '/failure'
			throw new $.nlcm.error.CommentError 'close'
		return comment
