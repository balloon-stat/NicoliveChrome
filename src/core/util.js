(function() {
  Number.prototype.times = function(f) {
    var i, _results;
    _results = [];
    for (i = 1; 1 <= this ? i <= this : i >= this; 1 <= this ? i++ : i--) {
      _results.push(f(i));
    }
    return _results;
  };
  $.fn.tap = function(func, that) {
    that || (that = this);
    func.call(that, this);
    return this;
  };
  $.nlcm.Util = (function() {
    function _Class() {}
    _Class.escapeHTML = function(val) {
      return $('<div/>').text(val).html();
    };
    _Class.hexFromRGB = function(r, g, b) {
      var hex;
      hex = [r.toString(16), g.toString(16), b.toString(16)];
      $.each(hex, function(nr, val) {
        if (val.length === 1) {
          return hex[nr] = '0' + val;
        }
      });
      return hex.join('').toUpperCase();
    };
    return _Class;
  })();
}).call(this);
