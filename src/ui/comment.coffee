is_first = yes

$.fn.comment = (comments) ->
	bDiv = $('.flexigrid .bDiv')
	s_offset = bDiv[0].scrollHeight - bDiv.scrollTop() - bDiv[0].clientHeight
	if is_first
		is_first = no
		@flexAddData(
			total: 1
			page: 1
			rows: comments
		)
		bDiv.scrollTop(bDiv[0].scrollHeight);
	else
		@flexAppendData(
			total: 1
			page: 1
			rows: comments
		, ':last')
	bDiv.scrollTop(bDiv[0].scrollHeight) if s_offset is 0
