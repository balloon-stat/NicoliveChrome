(function() {
	var user_id = (function() {
			var current_url = document.URL,
				user_id = current_url.match(/user_id=(\S*)/)[1];
			return user_id;
		})(),
		user_info;

	$.nico.getUserInfo(user_id, function(info) {
		user_info = info
	}, false);

	$('#user_profile')
		.children('#user_id')
			.html("<a href='http://www.nicovideo.jp/user/" + user_id + "'>" + user_id + "</a>")
		.end()
		.children('#user_name')
			.html("<a href='http://www.nicovideo.jp/user/" + user_id + "'>" + user_info['name'] + "</a>")
		.end()
		.children('#user_thumbnail')
			.html("<a href='http://www.nicovideo.jp/user/" + user_id + "'>" + "<img src=\"" + user_info['thumbnail'] + "\">" + "</a>")
		.end()
		.children('#user_color')
			.text("")
		.end()
	;
})();
