(function() {
	var nicolive,
		live_info,
		tid,
		bDiv,
		refreshSwatch,
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
			$('#comments tr')
				.each(function(){
					$(this).bind('contextmenu', function() {
						console.log('context select');
						$(this).addClass('trSelected');
						$(this).siblings().removeClass('trSelected');
					})
					.jeegoocontext('custom_context',{
						widthOverflowOffset: 0,
						heightOverflowOffset: 3,
						onSelect: function(e, target) {
							console.log(this);
							console.log(e);
							console.log(target);
							$.contextSelect($(this).attr('id'), target);
						}
					});
				})
			;
			if (s_offset === 0) {
				bDiv.scrollTop(bDiv[0].scrollHeight);
			}
			comments = [];
		},
		commentCheck = function() {
			var comment = nicolive.getComment();

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
			if(comment['message'] === '') {
 				if (is_cache) {
 					commentUpdate();
 					is_cache = false;
 				}
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
		nicolive.connectCommentServer();
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

