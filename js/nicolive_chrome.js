(function($) {
	$.fn.tap = function(func, that) {
		var that = that || this;
		func.call(that, this);
		return this;
	};
	$.escapeHTML = function(val) {
		return $('<div/>').text(val).html();
	};
	$.copy = function(text) {
		var input, success;
		if ("console" in window && "notifyFirebug" in console) {
			console.notifyFirebug([text], "copy", "firebugExecuteCommand");
			success = true;
		} else {
			input = document.createElement("input");
			input.style.position = "absolute";
			input.style.top = "-100px";
			input.value = text;
			input.hidden = true;
			document.body.appendChild(input);
			input.select();
			try {
				success = document.execCommand("copy", false, null);
			} catch (ex) {
				success = false;
			} finally {
				document.body.removeChild(input);
			}
		}
		if (!success) {
			prompt("Press Ctrl+V", text);
		}
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
