(function() {
  var is_first;
  is_first = true;
  $.fn.comment = function(comments) {
    var bDiv, s_offset;
    bDiv = $('.flexigrid .bDiv');
    s_offset = bDiv[0].scrollHeight - bDiv.scrollTop() - bDiv[0].clientHeight;
    if (is_first) {
      is_first = false;
      this.flexAddData({
        total: 1,
        page: 1,
        rows: comments
      });
      bDiv.scrollTop(bDiv[0].scrollHeight);
    } else {
      this.flexAppendData({
        total: 1,
        page: 1,
        rows: comments
      }, ':last');
    }
    if (s_offset === 0) {
      return bDiv.scrollTop(bDiv[0].scrollHeight);
    }
  };
}).call(this);
