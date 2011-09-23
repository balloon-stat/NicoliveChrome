(function() {
	var nicolive,
		live_info,
		tid,
		bDiv,
		comment_id = 0,
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
					$(this).jeegoocontext('custom_context',{
						widthOverflowOffset: 0,
						heightOverflowOffset: 3,
						onSelect: function(e, target) {
							// TODO 左クリックを押した時のように色付ける(cssで)
							// TODO jQuery UI Dialogで小窓のモーダレス
							console.log(this);
							console.log(e);
							console.log(target);
							switch($(this).attr('id')) {
								case 'user_info':
									console.log('ユーザー情報');
									break;
								case 'naming':
									console.log('名前をつける');
									break;
								case 'coloring':
									console.log('色をつける');
									break;
								case 'comment_copy':
									console.log('コメントをコピー');
									break;
								case 'id_copy':
									console.log('IDをコピー');
									break;
								case 'tmp_hide':
									console.log('一時的に非表示');
									break;
								case 'profile_page':
									console.log('プロフィールページを開く');
									break;
								default:
									return false;
							}
						}
					});
				});
			if (s_offset === 0) {
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

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer(function() {
			$('#comments').flexigrid({
				colModel : [
					{display: 'No.', name : 'no', width : 25, align: 'center'},
					{display: 'コメント', name : 'message', width : 580, align: 'left'},
					{display: 'ユーザー', name : 'user_id', width : 80, align: 'center'},
					{display: '時刻', name : 'date', width : 40, align: 'center'}
				],
				height: '300',
				resizable: false,
				nowrap: false,
				singleSelect: true,
				striped: false,
				dataType: 'json'
			});
			bDiv = $('.flexigrid .bDiv');
			$('.hDivBox tr th :eq(1)').css('text-align', 'center');
			tid = setInterval(commentCheck, 30);
		});
	});
})();

