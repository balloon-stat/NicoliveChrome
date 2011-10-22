(function() {
  var live_info, nicolive;
  live_info = getLiveInfo(document.URL);
  document.title = live_info['title'];
  nicolive = new $.nlcm.live(live_info[0]);
  window.onbeforeunload = function() {
    return nicolive.close();
  };
  nicolive.startComment(function(comment) {
    return console.log(comment);
  });
}).call(this);
