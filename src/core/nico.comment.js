(function() {
  var COMMENT_NEED_INFO, INDEXED_DB_VERSION;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  INDEXED_DB_VERSION = '1.5.0';
  COMMENT_NEED_INFO = ['no', 'thread', 'vpos', 'date', 'user_id', 'premium', 'anonymity'];
  $.nlcm.Comment = (function() {
    var fill_zero, msec2m_s, parseComment;
    function _Class(nc) {
      this.nc = nc;
      this.comments_all = {};
      this.count = 0;
      this.db = new $.nlcm.DB('nicolive', INDEXED_DB_VERSION);
    }
    _Class.prototype.connectCommentServer = function(server) {
      this.server = server;
      this.nc.connect(this.server['addr'], this.server['port']);
      this.nc.requestComment(this.server['thread'], '500');
      return console.log('コメントサーバに接続しました');
    };
    _Class.prototype.getComment = function(save) {
      var comment, comments;
      if (save == null) {
        save = true;
      }
      comments = [];
      while (comment = parseComment.call(this)) {
        this.comments_all[comment['no']] = comment;
        this.count += 1;
        comments.push({
          id: this.count,
          cell: [comment['no'], comment['message'], comment['user_id'], comment['vpos']]
        });
        if (save) {
          this.db.addData('user', {
            id: comment['user_id'],
            name: comment['user_id'],
            color: 'white'
          });
        }
      }
      return comments;
    };
    _Class.prototype.getCommentByNo = function(comment_no) {
      return this.comments_all[comment_no];
    };
    _Class.prototype.getCommentInfo = function(comment_no, callback) {
      var user_id;
      user_id = this.getCommentByNo(comment_no)['user_id'];
      return this.db.getData('user', 'id', user_id, callback);
    };
    _Class.prototype.updateComment = function(comment_no, redata) {
      var user_id;
      user_id = this.getCommentByNo(comment_no)['user_id'];
      return this.db.updateData('user', 'id', user_id, redata);
    };
    _Class.prototype.commentUpdate = function() {
      var that;
      that = this;
      return $('#comments tr').each(function() {
        var $$, comment_no, user_id;
        $$ = $(this);
        user_id = $$.find('td').eq(2);
        comment_no = $$.find('td').eq(0).text();
        return that.getCommentInfo(comment_no, __bind(function(comment_info) {
          user_id.find('div').text(comment_info['name']);
          return $$.css('background-color', comment_info['color']);
        }, this));
      });
    };
    msec2m_s = function(msec) {
      var min, sec;
      sec = Math.round(msec / 1000);
      min = Math.floor(sec / 60);
      sec = sec - 60 * min;
      return [min, sec];
    };
    fill_zero = function(num, fill) {
      var filled;
      fill || (fill = 2);
      filled = '0';
      fill.times(function(i) {
        return filled += filled;
      });
      return (filled + num).slice(-fill);
    };
    parseComment = function() {
      var $$, comment, commented, info, vpos, _i, _len;
      comment = this.nc.getComment();
      $$ = $(comment);
      commented = {};
      if (!$$.text()) {
        return false;
      }
      commented['message'] = $$.text();
      for (_i = 0, _len = COMMENT_NEED_INFO.length; _i < _len; _i++) {
        info = COMMENT_NEED_INFO[_i];
        commented[info] = $$.attr(info);
        if (commented[info] == null) {
          commented[info] = '0';
        }
      }
      vpos = msec2m_s(commented['vpos'] * 10).map(function(time) {
        return fill_zero(time);
      });
      commented['vpos'] = vpos[0] + ':' + vpos[1];
      return this.checkComment(commented);
    };
    _Class.prototype.checkComment = function(comment) {
      var is_administor, is_close;
      is_administor = comment['premium'] === '2' || comment['premium'] === '3';
      is_close = comment['message'] === '/failure' || comment['message'] === '/disconnect';
      if (is_administor && is_close) {
        throw new Error('disconnect');
      }
      return comment;
    };
    return _Class;
  })();
}).call(this);
