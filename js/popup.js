(function() {
	var nicolive,
		live_info,
		bDiv,
		refreshSwatch,
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
				comment_data[comment['no']] = comment;
				comments.push({
					id: comment_data.length,
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
			comments = [];
			commentViewUpdateAll(function(elem) {
				$(elem).jeegoocontext('custom_context',{
					widthOverflowOffset: 0,
					heightOverflowOffset: 3,
					onSelect: function(e, target) {
						if(!target) return;
						var type = $(this).attr('id');
						contextSelect(type, $(target));
					}
				});
			});
			if (s_offset === 0) {
				bDiv.scrollTop(bDiv[0].scrollHeight);
			}
		},
		commentViewUpdate = function(row) {
			var $$ = $(row),
				user_id = $$.find('td').eq(2),
				comment_no = $$.find('td').eq(0).text(),
				comment_info = comment_data[comment_no];
				console.log(comment_info);
			nicolive.indexedDB.getData('user', 'id', comment_info['user_id'], function(data) {
				user_id.find('div').text(data['name']);
				$$.css('background-color', data['color']);
			});
		},
		commentViewUpdateAll = function(callback) {
			var that = this;
			$('#comments tr')
				.each(function() {
					commentViewUpdate(this);
					if(!!callback) callback.call(that, this);
				})
			;
		},
		contextSelect = function(type, target) {
			var no = target.find('td').eq(0).text(),
				comment_info = comment_data[no];
			switch(type) {
				case 'user_info':
					console.log('user info show');
					break;
				case 'naming':
					var user_info = {};
					console.log('naming');
					nicolive.indexedDB.getData('user', 'id', comment_info['user_id'], function(data) {
						if(comment_info['anonymity'] === '0') {
							var info = $($.nico.getUserInfo(comment_info['user_id']).responseText);
							user_info['name'] = info.find('strong').text();
						}
						if(data['id'] === data['name']) {
							if(user_info['name']) {
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
									//console.log(comment_info['user_id'] + ' の名前�?' + naming.val() + 'に変更しました.');
									commentViewUpdateAll();
									naming.val('');
									$(this).dialog('close');
								}
							}]
						});
					});
					break;
				case 'coloring':
					console.log('coloring');
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
								console.log(comment_info['user_id'] + ' の色�?' + RGB + 'に変更しました.');
								// TODO 過去コメントを更新
								commentViewUpdateAll();
								// TODO スライ�??の値を今までの色とできる�?��か�?らな�?��にセ�?��しておく
								$(this).dialog('close');
							}
						}]
					});
					break;
				case 'comment_copy':
					console.log('comment copy');
					break;
				case 'id_copy':
					console.log('ID copy');
					break;
				case 'tmp_hide':
					console.log('tmpolally hide');
					break;
				case 'profile_page':
					console.log('profile page jamp');
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
	 			}
			}
			is_cache = true;
			commentUpdate(comment);
		};

	live_info = getLiveInfo();
	document.title = live_info[1];
	nicolive = new $.nico.live(live_info[0]);

	nicolive.getPlayerStatusXML(function() {
		nicolive.connectCommentServer();
		$('#comments').flexigrid({
			colModel : [
				{display: 'No.', name : 'no', width : 25, align: 'center'},
				{display: '名前', name : 'message', width : 520, align: 'left'},
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
		$.tid = setInterval(commentCheck, 30);
	});
})();

