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
								throw new Error('getPlayerStatus\'s status is fail');
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
					this.nc.requestComment(thread, '500');
					callback();
				},
				getComment: function() {
					var comment = this.nc.getComment(),
						_comment = $(comment),
						transed_comment = {},
						m_seced_vpos,
						need_info = ['thread', 'no', 'vpos', 'date', 'user_id', 'premium'];
					$.extend({
						msec2m_s: function(msec) {
							var sec = Math.round(msec / 1000),
								min = Math.floor(sec / 60);
							sec = sec - 60 * min;
							return [min, sec];
						},
						zero_fill: function(num, fill) {
							var fill = fill || 2,
								filled_zero = '0';
							for(var i=0; i<fill-1; i++) {
								filled_zero += filled_zero;
							}
							return (filled_zero + num).slice(-fill);
						}
					});

					for(var i = 0; i < need_info.length; i++) {
						transed_comment[need_info[i]] = _comment.attr(need_info[i]);
					}
					transed_comment['message'] = _comment.text();
					m_seced_vpos = $.msec2m_s(transed_comment['vpos'] * 10)
							.map(function(time) {
								return $.zero_fill(time);
							});
					transed_comment['vpos'] = m_seced_vpos[0] + ':' + m_seced_vpos[1];
					return transed_comment;
				},
				close: function() {
					console.log('nicolive close');
					this.nc.close();
				}
			});
			
			return {
				live: nicolive
			};
		})()
	});
})();

