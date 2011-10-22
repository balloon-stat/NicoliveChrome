$.nlcm.User = class
	@USER_STATUS = 'http://www.nicovideo.jp/user/'
	constructor: (@user_id, async=true) ->
		$.ajax(
			url: @USER_STATUS + @user_id
			async: async
			success: (data, dataType) ->
				@name = $(data).find('strong').text()
				@thumbnail = $(data).find('#accountFace').children('img').attr('src')
			error: (request, status, thrown) ->
				
		)
