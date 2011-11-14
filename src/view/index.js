(function() {
  var lvId, nicolive;
  lvId = $.nlcm.Live.getLiveId(document.URL);
  nicolive = new $.nlcm.Live(lvId);
  window.onbeforeunload = function() {
    return nicolive.close();
  };
  nicolive.getPlayerStatusXML(function() {
    document.title = this.live_info.stream['title'];
    return this.startComment(function(comments) {
      $('#comments').comment(comments);
      nicolive.comment.commentUpdate();
      return $('#comments tr').menu(nicolive.comment);
    });
  });
}).call(this);
