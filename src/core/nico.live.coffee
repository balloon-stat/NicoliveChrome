GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v='
INDEXED_DB_VERSION = '1.5.0'

$.nlcm.Live = class
	@getLiveInfo: (url) ->
			liveid = url.match(/lv\d+/) \
						or url.match(/co\d+/)
			title = decodeURI(url).match(/t=.*$/)[0]
						.slice('t='.length, -1)
		return {
			id: liveid[0]
			title: title
		}

	tid = {}

	constructor: (@lv_id, plugin_name) ->
		plugin_name or= 'plugin'
		plugin = $("##{plugin_name}")
		nc = plugin[0].NiconamaClient()
		throw new Error('NPAPIオブジェクトが見つかりません') unless plugin?
		@db = new $.nlcm.DB('nicolive', INDEXED_DB_VERSION)
		@comment = new $.nlcm.Comment(@nc)

	parsePlayerStatus = (that) ->
		live_info = {}
		stream_lines = ['title', 'description', 'owner_id', 'start_time', 'default_community']
		$(data)
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
					$.each(stream_lines, (index, value) ->
						live_info.stream[value] = $(@).find(value).text()
					)
					that.lv_id = @find('id').text()
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
		that.live_info = live_info
		that.getCommunityInfo()

	getPlayerStatusXML = (callback) ->
		request_status = GET_PLAYER_STATUS + @lv_id
		$.ajax(
			url: request_status
			type: 'GET'
			dataType: 'xml'
			success: (data, dataType) =>
				parsePlayerStatus(@)
				callback()
		)

	startComment: (callback) ->
		getPlayerStatusXML(->
			tid = setInterval(readComment, 30, callback)

	readComment = (callback) ->
		comment = @comment.getComment()
		callback(comment)

	stopComment: ->
		clearInterval(tid)

	close: ->
		@nc.close()
		@db.close()
