(function() {
  var refreshSwatch;
  refreshSwatch = function() {
    var blue, green, hex, red;
    red = $('#red').slider('value');
    green = $('#green').slider('value');
    blue = $('#blue').slider('value');
    hex = $.hexFromRGB(red, green, blue);
    return $('#swatch').css('background-color', '#' + hex);
  };
  $('#red, #green, #blue').slider({
    orientation: 'horizontal',
    range: 'min',
    max: 255,
    value: 127,
    slide: refreshSwatch,
    change: refreshSwatch
  });
  $('#red').slider('value', 255);
  $('#green').slider('value', 140);
  $('#blue').slider('value', 60);
}).call(this);
