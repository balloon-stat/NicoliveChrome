(function($) { 
	var GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v=',
		USER_STATUS = 'http://www.nicovideo.jp/user/',
		INDEXED_DB_VERSION = '1.5.0';
	$.extend({
		nico: (function() {
			var nicolive = function(lv_id, plugin) {
					var plugin_name = plugin || 'plugin',
						plugin = $('#' + plugin_name);
					if (!(this instanceof nicolive)) return new nicolive(lv_id);
					if (!plugin) throw new Error('NPAPIƒIƒuƒWƒFƒNƒg‚ª‚ ‚è‚Ü‚¹‚ñ');
					this.lv_id = lv_id;
					this.nc = plugin[0].NiconamaClient();
					this.indexedDB = new $.indexedDB('nicolive', INDEXED_DB_VERSION);
				},
				msec2m_s = function(msec) {
					var sec = Math.round(msec / 1000),
						min = Math.floor(sec / 60);
					sec = sec - 60 * min;
					return [min, sec];
				},
				zero_fill = function(num, fill) {
					var fill = fill || 2,
						filled_zero = '0';
					for(var i=0; i<fill-1; i++) {
						filled_zero += filled_zero;
					}
					return (filled_zero + num).slice(-fill);
				},
				getUserInfo = function(user_id, callback, async) {
					// TODO ajaxã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆãŒè¿”ã£ã¦ã—ã¾ã†(user_infoã‚’returnã—ãŸã„)
					$.ajax({
						url: USER_STATUS + user_id,
						async: !!async,
						success: function(data, dataType) {
							var user_info = {};
							user_info['name'] = $(data).find('strong').text();
							user_info['thumbnail'] = $(data).find('#accountFace').children('img').attr('src');
							if(callback) callback(user_info);
							return user_info;
						},
						error: function(request, status, thrown) {
							if(!callback) return;
							callback();
						}
					});
				};
			nicolive.prototype = {
				getPlayerStatusXML: function(callback) {
					var that = this,
						request_status = GET_PLAYER_STATUS + this.lv_id;
					$.ajax({
						url: request_status,
						type: 'GET',
						dataType: 'xml',
						success: function(data, dataType) {
							var live_info = {},
								stream_lines = ['title', 'description', 'owner_id', 'start_time', 'default_community'];
							$(data)
								.find('getplayerstatus')
								.tap(function() {
									var status = this.attr('status');
									if(status === 'fail')
										throw new Error('getPlayerStatus\'s status is fail');
									live_info.status = status;
								})
									.find('stream')
									.tap(function() {
										live_info.stream = {};
										$.each(stream_lines, function(index, value) {
											live_info.stream[value] = $(this).find(value).text();
										});
										that.lv_id = this.find('id').text();
									})
								.end()
									.find('ms')
									.tap(function() {
										live_info.ms = {};
										this.children().each(function() {
											live_info.ms[this.tagName] = $(this).text();
										})
									})
								.end()
							;
							that.live_info = live_info;
							that.indexedDB.addData('live', {
								id: that.lv_id,
								name: live_info.stream['title'],
								start: live_info.stream['start_time'],
								cid: live_info.stream['default_community'],
								caster: live_info.stream['owner_id']
							});
							that.getCommunityInfo();
							callback();
						}
					});
				},
				connectCommentServer: function(callback) {
					var host = this.live_info.ms['addr'],
						port = this.live_info.ms['port'],
						thread = this.live_info.ms['thread'];
					if (!this.nc) {
						throw new Error('NiconamaClient‚ª‚ ‚è‚Ü‚¹‚ñ');
					}
					this.nc.connect(host, port);
					this.nc.requestComment(thread, '500');
				},
				// TODO NPAPIã«ä»»ã?
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
					for(var i = 0, max = need_info.length; i < max; i++) {
						transed_comment[need_info[i]] = _comment.attr(need_info[i]);
						if(typeof transed_comment[need_info[i]] === 'undefined')
							transed_comment[need_info[i]] = '0';
					}
					transed_comment['message'] = _comment.text();
					m_seced_vpos = msec2m_s(transed_comment['vpos'] * 10)
							.map(function(time) {
								return zero_fill(time);
							});
					transed_comment['vpos'] = m_seced_vpos[0] + ':' + m_seced_vpos[1];
					if(transed_comment['user_id']) {
						this.indexedDB.addData('user', {
							id: transed_comment['user_id'],
							name: transed_comment['user_id'],
							color: 'white'
						});
					}
					return transed_comment;
				},
				jumpUserProfile: function(user_id) {
					window.open(USER_STATUS + user_id);
				},
				close: function() {
					console.log('nicolive close');
					this.nc.close();
				}
			};
			
			return {
				live: nicolive,
				getUserInfo: getUserInfo
			};
		})()
	});
})(jQuery);

