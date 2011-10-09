(function() {
	var nicolive,
		live_info,
		tid,
		bDiv,
		refreshSwatch,
		comment_id = 0,
		is_cache = false,
		comments = [],
		comment_data = {},
		is_first = true,
		getLiveInfo = function() {
			var current_url = document.URL,
				liveid = current_url.match(/lv\d+/)
						|| current_url.match(/co\d+/),
				title = decodeURI(current_url).match(/t=.*$/)[0]
						.slice('t='.length, -1);
			return [liveid[0], title];
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
				comment_data[comment['no']] = comment;
				return;
			}

			s_offset = bDiv[0].scrollHeight - bDiv.scrollTop() - bDiv[0].clientHeight;
			if (is_first) {
				is_first = false;
				console.log(comments);
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
			comments = [];
			$('#comments tr')
				.each(function(){
					var $$ = $(this),
						user_id = $(this).find('td').eq(2),
						comment_no = $(this).find('td').eq(0).text(),
						comment_info = comment_data[comment_no];
					nicolive.indexedDB.getData('user', 'id', comment_info['user_id'], function(data) {
						user_id.find('div').text(data['name']);
						$$.css('background-color', data['color']);
					});
					console.log($(this));
					$(this)
					.unbind('contextmenu')
					.bind('contextmenu', function() {
						$(this).siblings().removeClass('trSelected');
						$(this).toggleClass('trSelected');
					}).jeegoocontext('custom_context',{
						widthOverflowOffset: 0,
						heightOverflowOffset: 3,
						onSelect: function(e, target) {
							if(!target) return;
							contextSelect($(this).attr('id'), $(target));
						}
					});
				})
			;
			if (s_offset === 0) {
				bDiv.scrollTop(bDiv[0].scrollHeight);
			}
		},
		commentViewUpdate = function() {
			$('#comments tr')
				.each(function() {
					var $$ = $(this),
						user_id = $(this).find('td').eq(2),
						comment_no = $(this).find('td').eq(0).text(),
						comment_info = comment_data[comment_no];
					nicolive.indexedDB.getData('user', 'id', comment_info['user_id'], function(data) {
						user_id.find('div').text(data['name']);
						$$.css('background-color', data['color']);
					});
				})
			;
		},
		contextSelect = function(context_id, target) {
			var comment_no = target.find('td').eq(0).text(),
				comment_info = comment_data[Number(comment_no)];
			console.log(comment_info);
			switch(context_id) {
				case 'user_info':
					console.log('ユーザー情報');
					break;
				case 'naming':
					var $$,
					user_info = {};
					console.log('名前をつける');
					if(comment_info['anonymity'] === '0') {
						console.log('not 184');
						$$ = $(nicolive.getUserInfo(comment_info['user_id']).responseText);
						user_info['name'] = $$.find('strong').text();
						console.log(user_info);
					}
					nicolive.indexedDB.getData('user', 'id', comment_info['user_id'], function(data) {
						if(data['id'] === data['name']) {
							if(user_info) {
								$('#naming_text').val(user_info['name']);
							}
						} else {
							$('#naming_text').val(data['name']);
						}
						$('#naming_dialog').dialog({
							modal: true,
							buttons: [{
								text: 'OK',
								click: function() {
									var naming = $(this).find('input:text');
									nicolive.indexedDB.updateData('user', 'id', comment_info['user_id'], {
										name: naming.val()
									});
									console.log(comment_info['user_id'] + ' の名前を ' + naming.val() + 'に変更しました.');
									commentViewUpdate();
									naming.val('');
									$(this).dialog('close');
								}
							}]
						});
					});
					break;
				case 'coloring':
					console.log('色をつける');
					$('#coloring_dialog').dialog({
						modal: true,
						width: 500,
						buttons: [{
							text: 'OK',
							click: function() {
								var r = $('#red').slider('value'),
									g = $('#green').slider('value'),
									b = $('#blue').slider('value'),
									RGB = '#' + $.hexFromRGB(r, g, b);
								console.log('R : ' + r + ', G : ' + g + ', B : ' + b);
								nicolive.indexedDB.updateData('user', 'id', comment_info['user_id'], {
									color: RGB
								});
								console.log(comment_info['user_id'] + ' の色を ' + RGB + 'に変更しました.');
								// TODO 過去コメントを更新
								commentViewUpdate();
								// TODO スライダーの値を今までの色とできるだけかぶらない色にセットしておく
								$(this).dialog('close');
							}
						}]
					});
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
		},
		commentCheck = function() {
			var comment = nicolive.getComment();

			if(!comment['message']) {
 				if (is_cache) {
	 				try {
 						commentUpdate();
 					} finally {
	 					is_cache = false;
	 				}
 				}
				return;
			}
			if(comment['premium'] === '2' || comment['premium'] === '3') {
				if(comment['message'] === '/failure') {
					console.log('/failure');
					clearInterval($.tid);
					nicolive.close();
					return;
	 			} if(comment['message'].match(/\/disconnect/)) {
					clearInterval($.tid);
					nicolive.close();
					return;
				}
			}
			is_cache = true;
			commentUpdate(comment);
		};

	// 以下初期化処理
	live_info = getLiveInfo();
	document.title = live_info[1];
	nicolive = new $.nico.live(live_info[0]);

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer();
		$('#comments').flexigrid({
			colModel : [
				{display: 'No.', name : 'no', width : 25, align: 'center'},
				{display: 'コメント', name : 'message', width : 520, align: 'left'},
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
		refreshSwatch = function() {
			var red = $('#red').slider( "value" ),
				green = $('#green').slider( "value" ),
				blue = $('#blue').slider( "value" ),
				hex = $.hexFromRGB( red, green, blue );
			$('#swatch').css('background-color', '#' + hex);
		};
		$('#red, #green, #blue').slider({
			orientation: "horizontal",
			range: "min",
			max: 255,
			value: 127,
			slide: refreshSwatch,
			change: refreshSwatch
		});
		$('#red').slider('value', 255);
		$('#green').slider('value', 140);
		$('#blue').slider('value', 60);
		bDiv = $('.flexigrid .bDiv');
		$('.hDivBox tr th :eq(1)').css('text-align', 'center');
		tid = setInterval(commentCheck, 30);
	});
})();

