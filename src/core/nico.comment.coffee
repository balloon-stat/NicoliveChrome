COMMENT_NEED_INFO = ['thread', 'no', 'vpos', 'date', 'user_id', 'premium', 'anonymity']

$.nlcm.error.CommentError = class
	constructor: (@message) ->
	toString: ->
		"CommentError #{@message}"

$.nlcm.Comment = class
	constructor: (@nc) ->

	connectCommentServer: ->
		@nc.connect(@server['addr'], @server['port'])
		@nc.requestComment(@server['thread'], '500')

	getComment: ->
		@comments = []
		while comment = parseComment()
			@comments.push(comment)
		return @comments

	parseComment = ->
		comment = @nc.getComment()
		$$ = $(comment)
		commented = {}
		return false unless $$.text()
		commented['message'] = $$.text()

		for info in COMMENT_NEED_INFO
			commented[info] = $$.attr(info)
			commented[info] = '0' unless commented[info]?
		checkComment(commented)

	checkComment = (comment) ->
		is_administor = comment['premium'] is '2' or comment['premium'] is '3'
		if is_administor and comment['message'] is '/failure'
			throw new $.nlcm.error.CommentError 'close'
		return comment
