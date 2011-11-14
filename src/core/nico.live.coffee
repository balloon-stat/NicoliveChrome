GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v='

$.nlcm.Live = class
	tid = {}

	@getLiveId: (url) ->
		liveid = url.match(/lv\d+/) \
						or url.match(/co\d+/)
		return liveid[0]

	constructor: (@lv_id, plugin_name='plugin') ->
		plugin = $("##{plugin_name}")
		nc = plugin[0].NiconamaClient()
		@comment = new $.nlcm.Comment(nc)

	parsePlayerStatus = (player_status) ->
		live_info = {}
		stream_lines = ['id', 'title', 'description', 'owner_id', 'start_time', 'default_community']
		$(player_status)
			.find('getplayerstatus')
			.tap(->
				status = @attr('status')
				if status is 'fail'
					throw new Error 'StatusFailError'
				live_info.status = status
			)
				.find('stream')
				.tap(->
					live_info.stream = {}
					$.each(stream_lines, (index, value) =>
						live_info.stream[value] = @find(value).text()
					)
				)
			.end()
				.find('ms')
				.tap(->
					live_info.ms = {}
					@children().each(->
						live_info.ms[this.tagName] = $(this).text()
					)
				)
			.end()
		.end()
		return live_info

	getPlayerStatusXML: (callback) ->
		request_status = GET_PLAYER_STATUS + @lv_id
		$.ajax(
			url: request_status
			type: 'GET'
			dataType: 'xml'
			success: (data, dataType) =>
				@live_info = parsePlayerStatus(data)
				@lv_id = @live_info.stream['id']
				callback.call(this)
		)

	startComment: (callback) ->
    @comment.connectCommentServer(@live_info['ms'])
    tid = setInterval(=>
      readComment.call(this, callback)
    , 30)

	readComment = (callback) ->
		try
			comment = @comment.getComment()
		catch e
			@stopComment() if e.message is 'disconnect'
			throw e
		callback(comment) if comment.length > 0

	stopComment: ->
		clearInterval(tid)
		console.log 'コメントの取得を終了しました'

	close: ->
		@nc.close()
		@db.close()
