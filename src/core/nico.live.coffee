GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v='

$.nlcm.Live = class
	tid = {}

	@getLiveInfo: (url) ->
		liveid = url.match(/lv\d+/) \
						or url.match(/co\d+/)
		title = decodeURI(url).match(/t=.*$/)[0]
						.slice('t='.length, -1)
		return {
			id: liveid[0]
			title: title
		}

	constructor: (@lv_id, plugin_name='plugin') ->
		plugin = $("##{plugin_name}")
		nc = plugin[0].NiconamaClient()
		throw new Error('NPAPIオブジェクトが見つかりません') unless plugin?
		@comment = new $.nlcm.Comment(nc)

	parsePlayerStatus = (player_status) ->
		live_info = {}
		stream_lines = ['id', 'title', 'description', 'owner_id', 'start_time', 'default_community']
		$(player_status)
			.find('getplayerstatus')
			.tap(->
				status = @attr('status')
				if status is 'fail'
					throw new Error('getPlayerStatus\'s status is fail')
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
				callback()
		)

	startComment: (callback) ->
		@getPlayerStatusXML(=>
			@comment.connectCommentServer(@live_info['ms'])
			tid = setInterval(=>
				@readComment(callback)
			, 30)
		)

	readComment: (callback) ->
		comment = @comment.getComment()
		callback(comment) if comment.length > 0

	stopComment: ->
		clearInterval(tid)

	close: ->
		@nc.close()
		@db.close()
