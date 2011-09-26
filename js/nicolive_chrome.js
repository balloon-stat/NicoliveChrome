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
})(jQuery);
