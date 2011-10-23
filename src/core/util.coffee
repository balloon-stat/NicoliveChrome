$.fn.tap = (func, that) ->
	that or= this
	func.call(that, this)
	return this

$.nlcm.Util = class
	constructor: () ->
	@escapeHTML: (val) ->
		$('<div/>').text(val).html()

	@hexFromRGB: (r, g, b) ->
		hex = [
			r.toString(16)
			g.toString(16)
			b.toString(16)
		]
		$.each(hex, (nr, val) ->
			if (val.length is 1)
				hex[nr] = '0' + val
		)
		hex.join('').toUpperCase()
