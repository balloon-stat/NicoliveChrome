(function() {
  $.nlcm = {};
  $.nlcm.error = {};
  $.nlcm.error.CloseLiveError = (function() {
    function _Class(message) {
      this.message = message;
    }
    _Class.prototype.toString = function() {
      return "CloseLiveError " + this.message;
    };
    return _Class;
  })();
}).call(this);
