$.nlcm.User = class
	@USER_STATUS = 'http://www.nicovideo.jp/user/'
	@jumpUserProfile: (user_id) ->
		window.open(@USER_STATUS + user_id)

	@getUserInfo: (user_id, callback, async=yes) ->
		$.ajax(
			url: @USER_STATUS + user_id
			async: async
			success: (data, dataType) ->
				name = $(data).find('strong').text()
				thumbnail = $(data).find('#accountFace').children('img').attr('src')
				callback(name, thumbnail)
		)

	constructor: (@user_id, async=no) ->
		$.ajax(
			url: @USER_STATUS + @user_id
			async: async
			success: (data, dataType) ->
				@name = $(data).find('strong').text()
				@thumbnail = $(data).find('#accountFace').children('img').attr('src')
		)
