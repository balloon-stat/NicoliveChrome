(function() {
	var nicolive,
		live_info,
		tid,
		bDiv,
		comment_id = 0,
		popup_menu,
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

			if (comment) {
				comment_id++;
				comments.push({
					id: comment_id,
					cell: [
						comment['no'],
						comment['message'],
						comment['user_id'],
						comment['vpos']
					]
				});
				return;
			}

			s_offset = bDiv[0].scrollHeight - bDiv.scrollTop() - bDiv[0].clientHeight;
			if (is_first) {
				is_first = false;
				$('#comments').flexAddData({
					total: 1,
					page: 1,
					rows: comments
				});
				bDiv.scrollTop(bDiv[0].scrollHeight);
			} else {
				$('#comments').flexAppendData({
					total: 1,
					page: 1,
					rows: comments
				}, ':last');
			}
			$('#comments').find('tr')
				.each(function(){
					var popup = $.extend({}, popup_menu);
					popup.bind(this);
				});
			if (s_offset === 0) {
				console.log('ture');
				bDiv.scrollTop(bDiv[0].scrollHeight);
			}
			comments = [];
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
	
	popup_menu = new PopupMenu();
	popup_menu.add('ユーザー情報', function(target) {
		console.log(target);
	})
		.addSeparator()
		.add('名前をつける', function(target) {
			
		})
		.add('色をつける', function(target) {
			
		})
		.addSeparator()
		.add('コメントをコピー', function(target) {
			
		})
		.add('IDをコピー', function(target) {
			
		})
		.addSeparator()
		.add('一時的に表示する', function(target) {
			
		})
		.addSeparator()
		.add('プロフィールページを開く', function(target) {
			
		});
	popup_menu.setSize(180, 0);

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer(function() {
			$('#comments').flexigrid({
				colModel : [
					{display: 'No.', name : 'no', width : 25, sortable : true, align: 'center'},
					{display: 'コメント', name : 'message', width : 600, sortable : true, align: 'left'},
					{display: 'ユーザー', name : 'user_id', width : 80, sortable : true, align: 'center'},
					{display: '時刻', name : 'date', width : 40, sortable : true, align: 'center'}
				],
				height: '300',
				resizable: false,
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

