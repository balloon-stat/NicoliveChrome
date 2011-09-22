(function() {
	var nicolive,
		live_info,
		tid,
		bDiv,
		is_cache = false,
		comments = [],
		is_first = true,
		getLiveInfo = function() {
			var current_url = document.URL,
				liveid = current_url.match(/lv\d+/)
							|| current_url.match(/co\d+/),
				title = decodeURI(current_url).match(/t=.*$/)[0]
							.slice('t='.length, -1);
			return [liveid, title];
		},
		commentUpdate = function(comment) {
			var s_offset;
			if (!comment) {
				$('#comments').flexAddData({
					total: 1,
					page: 1,
					rows: comments
				});
				return;
			}
			comments.push({
				id: comments.length,
				cell: [
					comment['no'],
					comment['message'],
					comment['user_id'],
					comment['vpos']
				]
			});
			s_offset = bDiv[0].scrollHeight - bDiv[0].clientHeight - bDiv.scrollTop();
			
			if (s_offset === 0 || is_first) {
				console.log('ture');
				is_first = false;
				// TODO スクロールされない(スクロールチェックもNG)
				bDiv[0].scrollTop = bDiv[0].scrollHeight + bDiv[0].scrollHeight;
				//document.body.scrollTop = document.body.clientHeight;
			}
		},
		commentCheck = function() {
			var comment = nicolive.getComment();

			if(comment['message'] === '/failure') {
				console.log('/failure');
				clearInterval($.tid);
				nicolive.close();
				return;
 			} if(comment['message'] === '') {
 				if (is_cache) {
 					commentUpdate();
 					is_cache = false;
 				}
				return;
			} if (comment['message'].match(/\/disconnect/)) {
				if (comment['premium'] === '2' || comment['premium'] === '3')
				clearInterval($.tid);
				nicolive.close();
				return;
			}
			is_cache = true;
			commentUpdate(comment);
		};

	// 以下初期化処理
	live_info = getLiveInfo();
	document.title = live_info[1];
	nicolive = new $.nico.live(live_info[0]);

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer(function() {
			$('#comments').flexigrid({
				colModel : [
					{display: 'No.', name : 'no', width : 15, sortable : true, align: 'center'},
					{display: 'コメント', name : 'message', width : 600, sortable : true, align: 'left'},
					{display: 'ユーザー', name : 'user_id', width : 80, sortable : true, align: 'center'},
					{display: '時刻', name : 'date', width : 40, sortable : true, align: 'center'}
				],
				height: 'auto',
				sortname: 'no',
				sortorder: 'asc',
				nowrap: false,
				dataType: 'json'
			});
			bDiv = $('.flexigrid .bDiv');
			tid = setInterval(commentCheck, 30);
		});
	});
})();

