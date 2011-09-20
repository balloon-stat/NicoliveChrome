(function() {
	var getLiveInfo = function() {
		var current_url = document.URL,
			liveid = current_url.match(/lv\d+/) || current_url.match(/co\d+/),
			title = decodeURI(current_url).match(/t=.*$/)[0].slice('t='.length, -1);
		return [liveid, title];
	},
		live_info = getLiveInfo(),
		nicolive = new $.nico.live(live_info[0]);

	document.title = live_info[1];
	$.extend({
		commentUpdate: function() {
			var comment = nicolive.getComment();

			if(comment['comment'] === '/failure') {
				console.log('/failure');
				clearInterval($.tid);
				nicolive.close();
 			} if(comment['comment'] === '') {
				console.log('no comment');
				return;
			} if (comment['comment'].match(/\/disconnect/)) {
				if (comment['premium'] === '2' || comment['premium'] === '3')
				console.log('disconnect');
				clearInterval($.tid);
				nicolive.close();
			}
			
			console.log(comment);
			$('body').after('<p>' + comment['comment'] + '</p>');
		}
	});

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer(function() {
			$.commentUpdate();
			$.extend({
				tid: setInterval($.commentUpdate, 30)
			});
		});
	});
})();

