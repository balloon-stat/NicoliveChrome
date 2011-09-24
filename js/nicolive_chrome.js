(function($) {
	$.escapeHTML = function(val) {
		return $('<div/>').text(val).html();
	};
	$.hexFromRGB = function(r, g, b) {
		var hex = [
			r.toString(16),
			g.toString(16),
			b.toString(16)
		];
		$.each(hex, function(nr, val) {
			if (val.length === 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('').toUpperCase();
	};
	$.contextSelect = function(context_id, target) {
		switch(context_id) {
			case 'user_info':
				console.log('ユーザー情報');
				break;
			case 'naming':
				console.log('名前をつける');
				$('#naming_dialog').dialog({
					modal: true,
					buttons: [{
						text: 'OK',
						click: function() {
							var naming = $(this).find('input:text');
							console.log($(this).find('input:text').val());
							naming.val('');
							$(this).dialog('close');
						}
					}]
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
							console.log($('#red').slider('value'));
							console.log($('#green').slider('value'));
							console.log($('#blue').slider('value'));
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
	};
})(jQuery);
