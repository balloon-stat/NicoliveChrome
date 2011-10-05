(function($) { 
	$.extend({
		nico: (function() {
			var GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v=',
				USER_STATUS = 'http://www.nicovideo.jp/user/',
				live_stream = ['title', 'description', 'owner_id', 'start_time', 'default_community'],
				nicolive = function(lv_num, plugin) {
					var plugin_name = plugin || 'plugin',
						plugin = $('#' + plugin_name);
					if (!(this instanceof nicolive)) {
						return new nicolive(lv_num);
					}
					if (!plugin) {
						throw new Error('NPAPIオブジェクトがありません');
					}
					this.lv_id = lv_num;
					this.nc = plugin[0].NiconamaClient();
					this.indexedDB = new $.indexedDB('nicolive', '1.4.4');
				};

			nicolive.prototype = {
				getPlayerStatusXML: function(callback) {
					var that = this,
						live_id = this.lv_id,
						request_status = GET_PLAYER_STATUS + live_id;
					$.ajax({
						url: request_status,
						type: 'GET',
						dataType: 'xml',
						success: function(data, dataType) {
							var live_info = {},
								$$ = $(data),
								stream = $$.find('stream');
							live_info.status = $$.find('getplayerstatus').attr('status');
							if(live_info.status === 'fail')
								throw new Error('getPlayerStatus\'s status is fail');
							live_info.ms = {};
							$$.find('ms').children().each(function() {
								live_info.ms[this.tagName] = $(this).text();
							});
							live_info.stream = {};
							$.each(live_stream, function(index, value) {
								live_info.stream[value] = stream.find(value).text();
							});
							that.live_info = live_info;
							that.lv_id = stream.find('id').text();
							
							that.indexedDB.addData('live', {
								id: that.lv_id,
								name: live_info.stream['title'],
								start: live_info.stream['start_time'],
								cid: live_info.stream['default_community'],
								caster: live_info.stream['owner_id']
							});
							that.getCommunityInfo();
							callback();
						},
					});
				},
				getUserInfo: function(user_id, callback) {
					console.log(USER_STATUS + user_id);
					return $.ajax({
						url: USER_STATUS + user_id,
						async: !!callback,
						success: function(data, dataType) {
							var $$ = $(data),
								user_info = {};
							user_info['name'] = $$.find('strong').text();
							console.log('success func');
							if(callback)
								callback(user_info);
							return user_info;
						},
						error: function(request, status, thrown) {
							if(!callback) return;
							callback();
						}
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
				},
				// TODO NPAPIに任す
				getCommunityInfo: function() {
					/*
						that.indexedDB.addData('community', {
							id: live_info.stream['default_community'],
							name: live_info.stream[''],
							owner: live_info.stream['owner_id'],
							level: ,
							members: 
						});
					*/
				},
				getComment: function() {
					var comment = this.nc.getComment(),
						_comment = $(comment),
						transed_comment = {},
						m_seced_vpos,
						need_info = ['thread', 'no', 'vpos', 'date', 'user_id', 'premium', 'anonymity'];
					if(!_comment.text()) {
						return false;
					}
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
						if(typeof transed_comment[need_info[i]] === 'undefined')
							transed_comment[need_info[i]] = '0';
					}
					transed_comment['message'] = _comment.text();
					m_seced_vpos = $.msec2m_s(transed_comment['vpos'] * 10)
							.map(function(time) {
								return $.zero_fill(time);
							});
					transed_comment['vpos'] = m_seced_vpos[0] + ':' + m_seced_vpos[1];
					
					// TODO コメントのDB保存(任意性)
					// TODO ユーザーのDB保存
					if(transed_comment['user_id']) {
						this.indexedDB.addData('user', {
							id: transed_comment['user_id'],
							name: transed_comment['user_id'],
							color: '#000000'
						});
					}
					return transed_comment;
				},
				close: function() {
					console.log('nicolive close');
					this.nc.close();
				}
			};
			
			return {
				live: nicolive
			};
		})()
	});
})(jQuery);

