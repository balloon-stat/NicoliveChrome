(function() {
  var COMMENT_NEED_INFO;
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
    var checkComment, parseComment;
    function _Class(nc) {
      this.nc = nc;
    }
    _Class.prototype.connectCommentServer = function(server) {
      this.server = server;
      this.nc.connect(this.server['addr'], this.server['port']);
      return this.nc.requestComment(this.server['thread'], '500');
    };
    _Class.prototype.getComment = function() {
      var comment;
      this.comments = [];
      while (comment = parseComment()) {
        this.comments.push(comment);
      }
      return this.comments;
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
      return checkComment(commented);
    };
    checkComment = function(comment) {
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
