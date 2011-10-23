refreshSwatch = ->
	red = $('#red').slider('value')
	green = $('#green').slider('value')
	blue = $('#blue').slider('value')
	hex = $.hexFromRGB(red, green, blue)
	$('#swatch').css('background-color', '#' + hex)

$('#red, #green, #blue').slider(
	orientation: 'horizontal'
	range: 'min'
	max: 255
	value: 127
	slide: refreshSwatch
	change: refreshSwatch
)
$('#red').slider('value', 255)
$('#green').slider('value', 140)
$('#blue').slider('value', 60)
