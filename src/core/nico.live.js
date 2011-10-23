(function() {
  var GET_PLAYER_STATUS;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  GET_PLAYER_STATUS = 'http://watch.live.nicovideo.jp/api/getplayerstatus?v=';
  $.nlcm.Live = (function() {
    var parsePlayerStatus, tid;
    tid = {};
    _Class.getLiveInfo = function(url) {
      var liveid, title;
      liveid = url.match(/lv\d+/) || url.match(/co\d+/);
      title = decodeURI(url).match(/t=.*$/)[0].slice('t='.length, -1);
      return {
        id: liveid[0],
        title: title
      };
    };
    function _Class(lv_id, plugin_name) {
      var nc, plugin;
      this.lv_id = lv_id;
      if (plugin_name == null) {
        plugin_name = 'plugin';
      }
      plugin = $("#" + plugin_name);
      nc = plugin[0].NiconamaClient();
      if (plugin == null) {
        throw new Error('NPAPIオブジェクトが見つかりません');
      }
      this.comment = new $.nlcm.Comment(nc);
    }
    parsePlayerStatus = function(player_status) {
      var live_info, stream_lines;
      live_info = {};
      stream_lines = ['id', 'title', 'description', 'owner_id', 'start_time', 'default_community'];
      $(player_status).find('getplayerstatus').tap(function() {
        var status;
        status = this.attr('status');
        if (status === 'fail') {
          throw new Error('getPlayerStatus\'s status is fail');
        }
        return live_info.status = status;
      }).find('stream').tap(function() {
        live_info.stream = {};
        return $.each(stream_lines, __bind(function(index, value) {
          return live_info.stream[value] = this.find(value).text();
        }, this));
      }).end().find('ms').tap(function() {
        live_info.ms = {};
        return this.children().each(function() {
          return live_info.ms[this.tagName] = $(this).text();
        });
      }).end().end();
      return live_info;
    };
    _Class.prototype.getPlayerStatusXML = function(callback) {
      var request_status;
      request_status = GET_PLAYER_STATUS + this.lv_id;
      return $.ajax({
        url: request_status,
        type: 'GET',
        dataType: 'xml',
        success: __bind(function(data, dataType) {
          this.live_info = parsePlayerStatus(data);
          this.lv_id = this.live_info.stream['id'];
          return callback();
        }, this)
      });
    };
    _Class.prototype.startComment = function(callback) {
      return this.getPlayerStatusXML(__bind(function() {
        this.comment.connectCommentServer(this.live_info['ms']);
        return tid = setInterval(__bind(function() {
          return this.readComment(callback);
        }, this), 30);
      }, this));
    };
    _Class.prototype.readComment = function(callback) {
      var comment;
      comment = this.comment.getComment();
      if (comment.length > 0) {
        return callback(comment);
      }
    };
    _Class.prototype.stopComment = function() {
      return clearInterval(tid);
    };
    _Class.prototype.close = function() {
      this.nc.close();
      return this.db.close();
    };
    return _Class;
  })();
}).call(this);
