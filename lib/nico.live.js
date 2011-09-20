/*
	ニコニコ生放送用JavaScriptAPIオブジェクト
	2011/09/09 Kokudori
*/
(function() { 
	$.extend({
		nico: (function() {
			var GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v=',
				USER_STATUS = 'http://www.nicovideo.jp/user/',
				baseweb = function() {},
				nicolive = function(lv_num) {
					var plugin = $('#plugin');
					if (!(this instanceof nicolive)) {
						return new nicolive(lv_num);
					}
					if (!plugin) {
						throw new Error('NPAPIオブジェクトがありません');
					}
					this.lv_id = lv_num;
					this.live_info = {};
					this.nc = plugin[0].NiconamaClient();
				};
			
			baseweb.prototype = {
				
			};

			nicolive.prototype = $.extend({}, baseweb.prototype, {
				getPlayerStatusXML: function(callback) {
					var that = this,
						live_id = this.lv_id,
						request_status = GET_PLAYER_STATUS + live_id;
					$.ajax({
						url: request_status,
						type: 'GET',
						dataType: 'xml',
						success: function(request, dataType) {
							if (!request) {
								throw new Error(url + 'へのリクエストに対するレスポンスが空です');
							}
							var live_info = {},
								$$ = $(request);
							live_info.status = $$.find('getplayerstatus').attr('status');
							if (live_info.status === 'fail')
								throw new Error("getPlayerStatus's status is fail");
							live_info.ms = {};
							$$.find('ms').children().each(function() {
								live_info.ms[this.tagName] = $(this).text();
							});
							that.live_info = live_info;
							callback();
						},
					});
				},
				connectCommentServer: function(callback) {
					var host = this.live_info.ms['addr'],
						port = this.live_info.ms['port'],
						thread = this.live_info.ms['thread'];
					if (!this.nc) {
						throw new Error('NiconamaClientがありません');
					}
					this.nc.connect(host, port);
					this.nc.requestComment(thread, "500");
					callback();
				},
				getComment: function() {
					var comment = this.nc.getComment(),
						_comment = $(comment),
						transed_comment = {},
						need_info = ["thread", "no", "vpos", "date", "user_id", "premium"];

					for(var i = 0; i < need_info.length; i++) {
						transed_comment[need_info[i]] = _comment.attr(need_info[i]);
					}
					transed_comment['comment'] = _comment.text();
					return transed_comment;
				},
				close: function() {
					console.log("nicolive close");
					this.nc.close();
				}
			});
			
			return {
				live: nicolive
			};
		})()
	});
})();

