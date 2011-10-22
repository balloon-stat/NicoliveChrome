(function() {
  $.nlcm.User = (function() {
    _Class.USER_STATUS = 'http://www.nicovideo.jp/user/';
    function _Class(user_id, async) {
      this.user_id = user_id;
      if (async == null) {
        async = true;
      }
      $.ajax({
        url: this.USER_STATUS + this.user_id,
        async: async,
        success: function(data, dataType) {
          this.name = $(data).find('strong').text();
          return this.thumbnail = $(data).find('#accountFace').children('img').attr('src');
        },
        error: function(request, status, thrown) {}
      });
    }
    return _Class;
  })();
}).call(this);
