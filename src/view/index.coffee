lvId = $.nlcm.Live.getLiveId(document.URL)
nicolive = new $.nlcm.Live(lvId)

window.onbeforeunload = ->
	nicolive.close()

nicolive.getPlayerStatusXML(->
  document.title = @live_info.stream['title']
  
  @startComment((comments) ->
    $('#comments').comment(comments)
    nicolive.comment.commentUpdate()
    $('#comments tr').menu(nicolive.comment)
  )
)
