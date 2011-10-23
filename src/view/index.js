(function() {
  var live_info, nicolive;
  live_info = $.nlcm.Live.getLiveInfo(document.URL);
  document.title = live_info['title'];
  nicolive = new $.nlcm.Live(live_info['id']);
  window.onbeforeunload = function() {
    return nicolive.close();
  };
  nicolive.startComment(function(comments) {
    $('#comments').comment(comments);
    nicolive.comment.commentUpdate();
    return $('#comments tr').menu(nicolive.comment);
  });
}).call(this);
