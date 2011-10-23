(function() {
  var COMMENT_NEED_INFO, INDEXED_DB_VERSION;
  INDEXED_DB_VERSION = '1.5.0';
  COMMENT_NEED_INFO = ['thread', 'no', 'vpos', 'date', 'user_id', 'premium', 'anonymity'];
  $.nlcm.error.CommentError = (function() {
    function _Class(message) {
      this.message = message;
    }
    _Class.prototype.toString = function() {
      return "CommentError " + this.message;
    };
    return _Class;
  })();
  $.nlcm.Comment = (function() {
    var parseComment;
    function _Class(nc) {
      this.nc = nc;
      this.comments_all = [];
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
        comments.push({
          id: this.comments_all.length,
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
    _Class.prototype.getCommentInfo = function(comment_no) {
      var user_id;
      user_id = this.getCommentByNo[comment_no]['user_id'];
      return this.db.getData('user', 'id', user_id);
    };
    _Class.prototype.updateComment = function(comment_no, redata) {
      var user_id;
      user_id = this.getCommentByNo[comment_no]['user_id'];
      return this.db.updateData('user', 'id', user_id, redata);
    };
    _Class.prototype.commentUpdate = function() {
      return $('#comments tr').each(function() {
        var $$, comment_info, comment_no, user_id;
        $$ = $(this);
        user_id = $$.find('td').eq(2);
        comment_no = $$.find('td').eq(0).text();
        comment_info = this.getCommentInfo(comment_no);
        user_id.find('div').text(comment_info['name']);
        return $$.css('background-color', comment_info['color']);
      });
    };
    parseComment = function() {
      var $$, comment, commented, info, _i, _len;
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
      return this.checkComment(commented);
    };
    _Class.prototype.checkComment = function(comment) {
      var is_administor;
      is_administor = comment['premium'] === '2' || comment['premium'] === '3';
      if (is_administor && comment['message'] === '/failure') {
        throw new $.nlcm.error.CommentError('close');
      }
      return comment;
    };
    return _Class;
  })();
}).call(this);
