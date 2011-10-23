(function() {
  $.nlcm.User = (function() {
    _Class.USER_STATUS = 'http://www.nicovideo.jp/user/';
    _Class.jumpUserProfile = function(user_id) {
      return window.open(this.USER_STATUS + user_id);
    };
    _Class.getUserInfo = function(user_id, callback, async) {
      if (async == null) {
        async = true;
      }
      return $.ajax({
        url: this.USER_STATUS + user_id,
        async: async,
        success: function(data, dataType) {
          var name, thumbnail;
          name = $(data).find('strong').text();
          thumbnail = $(data).find('#accountFace').children('img').attr('src');
          return callback(name, thumbnail);
        }
      });
    };
    function _Class(user_id, async) {
      this.user_id = user_id;
      if (async == null) {
        async = false;
      }
      $.ajax({
        url: this.USER_STATUS + this.user_id,
        async: async,
        success: function(data, dataType) {
          this.name = $(data).find('strong').text();
          return this.thumbnail = $(data).find('#accountFace').children('img').attr('src');
        }
      });
    }
    return _Class;
  })();
}).call(this);
